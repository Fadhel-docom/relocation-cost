import test from "node:test";
import assert from "node:assert/strict";
import { MAX_DESCRIPTION_LENGTH, dollarAmounts, routeDescription } from "./route-meta.js";
import { calculateBudget, getUhaulBenchmark } from "./calculator.js";
import { MOVE_OPTIONS } from "./inclusions.js";

const totalsFor = distance => MOVE_OPTIONS.map(option => calculateBudget({ distance, size: 1.35, type: option.type }).total);

test("the description carries the real figures for the route", () => {
  const distance = 1240;
  const totals = totalsFor(distance);
  const benchmark = getUhaulBenchmark(distance);
  const text = routeDescription({ from: "California", to: "Texas", miles: "1,240", totals, benchmark });
  const fmt = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  assert.match(text, /^Moving California to Texas: about 1,240 miles\./);
  for (const total of totals) assert.ok(text.includes(fmt(total)), `missing ${fmt(total)}`);
  assert.ok(text.includes(fmt(benchmark)));
  assert.match(text, /Planning totals/);
  assert.ok(text.length <= MAX_DESCRIPTION_LENGTH, `${text.length}: ${text}`);
});

test("never longer than a search result allows, even for the longest names and the biggest numbers", () => {
  for (const [from, to] of [["North Carolina", "South Carolina"], ["West Virginia", "North Carolina"], ["San Francisco, CA", "Los Angeles, CA"]]) {
    for (const distance of [120, 999, 2500, 2900]) {
      const text = routeDescription({ from, to, miles: distance.toLocaleString("en-US"), totals: totalsFor(distance), benchmark: getUhaulBenchmark(distance) });
      assert.ok(text.length <= MAX_DESCRIPTION_LENGTH, `${text.length}: ${text}`);
      assert.ok(text.endsWith("."), text);
    }
  }
});

test("a long description drops the least important part, not the middle of a figure", () => {
  const base = { miles: "2,500", totals: [1234, 2345, 3456], benchmark: 1999 };
  const short = routeDescription({ ...base, from: "A", to: "B" });
  assert.ok(short.includes("U-Haul"));
  const long = routeDescription({ ...base, from: "A very long place name indeed", to: "Another very long place name" });
  assert.ok(!long.includes("U-Haul"), long);
  assert.ok(long.includes("$1,234") && long.includes("$3,456"), long);
  assert.ok(long.length <= MAX_DESCRIPTION_LENGTH, long);
});

test("different routes give different descriptions", () => {
  const a = routeDescription({ from: "California", to: "Texas", miles: "1,240", totals: totalsFor(1240), benchmark: getUhaulBenchmark(1240) });
  const b = routeDescription({ from: "Ohio", to: "Florida", miles: "800", totals: totalsFor(800), benchmark: getUhaulBenchmark(800) });
  assert.notEqual(a, b);
});

test("rejects missing or non-numeric figures instead of printing NaN", () => {
  assert.throws(() => routeDescription({ from: "A", to: "B", miles: "1", totals: [1, 2], benchmark: 1 }), TypeError);
  assert.throws(() => routeDescription({ from: "A", to: "B", miles: "1", totals: [1, 2, NaN], benchmark: 1 }), TypeError);
  assert.throws(() => routeDescription({ from: "A", to: "B", miles: "1", totals: [1, 2, 3], benchmark: undefined }), TypeError);
});

test("dollarAmounts lists the figures as written", () => {
  assert.deepEqual(dollarAmounts("DIY $1,046, truck $1,615 and 3 rooms"), ["$1,046", "$1,615"]);
  assert.deepEqual(dollarAmounts("no figures"), []);
});
