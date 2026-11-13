// Home-country road distances between every pair of a country's main cities (openrouteservice Directions).
// Data only: nothing here is read by the website. Resumable; stops before the daily quota is gone.
//
//   node tools/expansion/home-routes.mjs --set=uk [--max-requests=700] [--delay-ms=1900] [--dry-run]
//
// Reads data/expansion/<set>/cities.json, writes data/expansion/<set>/routes.json. The key comes from
// ORS_API_KEY and is never printed. The home country is learned from the first route (longest country).
// A route that touches another country for at least 1 km is asked again with that country avoided.
import fs from "node:fs";
import path from "node:path";
import { straightLineMiles } from "../../src/lib/road-distance.js";
import { buildPairs, readCountries, foreignIds, ratioFlag } from "../../src/lib/expansion-routes.js";

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [name, value = "true"] = arg.replace(/^--/, "").split("=");
  return [name, value];
}));
const set = args.set;
if (!set || !/^[a-z]{2}$/.test(set)) throw new Error("--set=<two-letter code> is required (for example uk)");
const maxRequests = Number(args["max-requests"] ?? 700);
const delayMs = Number(args["delay-ms"] ?? 1900);
const dryRun = args["dry-run"] === "true";
const host = (args.host ?? "https://api.heigit.org/openrouteservice").replace(/\/+$/, "");
const dir = path.resolve(`data/expansion/${set}`);
const citiesFile = path.join(dir, "cities.json");
const outFile = path.join(dir, "routes.json");
const MIN_REMAINING = 60;
const KM_PER_MILE = 1.609344;

const cities = JSON.parse(fs.readFileSync(citiesFile, "utf8")).cities;
const pairs = buildPairs(cities);
const out = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : { routes: {}, reverse_sample: {} };
out.routes ??= {}; out.reverse_sample ??= {};
const todo = pairs.filter(pair => out.routes[pair.key]?.status !== "ok");
console.log(`set=${set} cities=${cities.length} pairs=${pairs.length} pending=${todo.length} max_requests=${maxRequests}`);
if (dryRun) process.exit(0);

const key = process.env.ORS_API_KEY;
if (!key) { console.error("ORS_API_KEY is not set."); process.exit(1); }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let requests = 0, stop = null, lastRate = null, sinceSave = 0;
let homeId = out.metadata?.home_country_id ?? null;
let previousTotal = out.metadata?.api_requests_total_runs ?? 0, counted = 0;

function save() {
  previousTotal += requests - counted; counted = requests;
  out.metadata = {
    set, provider: "openrouteservice by HeiGIT (Standard plan)", endpoint: "v2/directions/driving-car",
    profile: "driving-car (car, not a moving truck)", unit_distance: "km", unit_duration: "seconds",
    routing: "default fastest route; a route touching another country (>= 1 km) is asked again with that country avoided",
    attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap", licence: "CC-BY-SA 4.0 (results obtained from openrouteservice)",
    terms: "https://account.heigit.org/info/tos", home_country_id: homeId, cities: cities.map(city => city.id),
    api_requests_total_runs: previousTotal, rate_limit_headers_last_response: lastRate, updated_at: new Date().toISOString()
  };
  const values = Object.values(out.routes);
  out.summary = {
    total_pairs: pairs.length, ok: values.filter(v => v.status === "ok").length, failed: values.filter(v => v.status === "failed").length,
    complete: pairs.every(pair => out.routes[pair.key]?.status === "ok"), asked_again_avoiding_foreign: values.filter(v => v.method === "avoid-foreign").length,
    still_touching_foreign: values.filter(v => v.foreign_ids?.length).length, flagged: values.filter(v => v.flag).length,
    reverse_sample_n: Object.keys(out.reverse_sample).length,
    reverse_max_diff_pct: Object.values(out.reverse_sample).reduce((max, v) => Math.max(max, v.diff_pct), 0), stop_reason: stop
  };
  fs.writeFileSync(`${outFile}.tmp`, `${JSON.stringify(out)}\n`);
  fs.renameSync(`${outFile}.tmp`, outFile);
}

