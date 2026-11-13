import test from "node:test";
import assert from "node:assert/strict";
import { sampleEvenly, summarizeCountries, compareDirections, median, US_COUNTRY_ID } from "./road-distance-check.js";

test("sampleEvenly is deterministic, sorted and spread over the whole list", () => {
  const keys = Array.from({ length: 100 }, (_, i) => `K${String(99 - i).padStart(3, "0")}`);
  const picked = sampleEvenly(keys, 20);
  assert.equal(picked.length, 20);
  assert.deepEqual(picked, sampleEvenly([...keys].reverse(), 20));
  assert.equal(picked[0], "K000");
  assert.equal(picked[19], "K095");
  assert.deepEqual(sampleEvenly(["B", "A"], 5), ["A", "B"]);
  assert.deepEqual(sampleEvenly([], 3), []);
});

test("summarizeCountries separates US-only, other countries and a missing extra", () => {
  const only = { routes: [{ extras: { countryinfo: { summary: [{ value: US_COUNTRY_ID, distance: 5000, amount: 100 }] } } }] };
  assert.deepEqual(summarizeCountries(only), { available: true, onlyUs: true, other: [] });
  const crossing = { routes: [{ extras: { countryinfo: { summary: [
    { value: US_COUNTRY_ID, distance: 4000, amount: 80 }, { value: 38, distance: 1000.4, amount: 20 }] } } }] };
  assert.deepEqual(summarizeCountries(crossing), { available: true, onlyUs: false, other: [{ id: 38, meters: 1000 }] });
  assert.equal(summarizeCountries({ routes: [{}] }).available, false);
  assert.equal(summarizeCountries(null).available, false);
});

test("compareDirections flags only gaps above 3 percent and keeps the sign", () => {
  assert.deepEqual(compareDirections(1000, 1010), { diffMiles: 10, diffPercent: 1, flagged: false });
  assert.deepEqual(compareDirections(1000, 950), { diffMiles: -50, diffPercent: -5, flagged: true });
  assert.equal(compareDirections(1000, 1030).flagged, false);
});

test("median handles odd, even and empty lists", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
});
