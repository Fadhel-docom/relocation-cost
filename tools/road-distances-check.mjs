// Two read-only audits of data/road-distances.json against openrouteservice (HeiGIT). Nothing in the
// distance table or on main is changed: results go to data/road-distances-checks.json (data branch).
//
//   B6  --mode=cities   do the 44 city-pair routes stay inside the United States? (countryinfo extra)
//   B7  --mode=reverse  does asking to->from give about the same miles as the stored from->to?
//
//   node tools/road-distances-check.mjs --dry-run                 (lists what would be asked, no key, no network)
//   node tools/road-distances-check.mjs --mode=both --reverse-count=20
//
// The key comes from ORS_API_KEY and is never printed. About 1.8 s between requests (limit 40/minute),
// and it stops before the daily quota is gone (same MIN_REMAINING rule as the builder).
import fs from "node:fs";
import path from "node:path";
import {
  buildDirectionsBody, parseDirections, metersToMiles, straightLineMiles, pointFor
} from "../src/lib/road-distance.js";
import { sampleEvenly, summarizeCountries, compareDirections, median, REVERSE_FLAG_PERCENT } from "../src/lib/road-distance-check.js";

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [name, value = "true"] = arg.replace(/^--/, "").split("=");
  return [name, value];
}));
const mode = args.mode ?? "both";
const reverseCount = Number(args["reverse-count"] ?? 20);
const delayMs = Number(args["delay-ms"] ?? 1800);
const dryRun = args["dry-run"] === "true";
const host = (args.host ?? "https://api.heigit.org/openrouteservice").replace(/\/+$/, "");
const outFile = path.resolve(args.out ?? "data/road-distances-checks.json");
const MIN_REMAINING = 30;
if (!["cities", "reverse", "both"].includes(mode)) throw new Error(`--mode must be cities, reverse or both (got ${mode})`);

const readJson = file => JSON.parse(fs.readFileSync(new URL(`../data/${file}`, import.meta.url), "utf8"));
const stored = readJson("road-distances.json");
const stateData = readJson("state-distances.json");
const cityData = readJson("cities.json");
const table = stored.pairs;
const adjusted = new Set((stored.adjustments?.pairs ?? []).map(row => row.pair)); // US-only replacements: not comparable

// Entries are compact ({ road, straight }); the key "A|B" is sorted and the stored direction is A to B.
const split = key => key.split("|");
const usable = key => Number.isFinite(table[key]?.road) && table[key].road > 0;
const cityKeys = Object.keys(table).filter(key => usable(key) && cityData.cities[split(key)[0]]);
const reverseKeys = sampleEvenly(
  Object.keys(table).filter(key => usable(key) && stateData.states[split(key)[0]] && !adjusted.has(key)),
  reverseCount
);
const cityPlan = mode === "reverse" ? [] : cityKeys;
const reversePlan = mode === "cities" ? [] : reverseKeys;
console.log(`cities=${cityPlan.length} reverse=${reversePlan.length} total_requests=${cityPlan.length + reversePlan.length}`);
if (dryRun) { console.log(`reverse sample: ${reversePlan.join(" ")}`); process.exit(0); }

const key = process.env.ORS_API_KEY;
if (!key) { console.error("ORS_API_KEY is not set."); process.exit(1); }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let stop = null; // quota_low | auth_error | rate_limited | no_extras
async function ask(body) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;
    try {
      response = await fetch(`${host}/v2/directions/driving-car/json`, {
        method: "POST",
        headers: { Authorization: key, "Content-Type": "application/json", Accept: "application/json", "User-Agent": "relocation-cost-distance-check/1.0 (+https://github.com/Fadhel-docom/relocation-cost)" },
        body: JSON.stringify(body)
      });
    } catch (error) {
      if (attempt < 2) { await sleep(2000 * (attempt + 1)); continue; }
      return { error: `network_${error.code ?? "error"}` };
    }
    const remaining = Number(response.headers.get("x-ratelimit-remaining"));
    if (response.status === 401 || response.status === 403) { stop = "auth_error"; return { error: `http_${response.status}` }; }
    if (response.status === 429) { await sleep(Math.min(Number(response.headers.get("retry-after")) || 60, 120) * 1000); continue; }
    if (!response.ok) return { error: `http_${response.status}` };
    if (Number.isFinite(remaining) && remaining < MIN_REMAINING) stop = "quota_low";
    return { json: await response.json(), remaining: Number.isFinite(remaining) ? remaining : null };
  }
  stop = "rate_limited";
  return { error: "http_429" };
}