async function ask(from, to, avoid = []) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (requests >= maxRequests) { stop = "self_cap"; return { quota: true }; }
    requests += 1;
    const body = { coordinates: [[from.lon, from.lat], [to.lon, to.lat]], radiuses: [-1, -1], geometry: false, instructions: false, units: "km", extra_info: ["countryinfo"] };
    if (avoid.length) body.options = { avoid_countries: avoid };
    let response, text;
    try {
      response = await fetch(`${host}/v2/directions/driving-car/json`, { method: "POST", headers: { Authorization: key, "Content-Type": "application/json", Accept: "application/json", "User-Agent": "relocation-cost-expansion/1.0 (+https://github.com/Fadhel-docom/relocation-cost)" }, body: JSON.stringify(body) });
      text = await response.text();
    } catch (error) {
      if (attempt < 2) { await sleep(10000); continue; }
      return { ok: false, error: `network_${error.code ?? "error"}` };
    }
    lastRate = { limit: response.headers.get("x-ratelimit-limit"), remaining: response.headers.get("x-ratelimit-remaining"), reset: response.headers.get("x-ratelimit-reset") };
    await sleep(delayMs);
    if (response.ok) {
      const json = JSON.parse(text);
      const summary = json?.routes?.[0]?.summary;
      if (typeof summary?.distance !== "number") return { ok: false, error: "no_route_in_response" };
      const remaining = Number(lastRate.remaining);
      if (Number.isFinite(remaining) && remaining < MIN_REMAINING) stop = "quota_low";
      return { ok: true, km: Math.round(summary.distance * 100) / 100, seconds: Math.round(summary.duration), countries: readCountries(json) };
    }
    if (response.status === 401 || response.status === 403) { stop = /quota/i.test(text) ? "quota_exceeded" : "auth_error"; return { quota: true }; }
    if ((response.status === 429 || response.status >= 500) && attempt < 2) { await sleep(Math.min(Number(response.headers.get("retry-after")) || 30, 120) * 1000); continue; }
    return { ok: false, error: `http_${response.status} ${text.slice(0, 160)}` };
  }
  return { ok: false, error: "gave_up" };
}

async function route(pair) {
  const from = cities[pair.i], to = cities[pair.j];
  let answer = await ask(from, to);
  if (answer.quota) return null;
  if (!answer.ok) return { status: "failed", error: answer.error };
  if (homeId == null && answer.countries.available) homeId = answer.countries.longestId;
  let method = "direct";
  const foreign = answer.countries.available ? foreignIds(answer.countries, homeId) : [];
  if (foreign.length) {
    const again = await ask(from, to, foreign);
    if (again.quota) return null;
    if (again.ok) { answer = again; method = "avoid-foreign"; }
  }
  const straightKm = Math.round(straightLineMiles(from, to) * KM_PER_MILE * 10) / 10;
  return {
    status: "ok", method, km: answer.km, seconds: answer.seconds, straight_km: straightKm,
    ratio: Math.round((answer.km / straightKm) * 1000) / 1000, flag: ratioFlag(answer.km, straightKm),
    country_ids: answer.countries.ids, foreign_ids: answer.countries.available ? foreignIds(answer.countries, homeId) : null,
    ...(foreign.length ? { first_foreign_ids: foreign } : {})
  };
}

for (const pair of todo) {
  if (stop) break;
  const result = await route(pair);
  if (!result) break;
  out.routes[pair.key] = result;
  if (++sinceSave >= 25) { save(); sinceSave = 0; console.log(`progress ${Object.values(out.routes).filter(v => v.status === "ok").length}/${pairs.length} requests=${requests}`); }
}

// reverse-direction sample: every 16th direct route, asked to to from
if (!stop) {
  let index = 0;
  for (const pair of pairs) {
    const entry = out.routes[pair.key];
    if (entry?.status !== "ok") continue;
    if (index++ % 16 !== 0 || out.reverse_sample[pair.key]) continue;
    if (stop) break;
    const reverse = await ask(cities[pair.j], cities[pair.i], entry.method === "avoid-foreign" ? entry.first_foreign_ids : []);
    if (reverse.quota) break;
    if (reverse.ok) out.reverse_sample[pair.key] = { forward_km: entry.km, reverse_km: reverse.km, diff_pct: Math.round((Math.abs(entry.km - reverse.km) / ((entry.km + reverse.km) / 2)) * 10000) / 100 };
  }
}
save();
console.log(JSON.stringify({ requests, summary: out.summary, rate: lastRate }));
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `status=${stop ?? (out.summary.complete ? "complete" : "partial")}\n`);
process.exit(stop === "auth_error" ? 1 : 0);
