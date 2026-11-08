import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import table from "../../data/road-distances.json" with { type: "json" };
import { distanceFor } from "./distances.js";
import { buildStatePairs, buildCityPairs, straightLineMiles, DATASET_METADATA } from "./road-distance.js";

const stateData = JSON.parse(fs.readFileSync(new URL("../../data/state-distances.json", import.meta.url)));
const cityData = JSON.parse(fs.readFileSync(new URL("../../data/cities.json", import.meta.url)));
const cityRoutes = JSON.parse(fs.readFileSync(new URL("../../data/city-routes.json", import.meta.url)));

test("table carries the licence, attribution and terms required by the provider", () => {
  assert.match(table.data_licence, /CC-BY-SA 4\.0/);
  assert.match(table.data_licence, /OpenStreetMap/);
  assert.equal(table.attribution, "© openrouteservice by HeiGIT | Data from OpenStreetMap");
  assert.equal(table.terms, "https://account.heigit.org/info/tos");
  assert.equal(table.attribution, DATASET_METADATA.attribution);
});

test("every connected state pair except those listed as failed has a road entry", () => {
  const pairs = buildStatePairs(stateData.states);
  const missing = pairs.filter(p => !table.pairs[p.key]).map(p => p.key);
  // The only pairs without a road entry involve Alaska (no route found from its centre point).
  assert.ok(missing.length > 0 && missing.every(key => key.split("|").includes("AK")), missing.join(","));
  assert.equal(pairs.length - missing.length, 1128);
});

test("every city pair has a road entry", () => {
  for (const p of buildCityPairs(cityRoutes.routes ?? cityRoutes)) {
    assert.ok(table.pairs[p.key], `missing ${p.key}`);
  }
});

test("table values are finite, positive and never shorter than the straight line", () => {
  for (const [key, entry] of Object.entries(table.pairs)) {
    assert.ok(Number.isFinite(entry.road) && entry.road > 0, key);
    assert.ok(entry.road >= entry.straight, `${key} road shorter than straight line`);
  }
});

test("stored straight-line values match the calculator's own straight-line formula", () => {
  for (const [key, entry] of Object.entries(table.pairs)) {
    const [a, b] = key.split("|");
    const source = stateData.states[a] ? stateData.states : cityData.cities;
    const own = straightLineMiles(source[a], source[b]);
    assert.ok(Math.abs(own - entry.straight) < 1, `${key}: ${own} vs ${entry.straight}`);
  }
});

test("lookup is the same in both directions and reports road basis", () => {
  const ab = distanceFor(table, "state", "TX", "CA", stateData.states.TX, stateData.states.CA);
  const ba = distanceFor(table, "state", "CA", "TX", stateData.states.CA, stateData.states.TX);
  assert.deepEqual(ab, ba);
  assert.equal(ab.basis, "road");
  assert.equal(ab.miles, Math.round(table.pairs["CA|TX"].road));
});

test("Alaska and Hawaii fall back to the straight line and say so", () => {
  for (const [a, b] of [["AK", "WA"], ["HI", "CA"]]) {
    const result = distanceFor(table, "state", a, b, stateData.states[a], stateData.states[b]);
    assert.equal(result.basis, "straight");
    assert.equal(result.miles, Math.round(straightLineMiles(stateData.states[a], stateData.states[b])));
  }
});

test("same place or missing fallback points give null, bad kind throws", () => {
  assert.equal(distanceFor(table, "state", "TX", "TX"), null);
  assert.equal(distanceFor(table, "state", "AK", "WA"), null);
  assert.throws(() => distanceFor(table, "zip", "a", "b"));
});

test("pages that show a road distance name the data source, and no page still calls it a state-center straight line", () => {
  const read = p => fs.readFileSync(new URL(p, import.meta.url), "utf8");
  for (const page of ["../pages/calculator.astro", "../pages/methodology.astro", "../pages/moving-cost/[route].astro", "../pages/moving-cost/cities/[route].astro", "../scripts/calculator.js"]) {
    assert.ok(read(page).includes(table.attribution), `${page} lacks the attribution`);
  }
  for (const page of ["../pages/calculator.astro", "../pages/moving-cost/[route].astro", "../pages/moving-cost/cities/[route].astro", "../lib/route-answer.js", "../lib/home-answer.js"]) {
    assert.ok(!/great-circle|state-centroid|between state centers\./i.test(read(page)), `${page} still uses the old straight-line wording`);
  }
});
