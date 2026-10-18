import test from "node:test";
import assert from "node:assert/strict";
import {
  CALCULATOR_COST_KEYS,
  MAX_AMOUNT,
  TRACKER_KEYS,
  TRACKER_LINES,
  cleanAmount,
  cleanAmounts,
  describeDifference,
  describeLine,
  formatMoney,
  plannedFromCalculator,
  trackBudget,
} from "./tracker.js";
import { ITEMIZED_KEYS, costLines } from "./calculator.js";

test("every line has a unique key and a label", () => {
  assert.equal(new Set(TRACKER_KEYS).size, TRACKER_KEYS.length);
  for (const line of TRACKER_LINES) assert.ok(line.key && line.label.length > 3, line.key);
});

test("tracker lines cover every cost the calculator prints, with the same labels", () => {
  const everyCost = Object.fromEntries(["travel", "housing", "setup", "extras", ...ITEMIZED_KEYS].map(key => [key, 1]));
  for (const printed of costLines(everyCost)) {
    const line = TRACKER_LINES.find(l => l.key === printed.key);
    assert.ok(line, `missing line for ${printed.key}`);
    assert.equal(line.label, printed.label);
  }
});

test("cleanAmount accepts real amounts and turns everything else into 0", () => {
  assert.equal(cleanAmount(120), 120);
  assert.equal(cleanAmount("1,250.5"), 1250.5);
  assert.equal(cleanAmount(" 40 "), 40);
  assert.equal(cleanAmount(10.456), 10.46);
  for (const bad of ["", "abc", -5, "-5", 0, null, undefined, NaN, Infinity, MAX_AMOUNT + 1, {}, []]) {
    assert.equal(cleanAmount(bad), 0, String(bad));
  }
  assert.equal(cleanAmount(MAX_AMOUNT), MAX_AMOUNT);
});

test("cleanAmounts keeps only known lines above zero", () => {
  assert.deepEqual(cleanAmounts({ fuel: "80", made_up: 5, tips: -1, storage: 0, other: "12.5" }), { fuel: 80, other: 12.5 });
  assert.deepEqual(cleanAmounts(null), {});
  assert.deepEqual(cleanAmounts([1, 2]), {});
  assert.deepEqual(cleanAmounts("text"), {});
});

test("plannedFromCalculator copies only user-entered costs", () => {
  const saved = { fromState: "CA", distance: "900", size: "1", fuel: "300", tips: "50", movers: "999", other: "5", employerCash: "800", weeklyLiving: "400", storage: "0", packing: "abc" };
  assert.deepEqual(plannedFromCalculator(saved), { fuel: 300, tips: 50 });
  assert.deepEqual(plannedFromCalculator(null), {});
  assert.ok(!CALCULATOR_COST_KEYS.includes("movers") && !CALCULATOR_COST_KEYS.includes("other"));
});

test("nothing entered gives an empty result", () => {
  const result = trackBudget({}, {});
  assert.equal(result.hasData, false);
  assert.deepEqual(result.lines, []);
  assert.equal(result.plannedTotal, 0);
  assert.equal(result.status, "none");
  assert.equal(result.spentPercent, null);
});

test("line statuses and differences", () => {
  const result = trackBudget(
    { movers: 1000, fuel: 300, storage: 200, tips: 100 },
    { movers: 1100, fuel: 250, storage: 200, access: 75 },
  );
  const by = Object.fromEntries(result.lines.map(line => [line.key, line]));
  assert.equal(by.movers.status, "over");
  assert.equal(by.movers.difference, 100);
  assert.equal(by.movers.percent, 10);
  assert.equal(by.fuel.status, "under");
  assert.equal(by.fuel.difference, -50);
  assert.equal(by.fuel.percent, -17);
  assert.equal(by.storage.status, "on-plan");
  assert.equal(by.storage.difference, 0);
  assert.equal(by.tips.status, "pending");
  assert.equal(by.tips.difference, null);
  assert.equal(by.access.status, "unplanned");
  assert.equal(by.access.percent, null);
});

test("lines keep the fixed order of TRACKER_LINES", () => {
  const result = trackBudget({ other: 10, movers: 10, fuel: 10 }, {});
  assert.deepEqual(result.lines.map(line => line.key), ["movers", "fuel", "other"]);
});

test("totals compare like with like: unspent lines do not look like savings", () => {
  const result = trackBudget({ movers: 1000, fuel: 300, storage: 200, tips: 100 }, { movers: 1100, fuel: 250, storage: 200, access: 75 });
  assert.equal(result.plannedTotal, 1600);
  assert.equal(result.actualTotal, 1625);
  // Lines with an actual amount: movers, fuel, storage (planned 1500) and access (planned 0).
  assert.equal(result.spentLinesPlanned, 1500);
  assert.equal(result.spentDifference, 1625 - 1500);
  assert.equal(result.spentPercent, 8);
  assert.equal(result.stillToSpend, 100);
  assert.equal(result.expectedFinal, 1725);
  assert.equal(result.status, "over");
});

test("all planned and nothing spent shows pending lines, not a saving", () => {
  const result = trackBudget({ movers: 800, fuel: 200 }, {});
  assert.equal(result.status, "none");
  assert.equal(result.spentDifference, 0);
  assert.equal(result.stillToSpend, 1000);
  assert.equal(result.expectedFinal, 1000);
  assert.ok(result.lines.every(line => line.status === "pending"));
});

test("under budget and exactly on plan", () => {
  assert.equal(trackBudget({ fuel: 300 }, { fuel: 250 }).status, "under");
  assert.equal(trackBudget({ fuel: 300 }, { fuel: 300 }).status, "on-plan");
});

test("cents are added without floating-point drift", () => {
  const result = trackBudget({ fuel: 0.1, tips: 0.2 }, { fuel: 0.1, tips: 0.2 });
  assert.equal(result.plannedTotal, 0.3);
  assert.equal(result.actualTotal, 0.3);
  assert.equal(result.spentDifference, 0);
  assert.equal(result.status, "on-plan");
});

test("bad saved data cannot break the totals", () => {
  const result = trackBudget({ fuel: "x", movers: -5, bogus: 100 }, { fuel: NaN, other: "20" });
  assert.equal(result.plannedTotal, 0);
  assert.equal(result.actualTotal, 20);
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0].status, "unplanned");
});

test("money and difference wording", () => {
  assert.equal(formatMoney(1250), "$1,250");
  assert.equal(formatMoney(12.5), "$12.50");
  assert.equal(describeDifference(50), "Over by $50");
  assert.equal(describeDifference(-20.5), "Under by $20.50");
  assert.equal(describeDifference(0), "On plan");
  assert.equal(describeDifference(0.001), "On plan");
  assert.equal(describeDifference(null), "");
  assert.equal(describeLine({ status: "pending" }), "Not spent yet");
  assert.equal(describeLine({ status: "unplanned" }), "No planned amount");
  assert.equal(describeLine({ status: "over", difference: 10 }), "Over by $10");
});
