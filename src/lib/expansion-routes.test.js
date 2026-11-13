import test from "node:test";
import assert from "node:assert/strict";
import { buildPairs, readCountries, foreignIds, ratioFlag } from "./expansion-routes.js";

test("buildPairs gives n(n-1)/2 unique ordered-by-list pairs", () => {
  const cities = ["a", "b", "c", "d"].map(id => ({ id }));
  const pairs = buildPairs(cities);
  assert.equal(pairs.length, 6);
  assert.deepEqual(pairs[0], { key: "a|b", i: 0, j: 1 });
  assert.equal(new Set(pairs.map(p => p.key)).size, 6);
});

test("readCountries picks the longest country and keeps every touch", () => {
  const json = { routes: [{ extras: { countryinfo: { summary: [{ value: 35, distance: 500.04, amount: 99 }, { value: 214, distance: 4.4, amount: 1 }] } } }] };
  const countries = readCountries(json);
  assert.equal(countries.available, true);
  assert.equal(countries.longestId, 35);
  assert.deepEqual(countries.ids, [35, 214]);
  assert.equal(readCountries({ routes: [{}] }).available, false);
});

test("foreignIds ignores home, unknown (0) and sub-kilometre touches", () => {
  const countries = { touches: [{ id: 35, km: 900 }, { id: 214, km: 0.6 }, { id: 0, km: 12 }, { id: 82, km: 40 }] };
  assert.deepEqual(foreignIds(countries, 35), [82]);
  assert.deepEqual(foreignIds({ touches: [{ id: 35, km: 10 }] }, 35), []);
});

test("ratioFlag flags shorter-than-straight and very high ratios only", () => {
  assert.equal(ratioFlag(120, 100), null);
  assert.equal(ratioFlag(90, 100), "shorter_than_straight_line");
  assert.equal(ratioFlag(230, 100), "ratio_above_2_2_review");
  assert.equal(ratioFlag(10, 0), "no_straight_line");
});
