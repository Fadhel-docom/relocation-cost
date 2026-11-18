#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const ENDPOINT = "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson";
const KEY = process.env.HEIGIT_API_KEY;
const MILES_PER_METER = 1 / 1609.344;
const REQUEST_GAP_MS = 1600; // 40 requests/minute account rate limit: leave a small margin.

function arg(name, fallback = false) {
  return process.argv.includes(name) ? true : fallback;
}
function readJson(relativePath) {
  return fs.readFile(path.join(ROOT, relativePath), "utf8").then(JSON.parse);
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function distanceKey(from, to, uppercase = false) {
  const pair = [from, to].sort();
  return uppercase ? pair.map((x) => x.toUpperCase()).join("|") : pair.join("|");
}
function routeJobs({ cities, cityRoutes, states, stateRoutes, roadDistances, onlyCities, onlyStates }) {
  const jobs = [];
  if (!onlyStates) {
    for (const route of cityRoutes.routes) {
      const from = cities.cities[route.from];
      const to = cities.cities[route.to];
      const key = distanceKey(route.from, route.to);
      const distance = roadDistances.pairs[key]?.road;
      if (!from || !to || !Number.isFinite(distance)) {
        throw new Error(`Missing city coordinates or stored road distance for ${route.slug} (${key}).`);
      }
      jobs.push({
        type: "city",
        slug: route.slug,
        from: route.from,
        to: route.to,
        coordinates: [[from.lon, from.lat], [to.lon, to.lat]],
        storedDistanceMiles: distance,
      });
    }
  }
  if (!onlyCities) {
    for (const route of stateRoutes.routes) {
      const from = states.states[route.from];
      const to = states.states[route.to];
      const key = distanceKey(route.from, route.to, true);
      const distance = roadDistances.pairs[key]?.road;
      if (!from || !to || !Number.isFinite(distance)) {
        throw new Error(`Missing state centroids or stored road distance for ${route.slug} (${key}).`);
      }
      jobs.push({
        type: "state",
        slug: route.slug,
        from: route.from,
        to: route.to,
        coordinates: [[from.lon, from.lat], [to.lon, to.lat]],
        storedDistanceMiles: distance,
      });
    }
  }
  return jobs;
}
async function requestRoute(job) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: KEY,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/geo+json, application/json",
      },
      body: JSON.stringify({
        coordinates: job.coordinates,
        instructions: false,
        geometry: true,
        geometry_simplify: false,
        options: {
          avoid_borders: "controlled",
          avoid_countries: ["CA"],
        },
      }),
    });
    const bodyText = await response.text();
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = null;
    }
    if (response.ok && body) return body;
    const detail = body?.error?.message || body?.message || bodyText.slice(0, 500) || response.statusText;
    lastError = new Error(`HeiGIT HTTP ${response.status}: ${detail}`);
    if (response.status !== 429 && response.status < 500) throw lastError;
    if (attempt < 4) {
      const retryAfter = Number(response.headers.get("retry-after"));
      await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2500 * attempt);
    }
  }
  throw lastError || new Error("HeiGIT request failed after retries.");
}
async function main() {
  if (!KEY) {
    throw new Error("HEIGIT_API_KEY is not set. Add it as a GitHub Actions secret; never paste the key into chat or commit it.");
  }
  const [cities, cityRoutes, states, stateRoutes, roadDistances] = await Promise.all([
    readJson("data/cities.json"),
    readJson("data/city-routes.json"),
    readJson("data/state-distances.json"),
    readJson("data/route-pages.json"),
    readJson("data/road-distances.json"),
  ]);
  const onlyCities = arg("--city-only");
  const onlyStates = arg("--state-only");
  if (onlyCities && onlyStates) throw new Error("Choose at most one of --city-only or --state-only.");
  const force = arg("--force");
  const jobs = routeJobs({ cities, cityRoutes, states, stateRoutes, roadDistances, onlyCities, onlyStates });
  const manifest = {
    schema_version: "1.0",
    provider: "openrouteservice by HeiGIT",
    endpoint: ENDPOINT,
    profile: "driving-car",
    data_license: "CC-BY-SA 4.0",
    attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap",
    generated_at: new Date().toISOString(),
    avoid_countries: ["CA"],
    rate_limit_gap_ms: REQUEST_GAP_MS,
    requested: jobs.length,
    fetched: 0,
    skipped_existing: 0,
    distance_mismatches_over_1pct: [],
    failures: [],
  };
  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const relative = `data/route-geometries/${job.type}/${job.slug}.geojson`;
    const absolute = path.join(ROOT, relative);
    if (!force) {
      try {
        await fs.access(absolute);
        manifest.skipped_existing += 1;
        continue;
      } catch {
        // File does not exist; fetch it.
      }
    }
    try {
      const response = await requestRoute(job);
      const feature = response.features?.[0];
      const summary = feature?.properties?.summary;
      if (!feature?.geometry || !["LineString", "MultiLineString"].includes(feature.geometry.type)) {
        throw new Error("HeiGIT response did not contain a usable GeoJSON route geometry.");
      }
      if (!Number.isFinite(summary?.distance) || !Number.isFinite(summary?.duration)) {
        throw new Error("HeiGIT response did not contain summary distance and duration.");
      }
      const providerMiles = summary.distance * MILES_PER_METER;
      const differencePct = Math.abs(providerMiles - job.storedDistanceMiles) / job.storedDistanceMiles * 100;
      const output = {
        type: "Feature",
        properties: {
          route_type: job.type,
          route_id: job.slug,
          from: job.from,
          to: job.to,
          expected_distance_miles: providerMiles,
          provider_distance_miles: providerMiles,
          stored_route_distance_miles: job.storedDistanceMiles,
          stored_distance_difference_pct: Number(differencePct.toFixed(3)),
          stored_distance_match: differencePct <= 1,
          provider_duration_seconds: summary.duration,
          provider: "openrouteservice by HeiGIT",
          provider_endpoint: ENDPOINT,
          generated_at: new Date().toISOString(),
          data_license: "CC-BY-SA 4.0",
          attribution: "© openrouteservice by HeiGIT | Data from OpenStreetMap",
          provider_metadata: response.metadata || null,
        },
        geometry: feature.geometry,
      };
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      await fs.writeFile(absolute, JSON.stringify(output) + "\n", "utf8");
      manifest.fetched += 1;
      if (differencePct > 1) manifest.distance_mismatches_over_1pct.push({
        route_id: job.slug,
        stored_miles: job.storedDistanceMiles,
        provider_miles: Number(providerMiles.toFixed(3)),
        difference_pct: Number(differencePct.toFixed(3)),
      });
      process.stdout.write(`[${index + 1}/${jobs.length}] ${job.type}/${job.slug}: ${providerMiles.toFixed(1)} mi; stored distance delta ${differencePct.toFixed(2)}%\n`);
    } catch (error) {
      manifest.failures.push({ route_id: job.slug, route_type: job.type, error: String(error.message || error) });
      process.stderr.write(`[${index + 1}/${jobs.length}] FAILED ${job.type}/${job.slug}: ${error.message || error}\n`);
    }
    if (index < jobs.length - 1) await wait(REQUEST_GAP_MS);
  }
  const manifestPath = path.join(ROOT, "data/route-geometries/manifest.json");
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  process.stdout.write(JSON.stringify(manifest, null, 2) + "\n");
  if (manifest.failures.length) process.exitCode = 1;
}
main().catch((error) => {
  process.stderr.write(`${error.message || error}\n`);
  process.exitCode = 1;
});
