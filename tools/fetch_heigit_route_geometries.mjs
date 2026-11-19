import fs from "node:fs";
import path from "node:path";
import {
  buildStatePairs, buildCityPairs, pointFor, buildDirectionsBody, metersToMiles
} from "../src/lib/road-distance.js";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [name, value = "true"] = arg.replace(/^--/, "").split("=");
  return [name, value];
}));
const routeSet = args["city-only"] === "true" ? "cities"
  : args["state-only"] === "true" ? "states"
    : (args["route-set"] ?? "all");
const force = args.force === "true";
const dryRun = args["dry-run"] === "true";
const delayMs = Number(args["delay-ms"] ?? 1800);
const host = (args.host ?? "https://api.heigit.org/openrouteservice").replace(/\/+$/, "");
const outputDir = path.resolve("data/route-geometries");
const manifestPath = path.join(outputDir, "manifest.json");
const MIN_REMAINING = 30;

if (!["cities", "states", "all"].includes(routeSet)) throw new Error("route set must be cities, states or all");
if (!Number.isFinite(delayMs) || delayMs < 0) throw new Error("delay must be non-negative");

const readJson = (name) => JSON.parse(fs.readFileSync(new URL("../data/" + name, import.meta.url), "utf8"));
const stateData = readJson("state-distances.json");
const cityData = readJson("cities.json");
const cityRoutes = readJson("city-routes.json");
const distanceData = readJson("road-distances.json");
const storedPairs = distanceData.pairs ?? {};
const pairs = [
  ...(routeSet === "states" ? [] : buildCityPairs(cityRoutes.routes)),
  ...(routeSet === "cities" ? [] : buildStatePairs(stateData.states))
].filter((pair) => {
  const row = storedPairs[pair.key];
  return row && Number.isFinite(row.road ?? row.roadMiles) && (row.road ?? row.roadMiles) > 0;
});

const pairFile = (pair) => pair.kind + "-" + pair.from + "--" + pair.to + ".geojson";
const radians = (v) => v * Math.PI / 180;
const distanceMiles = (a, b) => {
  const dLat = radians(b[1] - a[1]);
  const dLon = radians(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(a[1])) * Math.cos(radians(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * 3958.7613 * Math.asin(Math.min(1, Math.sqrt(h)));
};
const lineMiles = (coords) => {
  let total = 0;
  for (let i = 1; i < coords.length; i += 1) total += distanceMiles(coords[i - 1], coords[i]);
  return total;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const key = process.env.HEIGIT_API_KEY;
if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, routeSet, plannedPairs: pairs.length, storedDistancePairs: Object.keys(storedPairs).length }));
  process.exit(0);
}
if (!key) throw new Error("HEIGIT_API_KEY is not set; configure it as a repository Actions secret.");

fs.mkdirSync(outputDir, { recursive: true });
const manifest = {
  schema_version: "1.0",
  generated_at: new Date().toISOString(),
  source: "HeiGIT openrouteservice Directions V2, driving-car",
  attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap",
  data_license: "CC-BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  osm_license: "ODbL 1.0",
  terms: "https://account.heigit.org/info/tos",
  route_set: routeSet,
  requested: pairs.length,
  completed: [],
  skipped: [],
  failed: []
};
const writeManifest = () => fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

async function fetchRoute(body) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;
    try {
      response = await fetch(host + "/v2/directions/driving-car/geojson", {
        method: "POST",
        headers: {
          Authorization: key,
          "Content-Type": "application/json",
          Accept: "application/geo+json, application/json",
          "User-Agent": "relocation-cost-b24-route-geometry/1.0 (+https://github.com/Fadhel-docom/relocation-cost)"
        },
        body: JSON.stringify(body)
      });
    } catch (error) {
      if (attempt < 2) { await sleep(2000 * (attempt + 1)); continue; }
      return { error: "network_" + (error.code ?? "error") };
    }
    const remaining = Number(response.headers.get("x-ratelimit-remaining"));
    if (response.status === 401 || response.status === 403) return { error: "http_" + response.status, stop: "auth_error" };
    if (response.status === 429) {
      if (attempt < 2) {
        await sleep(Math.min(Number(response.headers.get("retry-after")) || 60, 120) * 1000);
        continue;
      }
      return { error: "http_429", stop: "rate_limited" };
    }
    if (!response.ok) {
      let detail = "";
      try { detail = (await response.text()).slice(0, 500); } catch {}
      return { error: "http_" + response.status + ": " + detail, remaining };
    }
    return { json: await response.json(), remaining: Number.isFinite(remaining) ? remaining : null };
  }
  return { error: "retries_exhausted", stop: "rate_limited" };
}

