// Guards for the bedroom-based home-size vocabulary (B16) and the distance-band lookup of the
// published full-service range (B15). The stored numeric size values never change:
// 1 = studio / 1 bedroom, 1.35 = 2 bedrooms, 1.8 = 3 bedrooms, 2.4 = 4+ bedrooms.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { getFullServiceRange, HOME_SIZES } from "./calculator.js";
import { PUBLISHED_PRICE_CHECKS } from "./published-price-comparison.js";

function sourceFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(astro|js)$/.test(name) && !/\.test\.js$/.test(name) ? [path] : [];
  });
}

test("the old room-count size labels do not appear anywhere on the site", () => {
  const old = /Studio \/ 1 room|2–3 rooms|4–5 rooms|6\+ rooms|2 to 3 room home|2–3 room home/;
  for (const file of sourceFiles("src")) {
    assert.doesNotMatch(readFileSync(file, "utf8"), old, `${file} still uses a room-count size label`);
  }
});

test("each published comparison example uses the calculator size that matches its bedroom label", () => {
  const expected = [
    [/studio|1-bedroom/i, 1],
    [/2-bedroom/i, 1.35],
    [/3-bedroom/i, 1.8],
    // Published combined 2–3 bedroom group, compared at the 3-bedroom size (stated on the page).
    [/2–3 bedrooms \(compared at 3 bedrooms\)/, 1.8],
  ];
  for (const check of PUBLISHED_PRICE_CHECKS) {
    const match = expected.find(([pattern]) => pattern.test(check.label));
    assert.ok(match, `no size rule for "${check.label}"`);
    assert.equal(check.size, match[1], `"${check.label}" uses size ${check.size}`);
    assert.ok(HOME_SIZES.includes(check.size));
  }
});

test("the published range is found for every distance from 100 miles, including typed decimals", () => {
  for (const distance of [100, 499, 499.5, 499.99, 500, 999.5, 1000, 1499.5, 1500, 1999.5, 2000, 2500.25, 30000]) {
    for (const size of HOME_SIZES) {
      assert.ok(getFullServiceRange(distance, size), `${distance} mi size ${size}`);
    }
  }
  assert.equal(getFullServiceRange(99.9, 1), null, "no extrapolation below 100 miles");
  assert.equal(getFullServiceRange(499.5, 1).distanceBand, "100–499 miles");
  assert.equal(getFullServiceRange(500, 1).distanceBand, "500–999 miles");
});
