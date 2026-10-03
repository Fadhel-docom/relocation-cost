import test from "node:test";
import assert from "node:assert/strict";
import { calculateBudget, getUhaulBenchmark } from "./calculator.js";

const assertClose = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${expected}, got ${actual}`);
};

test("U-Haul benchmark uses documented mileage bands", () => {
  assert.equal(getUhaulBenchmark(200), 202);
  assert.equal(getUhaulBenchmark(350), 444);
  assert.equal(getUhaulBenchmark(750), 995);
  assert.equal(getUhaulBenchmark(1400), 1657);
  assert.equal(getUhaulBenchmark(1800), 2190);
  assert.equal(getUhaulBenchmark(2200), 2694);
  assert.equal(getUhaulBenchmark(3000), 3517);
});

test("calculateBudget exposes a market benchmark without replacing the planning model", () => {
  const result = calculateBudget({ distance: 1400, size: 1.8, type: 1.65 });
  assert.equal(result.marketBenchmark, 1657);
  assertClose(result.move, 2678.48);
  assertClose(result.total, 2946.328);
  assertClose(result.rangeLow, 2357.0624);
  assertClose(result.rangeHigh, 3535.5936);
});

test("calculateBudget regression: 1400 miles, size 1.35, type 1.65", () => {
  const result = calculateBudget({ distance: 1400, size: 1.35, type: 1.65 });
  assertClose(result.move, 2096.36);
  assertClose(result.total, 2305.996);
});

test("NY → FL: 2BR/hybrid planning case", () => {
  const result = calculateBudget({ distance: 1100, size: 1.35, type: 1 });
  assertClose(result.move, 1181.6);
  assertClose(result.total, 1299.76);
});

test("WA → CO: 4BR/DIY planning case", () => {
  const result = calculateBudget({ distance: 1300, size: 2.4, type: 0.65 });
  assertClose(result.move, 1485.68);
  assertClose(result.total, 1634.248);
});

test("distance 0 is rejected", () => {
  assert.throws(() => calculateBudget({ distance: 0, size: 1.35, type: 1 }), RangeError);
});

test("distance 50000 is rejected", () => {
  assert.throws(() => calculateBudget({ distance: 50000, size: 1.35, type: 1 }), RangeError);
});

test("negative travel is rejected", () => {
  assert.throws(() => calculateBudget({ distance: 1400, size: 1.35, type: 1, travel: -1 }), RangeError);
});
