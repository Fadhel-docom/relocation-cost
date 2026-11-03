import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CITIES, SLUGS, SOURCE, compareCities, describeComparison, describeHousingComparison, equivalentSpending } from "./cost-of-living.js";

const data = JSON.parse(fs.readFileSync(new URL("../../data/cost-of-living.json", import.meta.url), "utf8"));
const cities = JSON.parse(fs.readFileSync(new URL("../../data/cities.json", import.meta.url), "utf8"));

test("every calculator city has both 2024 price components, and only those", () => {
  assert.deepEqual([...SLUGS].sort(), Object.keys(cities.cities).sort());
  assert.equal(SLUGS.length, 18);
  for (const [slug, city] of Object.entries(data.cities)) {
    assert.ok(city.rpp > 80 && city.rpp < 130, slug + " all-items");
    assert.ok(city.housingRpp > 80 && city.housingRpp < 220, slug + " rents");
    assert.ok(city.metro.length > 0, slug + " metro label");
  }
});

test("source is the BEA metro release, with year and national base stated", () => {
  assert.match(SOURCE.url, /^https:\/\/www\.bea\.gov\//);
  assert.match(SOURCE.tableUrl, /^https:\/\/fred\.stlouisfed\.org\/release\/tables/);
  assert.equal(SOURCE.year, 2024);
  assert.match(SOURCE.base, /100/);
});

test("cities are sorted from lowest to highest all-items price level", () => {
  for (let i = 1; i < CITIES.length; i++) assert.ok(CITIES[i].rpp >= CITIES[i - 1].rpp);
});

test("compareCities returns both all-items and rent-component comparisons", () => {
  const up = compareCities("austin", "new-york");
  assert.equal(up.percent, Math.round((112.563 / 98.066 - 1) * 100));
  assert.equal(up.direction, "higher");
  assert.equal(up.housingPercent, Math.round((148.616 / 120.361 - 1) * 100));
  assert.equal(up.housingDirection, "higher");
  const down = compareCities("new-york", "austin");
  assert.equal(down.direction, "lower");
  assert.ok(Math.abs(up.ratio * down.ratio - 1) < 1e-12);
  assert.ok(Math.abs(up.housingRatio * down.housingRatio - 1) < 1e-12);
  const same = compareCities("denver", "denver");
  assert.equal(same.percent, 0);
  assert.equal(same.direction, "same");
  assert.equal(same.housingPercent, 0);
  assert.equal(same.housingDirection, "same");
  assert.throws(() => compareCities("austin", "paris"), RangeError);
});

test("comparison descriptions distinguish broad prices from rent component", () => {
  const comparison = compareCities("austin", "new-york");
  assert.match(describeComparison(comparison), /New York are about 15% higher than in Austin/);
  assert.match(describeComparison(comparison), /112\.6 vs 98\.1/);
  assert.match(describeHousingComparison(comparison), /housing-rent price component/);
  assert.match(describeHousingComparison(comparison), /New York/);
  assert.match(describeComparison(compareCities("denver", "denver")), /same city/);
});

test("equivalentSpending scales an amount and rejects bad input", () => {
  assert.equal(equivalentSpending(5000, 1.1), 5500);
  assert.equal(equivalentSpending(0, 1.5), 0);
  assert.throws(() => equivalentSpending(-1, 1), RangeError);
  assert.throws(() => equivalentSpending(NaN, 1), RangeError);
  assert.throws(() => equivalentSpending(100, 0), RangeError);
});