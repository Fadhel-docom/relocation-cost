import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  METERS_PER_MILE, metersToMiles, pairKey, buildStatePairs, buildCityPairs, pointFor,
  buildDirectionsBody, parseDirections, checkRatio, makeEntry, makeFailure, pendingPairs,
  straightLineMiles, summarize, NO_ROAD_STATES
} from "./road-distance.js";

const stateData = JSON.parse(fs.readFileSync(new URL("../../data/state-distances.json", import.meta.url)));
const cityData = JSON.parse(fs.readFileSync(new URL("../../data/cities.json", import.meta.url)));
const cityRoutes = JSON.parse(fs.readFileSync(new URL("../../data/city-routes.json", import.meta.url)));

test("meters convert to miles with one decimal", () => {
  assert.equal(metersToMiles(METERS_PER_MILE), 1);
  assert.equal(metersToMiles(1609344), 1000);
  assert.throws(() => metersToMiles(-1));
  assert.throws(() => metersToMiles(Number.NaN));
});

test("a pair has one key in both directions", () => {
  assert.equal(pairKey("TX", "CA"), pairKey("CA", "TX"));
});

test("state pairs: every unordered pair of connected states exactly once", () => {
  const pairs = buildStatePairs(stateData.states);
  const connected = Object.keys(stateData.states).filter(code => !NO_ROAD_STATES.has(code)).length;
  assert.equal(pairs.length, connected * (connected - 1) / 2);
  assert.equal(new Set(pairs.map(pair => pair.key)).size, pairs.length);
  assert.ok(pairs.every(pair => pair.from < pair.to));
  assert.ok(!pairs.some(pair => pair.from === "HI" || pair.to === "HI"));
});

test("city pairs match the city route list and know their points", () => {
  const pairs = buildCityPairs(cityRoutes.routes);
  assert.equal(pairs.length, cityRoutes.routes.length);
  for (const pair of pairs) {
    const { from, to } = pointFor(pair, stateData, cityData);
    assert.ok(Number.isFinite(from.lat) && Number.isFinite(to.lon));
  }
});

test("every state point exists for every state pair", () => {
  for (const pair of buildStatePairs(stateData.states)) pointFor(pair, stateData, cityData);
});

test("request body uses lon,lat order and asks for the lightest answer", () => {
  const body = buildDirectionsBody({ lat: 10, lon: 20 }, { lat: 30, lon: 40 });
  assert.deepEqual(body.coordinates, [[20, 10], [40, 30]]);
  assert.deepEqual(body.radiuses, [-1, -1]);
  assert.equal(body.geometry, false);
  assert.equal(body.units, "m");
});

test("response parsing reads the route distance or says it is missing", () => {
  assert.deepEqual(parseDirections({ routes: [{ summary: { distance: 1234 } }] }), { ok: true, meters: 1234 });
  assert.equal(parseDirections({}).ok, false);
  assert.equal(parseDirections({ routes: [{ summary: {} }] }).reason, "no_route_in_response");
});

test("straight-line formula matches the calculator for a known pair", () => {
  const miles = straightLineMiles(stateData.states.CA, stateData.states.TX);
  // The calculator rounds the same formula to whole miles: California to Texas centers = 1,317.
  assert.equal(Math.round(miles), 1317);
});

test("a road shorter than the straight line is rejected, a very long one is flagged", () => {
  assert.equal(checkRatio(900, 1000).ok, false);
  assert.equal(checkRatio(900, 1000).flag, "shorter_than_straight_line");
  assert.deepEqual({ ok: checkRatio(1300, 1000).ok, flag: checkRatio(1300, 1000).flag }, { ok: true, flag: null });
  assert.equal(checkRatio(2300, 1000).flag, "ratio_above_2_2_review");
  assert.equal(checkRatio(10, 0).ok, false);
});

test("entries keep both distances and the status; failures carry a reason", () => {
  const pair = { kind: "state", key: "CA|TX", from: "CA", to: "TX" };
  const entry = makeEntry(pair, 1500, 1200, "2026-11-03T00:00:00Z");
  assert.equal(entry.status, "ok");
  assert.equal(entry.ratio, 1.25);
  const bad = makeEntry(pair, 1000, 1200, "t");
  assert.equal(bad.status, "rejected");
  assert.equal(makeFailure(pair, "http_429", "t").status, "failed");
});

test("pending pairs skip finished ones and only retry failures on request", () => {
  const pairs = [
    { key: "A|B", from: "A", to: "B", kind: "state" },
    { key: "A|C", from: "A", to: "C", kind: "state" },
    { key: "B|C", from: "B", to: "C", kind: "state" }
  ];
  const table = {
    "A|B": { status: "ok" },
    "A|C": { status: "failed", reason: "network_error" }
  };
  assert.deepEqual(pendingPairs(pairs, table).map(pair => pair.key), ["B|C"]);
  assert.deepEqual(pendingPairs(pairs, table, { retryFailed: true }).map(pair => pair.key), ["A|C", "B|C"]);
});

test("summary counts statuses and flagged entries", () => {
  const counts = summarize({
    a: { status: "ok", flag: null },
    b: { status: "ok", flag: "ratio_above_2_2_review" },
    c: { status: "failed" },
    d: { status: "rejected" }
  });
  assert.deepEqual(counts, { ok: 2, rejected: 1, failed: 1, flagged: 1 });
});


test("retry mode excludes permanent point-not-found and route-limit failures", () => {
  const reasons = ["network_error", "http_429", "http_503", "http_404_2010", "http_400_2004"];
  const pairs = reasons.map((reason, i) => ({ key: String(i) }));
  const table = Object.fromEntries(reasons.map((reason, i) => [String(i), { status: "failed", reason }]));
  assert.deepEqual(pendingPairs(pairs, table, { retryFailed: true }).map(pair => pair.key), ["0", "1", "2"]);
});
