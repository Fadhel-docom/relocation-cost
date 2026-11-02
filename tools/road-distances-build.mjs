// Builds data/road-distances.json: road miles between the calculator's state points and city points,
// asked once from openrouteservice (HeiGIT) and stored, so the live site never calls any API.
// Run by the "Road distances" workflow (manual). The key comes from the ORS_API_KEY environment
// variable and is never printed or written anywhere.
//
//   node tools/road-distances-build.mjs --kind=all --limit=3     (smoke test: 3 requests)
//   node tools/road-distances-build.mjs --dry-run                (counts only, no key, no network)
//
// Resumable: pairs already stored are skipped, so a stopped run (quota, rate limit) continues later.
import fs from "node:fs";
import path from "node:path";
import {
  DATASET_METADATA, buildStatePairs, buildCityPairs, pointFor, buildDirectionsBody, parseDirections,
  metersToMiles, straightLineMiles, makeEntry, makeFailure, pendingPairs, summarize
} from "../src/lib/road-distance.js";

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [name, value = "true"] = arg.replace(/^--/, "").split("=");
  return [name, value];
}));
const kind = args.kind ?? "all";
const limit = args.limit ? Number(args.limit) : Infinity;
const retryFailed = args["retry-failed"] === "true";
const dryRun = args["dry-run"] === "true";
const host = (args.host ?? "https://api.heigit.org/openrouteservice").replace(/\/+$/, ""); // a trailing slash causes 405
const delayMs = Number(args["delay-ms"] ?? 1700); // stays under the 40 requests/minute limit
const outFile = path.resolve(args.out ?? "data/road-distances.json");
const MIN_REMAINING = 30; // stop before the daily quota is gone

if (!["state", "city", "all"].includes(kind)) throw new Error(`--kind must be state, city or all (got ${kind})`);
if (!(limit > 0)) throw new Error("--limit must be a positive number");

const readJson = file => JSON.parse(fs.readFileSync(new URL(`../data/${file}`, import.meta.url), "utf8"));
const stateData = readJson("state-distances.json");
const cityData = readJson("cities.json");
const cityRoutes = readJson("city-routes.json");

let table = {};
if (fs.existsSync(outFile)) table = JSON.parse(fs.readFileSync(outFile, "utf8")).pairs ?? {};

const wanted = [
  ...(kind === "city" ? [] : buildStatePairs(stateData.states)),
  ...(kind === "state" ? [] : buildCityPairs(cityRoutes.routes))
];
const todo = pendingPairs(wanted, table, { retryFailed }).slice(0, limit);

function save() {
  const pairs = Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b)));
  const body = { ...DATASET_METADATA, generated_at: new Date().toISOString(), pairs };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(`${outFile}.tmp`, `${JSON.stringify(body, null, 2)}\n`);
  fs.renameSync(`${outFile}.tmp`, outFile);
}

function output(status) {
  const counts = summarize(table);
  console.log(`status=${status} ${JSON.stringify(counts)} stored=${Object.keys(table).length} wanted=${wanted.length}`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `status=${status}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `### Road distances\n\n- status: **${status}**\n- stored: ${Object.keys(table).length} of ${wanted.length} wanted\n- ok ${counts.ok}, rejected ${counts.rejected}, failed ${counts.failed}, flagged ${counts.flagged}\n`);
  }
}

console.log(`wanted=${wanted.length} pending=${todo.length} (kind=${kind}, limit=${limit === Infinity ? "none" : limit}, retryFailed=${retryFailed})`);
if (dryRun) { output("dry-run"); process.exit(0); }

const key = process.env.ORS_API_KEY;
if (!key) { console.error("ORS_API_KEY is not set (add it as a repository secret)."); output("no_key"); process.exit(1); }

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let status = "complete";
let sinceSave = 0;

for (const pair of todo) {
  const { from, to } = pointFor(pair, stateData, cityData);
  const straight = straightLineMiles(from, to);
  let done = false;

  for (let attempt = 0; attempt < 3 && !done; attempt += 1) {
    let response;
    try {
      response = await fetch(`${host}/v2/directions/driving-car/json`, {
        method: "POST",
        headers: { Authorization: key, "Content-Type": "application/json", Accept: "application/json", "User-Agent": "relocation-cost-distance-builder/1.0 (+https://github.com/Fadhel-docom/relocation-cost)" },
        body: JSON.stringify(buildDirectionsBody(from, to))
      });
    } catch (error) {
      if (attempt < 2) {
        const wait = 2000 * (attempt + 1);
        console.log(`Network error; retrying in ${wait}ms (attempt ${attempt + 1}/3)`);
        await sleep(wait);
        continue;
      }
      table[pair.key] = makeFailure(pair, `network_${error.code ?? "error"}`, new Date().toISOString());
      done = true;
      break;
    }

    const remaining = Number(response.headers.get("x-ratelimit-remaining"));
    if (response.status === 401 || response.status === 403) { status = "auth_error"; break; }
    if (response.status === 429) {
      const wait = Math.min(Number(response.headers.get("retry-after")) || 60, 120);
      console.log(`429 rate limit, waiting ${wait}s (attempt ${attempt + 1}/3)`);
      await sleep(wait * 1000);
      continue;
    }

    const now = new Date().toISOString();
    if (response.ok) {
      const parsed = parseDirections(await response.json());
      table[pair.key] = parsed.ok
        ? makeEntry(pair, metersToMiles(parsed.meters), straight, now)
        : makeFailure(pair, parsed.reason, now);
    } else {
      let code = "";
      try { code = (await response.json())?.error?.code ?? ""; } catch { /* body is not JSON */ }
      table[pair.key] = makeFailure(pair, `http_${response.status}${code ? `_${code}` : ""}`, now);
    }
    done = true;

    if (Number.isFinite(remaining) && remaining < MIN_REMAINING) { status = "quota_low"; break; }
  }

  if (status === "auth_error" || status === "quota_low") break;
  if (!done) { status = "rate_limited"; break; } // three 429s in a row: stop, resume later
  sinceSave += 1;
  if (sinceSave >= 20) { save(); sinceSave = 0; }
  await sleep(delayMs);
}

if (Object.keys(table).length) save();
output(status);
process.exit(status === "auth_error" ? 1 : 0);