let stop = null;
for (const pair of pairs) {
  const filename = pairFile(pair);
  const destination = path.join(outputDir, filename);
  if (!force && fs.existsSync(destination)) {
    manifest.skipped.push({ pair: pair.key, file: filename, reason: "already_exists" });
    writeManifest();
    continue;
  }
  const points = pointFor(pair, stateData, cityData);
  const stored = storedPairs[pair.key];
  const expectedMiles = Number(stored.road ?? stored.roadMiles);
  const body = {
    ...buildDirectionsBody(points.from, points.to),
    geometry: true,
    options: { avoid_countries: [124] }
  };
  const answer = await fetchRoute(body);
  if (answer.error) {
    manifest.failed.push({ pair: pair.key, error: answer.error });
    writeManifest();
    if (answer.stop) { stop = answer.stop; break; }
    await sleep(delayMs);
    continue;
  }
  const feature = answer.json?.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  const summaryMeters = feature?.properties?.summary?.distance;
  if (!Array.isArray(coordinates) || coordinates.length < 2 || !Number.isFinite(summaryMeters)) {
    manifest.failed.push({ pair: pair.key, error: "missing_geojson_geometry_or_summary_distance" });
    writeManifest();
    await sleep(delayMs);
    continue;
  }
  const summaryMiles = metersToMiles(summaryMeters);
  const geometryMiles = lineMiles(coordinates);
  const differencePct = expectedMiles > 0 ? Math.abs(summaryMiles - expectedMiles) / expectedMiles * 100 : Infinity;
  const geometryDifferencePct = summaryMiles > 0 ? Math.abs(geometryMiles - summaryMiles) / summaryMiles * 100 : Infinity;
  if (differencePct > 1 || geometryDifferencePct > 1) {
    manifest.failed.push({
      pair: pair.key, error: "distance_mismatch_over_1_percent",
      storedMiles: expectedMiles, summaryMiles, geometryMiles,
      storedDifferencePct: Number(differencePct.toFixed(3)),
      geometryDifferencePct: Number(geometryDifferencePct.toFixed(3))
    });
    writeManifest();
    await sleep(delayMs);
    continue;
  }

  const outputFeature = {
    type: "Feature",
    properties: {
      kind: pair.kind, from: pair.from, to: pair.to,
      expected_distance_miles: expectedMiles,
      route_summary_distance_miles: summaryMiles,
      geometry_distance_miles: Number(geometryMiles.toFixed(3)),
      stored_distance_match: true,
      stored_distance_difference_pct: Number(differencePct.toFixed(3)),
      geometry_summary_difference_pct: Number(geometryDifferencePct.toFixed(3)),
      generated_at: new Date().toISOString(),
      source: "HeiGIT openrouteservice Directions V2, driving-car",
      attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap",
      data_license: "CC-BY-SA 4.0",
      osm_license: "ODbL 1.0",
      terms: "https://account.heigit.org/info/tos"
    },
    geometry: feature.geometry
  };
  fs.writeFileSync(destination, JSON.stringify(outputFeature, null, 2) + "\n");
  manifest.completed.push({
    pair: pair.key, file: filename, routeMiles: summaryMiles,
    geometryMiles: Number(geometryMiles.toFixed(3)),
    storedDifferencePct: Number(differencePct.toFixed(3))
  });
  writeManifest();
  if (answer.remaining != null && answer.remaining < MIN_REMAINING) { stop = "quota_low"; break; }
  await sleep(delayMs);
}

manifest.status = stop ?? (manifest.failed.length ? "partial" : "complete");
manifest.finished_at = new Date().toISOString();
writeManifest();
const summary = {
  status: manifest.status, requested: manifest.requested,
  completed: manifest.completed.length, skipped: manifest.skipped.length,
  failed: manifest.failed.length
};
console.log(JSON.stringify(summary));
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "status=" + manifest.status + "\n");
if (stop === "auth_error" || stop === "rate_limited" || stop === "quota_low" || manifest.failed.length) process.exit(1);
