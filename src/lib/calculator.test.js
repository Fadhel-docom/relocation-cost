import test from "node:test";
import assert from "node:assert/strict";
import { calculateBudget, getUhaulBenchmark, HOME_SIZES, MOVE_TYPES, pickAllowed } from "./calculator.js";

const assertClose = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${expected}, got ${actual}`);
};

const DIY = 0.65;
const TRUCK = 1;
const FULL = 1.65;

test("U-Haul benchmark uses documented mileage bands", () => {
  assert.equal(getUhaulBenchmark(200), 202);
  assert.equal(getUhaulBenchmark(350), 444);
  assert.equal(getUhaulBenchmark(750), 995);
  assert.equal(getUhaulBenchmark(1400), 1657);
  assert.equal(getUhaulBenchmark(1800), 2190);
  assert.equal(getUhaulBenchmark(2200), 2694);
  assert.equal(getUhaulBenchmark(3000), 3517);
});

test("calculateBudget anchors the DIY base on the published benchmark and adds the service premium", () => {
  const result = calculateBudget({ distance: 1400, size: 1.8, type: FULL });
  assert.equal(result.marketBenchmark, 1657);
  assert.equal(result.moveFloored, true);
  assertClose(result.move, 3068.2);
  assertClose(result.total, 3375.02);
  assertClose(result.rangeLow, 2700.016);
  assertClose(result.rangeHigh, 4050.024);
});

test("calculateBudget regression: 1400 miles, size 1.35, full-service", () => {
  const result = calculateBudget({ distance: 1400, size: 1.35, type: FULL });
  assertClose(result.move, 2715.4);
  assertClose(result.total, 2986.94);
});

test("NY → FL: 2BR/rental-truck planning case", () => {
  const result = calculateBudget({ distance: 1100, size: 1.35, type: TRUCK });
  assertClose(result.move, 1948.06);
  assertClose(result.total, 2142.866);
});

test("WA → CO: 4BR/DIY planning case is anchored on the benchmark", () => {
  const result = calculateBudget({ distance: 1300, size: 2.4, type: DIY });
  assertClose(result.move, 1657);
  assertClose(result.total, 1822.7);
  assert.equal(result.moveFloored, true);
});

test("short moves are not raised: the model already exceeds the benchmark", () => {
  const diy = calculateBudget({ distance: 100, size: 1, type: DIY });
  assert.equal(diy.moveFloored, false);
  assertClose(diy.move, 386.4);
  assertClose(diy.total, 425.04);
  const full = calculateBudget({ distance: 100, size: 1, type: FULL });
  assertClose(full.move, 442.4);
});

test("no move type is estimated below the published benchmark", () => {
  for (const distance of [1, 150, 200, 201, 500, 800, 1000, 1001, 1317, 1500, 2000, 2600, 3200]) {
    for (const size of [1, 1.35, 1.8, 2.4]) {
      for (const type of [DIY, TRUCK, FULL]) {
        const result = calculateBudget({ distance, size, type });
        assert.ok(
          result.move >= result.marketBenchmark,
          `${distance}mi size ${size} type ${type}: move ${result.move} vs benchmark ${result.marketBenchmark}`,
        );
      }
    }
  }
});

test("DIY <= rental truck <= full-service for the same distance and home size", () => {
  for (const distance of [100, 500, 1000, 1317, 2200, 3200]) {
    for (const size of [1, 1.35, 1.8, 2.4]) {
      const diy = calculateBudget({ distance, size, type: DIY });
      const truck = calculateBudget({ distance, size, type: TRUCK });
      const full = calculateBudget({ distance, size, type: FULL });
      assert.ok(diy.total <= truck.total, `${distance}mi size ${size}: DIY above truck`);
      assert.ok(truck.total <= full.total, `${distance}mi size ${size}: truck above full-service`);
    }
  }
});

test("CA → TX comparison uses one home size and gives three distinct, ordered totals", () => {
  const totals = [DIY, TRUCK, FULL].map(type => calculateBudget({ distance: 1317, size: 1.35, type }).total);
  assertClose(totals[0], 1822.7);
  assertClose(totals[1], 2206.02602);
  assertClose(totals[2], 2917.9172);
});

test("home-size comparison never decreases as the home gets larger, for every move type", () => {
  const sizes = [1, 1.35, 1.8, 2.4];
  for (const type of [DIY, TRUCK, FULL]) {
    for (const distance of [100, 500, 1000, 1317, 2200, 3200]) {
      const totals = sizes.map(size => calculateBudget({ distance, size, type, travel: 200 }).total);
      for (let i = 1; i < totals.length; i += 1) {
        assert.ok(totals[i] >= totals[i - 1] - 1e-9, `${distance}mi type ${type}: size ${sizes[i]} below size ${sizes[i - 1]}`);
      }
    }
  }
});

test("CA → TX home-size comparison with DIY gives the documented totals", () => {
  const totals = [1, 1.35, 1.8, 2.4].map(size => calculateBudget({ distance: 1317, size, type: DIY }).total);
  assertClose(totals[0], 1822.7);
  assertClose(totals[1], 1822.7);
  assertClose(totals[2], 1822.7);
  assertClose(totals[3], 1822.7);
});

test("home size and move type must be one of the offered options", () => {
  for (const size of [0, -1, 1.5, 3, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateBudget({ distance: 1000, size, type: TRUCK }), RangeError, `size ${size}`);
  }
  for (const type of [0, 0.5, 2, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateBudget({ distance: 1000, size: 1.35, type }), RangeError, `type ${type}`);
  }
});

test("pickAllowed keeps offered options and falls back for anything else", () => {
  assert.equal(pickAllowed("1.35", HOME_SIZES, 1), 1.35);
  assert.equal(pickAllowed("2.4", HOME_SIZES, 1), 2.4);
  assert.equal(pickAllowed("1.65", MOVE_TYPES, 0.65), 1.65);
  for (const bad of ["", "abc", "0", "1.5", "99", null, undefined]) {
    assert.equal(pickAllowed(bad, HOME_SIZES, 1), 1, `value ${bad}`);
  }
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


test("total never decreases as distance grows, for every size and move type", () => {
  for (const size of [1, 1.35, 1.8, 2.4]) {
    for (const type of [DIY, TRUCK, FULL]) {
      let previous = 0;
      for (let distance = 1; distance <= 5000; distance += 1) {
        const { total } = calculateBudget({ distance, size, type });
        assert.ok(total >= previous - 1e-9, `total fell at ${distance} mi (size ${size}, type ${type})`);
        previous = total;
      }
    }
  }
});

test("DIY <= rental truck + labor <= full-service at every distance and size", () => {
  for (const size of [1, 1.35, 1.8, 2.4]) {
    for (let distance = 1; distance <= 5000; distance += 13) {
      const diy = calculateBudget({ distance, size, type: DIY }).total;
      const truck = calculateBudget({ distance, size, type: TRUCK }).total;
      const full = calculateBudget({ distance, size, type: FULL }).total;
      assert.ok(diy <= truck && truck <= full, `ordering broke at ${distance} mi (size ${size})`);
    }
  }
});

test("the range always brackets the total", () => {
  for (const distance of [1, 199, 200, 201, 500, 501, 1000, 1001, 2500, 2501, 30000]) {
    const result = calculateBudget({ distance, size: 1.8, type: TRUCK, travel: 120, extras: 300 });
    assert.ok(result.rangeLow < result.total && result.total < result.rangeHigh);
  }
});
test("audit: DIY home sizes tie while the benchmark floor dominates, truck and full-service never tie", () => {
  const sizes = [1, 1.35, 1.8, 2.4];
  const cents = (distance, type) => sizes.map(size => Math.round(calculateBudget({ distance, size, type }).total * 100));
  assert.equal(new Set(cents(1317, DIY)).size, 1);
  assert.ok(calculateBudget({ distance: 1317, size: 2.4, type: DIY }).moveFloored);
  for (const type of [TRUCK, FULL]) {
    for (const distance of [100, 500, 1317, 2200, 3200]) {
      assert.equal(new Set(cents(distance, type)).size, sizes.length, `${distance} mi type ${type}`);
    }
  }
});

test("audit: the estimate steps up at U-Haul band boundaries (documented behavior)", () => {
  const before = calculateBudget({ distance: 1000, size: 1, type: DIY });
  const after = calculateBudget({ distance: 1001, size: 1, type: DIY });
  assertClose(before.total, 1094.5);
  assertClose(after.total, 1822.7);
});

test("audit: rounded move + other + contingency stays within $1 of the rounded total", () => {
  for (const distance of [37, 480, 1317, 2250]) {
    for (const size of [1, 1.35, 1.8, 2.4]) {
      for (const type of [DIY, TRUCK, FULL]) {
        const r = calculateBudget({ distance, size, type, travel: 100.4, housing: 100.4, setup: 66.3, extras: 66.3 });
        const parts = Math.round(r.move) + Math.round(r.other) + Math.round(r.contingency);
        assert.ok(Math.abs(parts - Math.round(r.total)) <= 1, `${distance}mi size ${size} type ${type}`);
      }
    }
  }
});

test("audit: contingency is 10% of move plus other costs and the range is plus or minus 20%", () => {
  const r = calculateBudget({ distance: 800, size: 1.8, type: TRUCK, travel: 250, extras: 400 });
  assertClose(r.contingency, (r.move + r.other) * 0.1);
  assertClose(r.total, r.move + r.other + r.contingency);
  assertClose(r.rangeLow, r.total * 0.8);
  assertClose(r.rangeHigh, r.total * 1.2);
});
