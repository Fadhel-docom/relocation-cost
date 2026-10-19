import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CITIES, SLUGS, SOURCE, compareCities, describeComparison, equivalentSpending } from "./cost-of-living.js";

const data = JSON.parse(fs.readFileSync(new URL("../../data/cost-of-living.json", import.meta.url), "utf8"));
const cities = JSON.parse(fs.readFileSync(new URL("../../data/cities.json", import.meta.url), "utf8"));

test("every calculator city has a price index, and only those", () => {
  assert.deepEqual([...SLUGS].sort(), Object.keys(cities.cities).sort());
});

test("each printed deflator agrees with its all-items index (reading check)", () => {
  // The deflator equals the all-items RPP times one national constant, so the ratio must be the same in every row.
  for (const [slug, city] of Object.entries(data.cities)) {
    const ratio = city.deflator / city.rpp;
    assert.ok(ratio > 1.2035 && ratio < 1.2065, `${slug}: ${ratio}`);
    assert.ok(city.rpp > 80 && city.rpp < 130, slug);
  }
});

test("source is the official release, with year and base stated", () => {
  assert.match(SOURCE.url, /^https:\/\/www\.bea\.gov\//);
  assert.equal(SOURCE.year, 2023);
  assert.match(SOURCE.base, /100/);
});

test("cities are sorted from lowest to highest price level", () => {
  for (let i = 1; i < CITIES.length; i++) assert.ok(CITIES[i].rpp >= CITIES[i - 1].rpp);
});

test("compareCities gives the percent difference and its direction", () => {
  const up = compareCities("austin", "new-york");
  assert.equal(up.percent, Math.round((112.5 / 97.6 - 1) * 100));
  assert.equal(up.direction, "higher");
  const down = compareCities("new-york", "austin");
  assert.equal(down.direction, "lower");
  assert.ok(Math.abs(up.ratio * down.ratio - 1) < 1e-12);
  const same = compareCities("denver", "phoenix");
  assert.equal(same.percent, 0);
  assert.equal(same.direction, "same");
  assert.throws(() => compareCities("austin", "paris"), RangeError);
});

test("equivalentSpending scales an amount and rejects bad input", () => {
  assert.equal(equivalentSpending(5000, 1.1), 5500);
  assert.equal(equivalentSpending(0, 1.5), 0);
  assert.throws(() => equivalentSpending(-1, 1), RangeError);
  assert.throws(() => equivalentSpending(NaN, 1), RangeError);
  assert.throws(() => equivalentSpending(100, 0), RangeError);
});

test("the sentence names both cities, the percent and the index values", () => {
  const text = describeComparison(compareCities("austin", "new-york"));
  assert.match(text, /New York are about 15% higher than in Austin/);
  assert.match(text, /112\.5 vs 97\.6/);
  assert.match(describeComparison(compareCities("denver", "phoenix")), /about the same/);
  assert.match(describeComparison(compareCities("denver", "denver")), /same city/);
});