const results = { cities: [], reverse: [] };
let lastRemaining = null;

for (const pairKey of cityPlan) {
  const entry = table[pairKey];
  const [a, b] = split(pairKey);
  const { from, to } = pointFor({ kind: "city", from: a, to: b, key: pairKey }, stateData, cityData);
  const answer = await ask({ ...buildDirectionsBody(from, to), extra_info: ["countryinfo"] });
  if (answer.remaining != null) lastRemaining = answer.remaining;
  if (answer.error) { results.cities.push({ pair: pairKey, error: answer.error }); if (stop) break; await sleep(delayMs); continue; }
  const countries = summarizeCountries(answer.json);
  const parsed = parseDirections(answer.json);
  if (!countries.available && results.cities.length === 0) { stop = "no_extras"; results.cities.push({ pair: pairKey, error: "no_countryinfo_in_response" }); break; }
  const miles = parsed.ok ? metersToMiles(parsed.meters) : null;
  results.cities.push({
    pair: pairKey, storedMiles: entry.road, askedMiles: miles,
    sameAsStored: miles == null ? null : Math.abs(miles - entry.road) <= 1,
    onlyUs: countries.onlyUs, other: countries.other
  });
  if (stop) break;
  await sleep(delayMs);
}

if (!stop) {
  for (const pairKey of reversePlan) {
    const entry = table[pairKey];
    const [a, b] = split(pairKey);
    const { from, to } = pointFor({ kind: "state", from: a, to: b, key: pairKey }, stateData, cityData);
    const answer = await ask(buildDirectionsBody(to, from)); // reversed on purpose
    if (answer.remaining != null) lastRemaining = answer.remaining;
    if (answer.error) { results.reverse.push({ pair: pairKey, error: answer.error }); if (stop) break; await sleep(delayMs); continue; }
    const parsed = parseDirections(answer.json);
    if (!parsed.ok) { results.reverse.push({ pair: pairKey, error: parsed.reason }); await sleep(delayMs); continue; }
    const miles = metersToMiles(parsed.meters);
    results.reverse.push({ pair: pairKey, storedMiles: entry.road, reverseMiles: miles, straightMiles: Math.round(straightLineMiles(from, to) * 10) / 10, ...compareDirections(entry.road, miles) });
    if (stop) break;
    await sleep(delayMs);
  }
}

const okCities = results.cities.filter(row => !row.error);
const okReverse = results.reverse.filter(row => !row.error);
const summary = {
  status: stop ?? "complete",
  lastRateLimitRemaining: lastRemaining,
  cities: {
    asked: okCities.length, errors: results.cities.length - okCities.length,
    notOnlyUs: okCities.filter(row => !row.onlyUs).map(row => row.pair),
    differFromStoredByMoreThan1Mile: okCities.filter(row => row.sameAsStored === false).map(row => row.pair)
  },
  reverse: {
    asked: okReverse.length, errors: results.reverse.length - okReverse.length, flagPercent: REVERSE_FLAG_PERCENT,
    flagged: okReverse.filter(row => row.flagged).map(row => `${row.pair} ${row.diffPercent}%`),
    medianAbsPercent: median(okReverse.map(row => Math.abs(row.diffPercent))),
    maxAbsPercent: okReverse.length ? Math.max(...okReverse.map(row => Math.abs(row.diffPercent))) : null
  }
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify({ generated_at: new Date().toISOString(), summary, results }, null, 2)}\n`);
console.log(JSON.stringify(summary));
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `status=${summary.status}\n`);
process.exit(stop === "auth_error" ? 1 : 0);
