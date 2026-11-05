import test from "node:test";
import assert from "node:assert/strict";
import { routeAnswer } from "./route-answer.js";

const scenarios = [
  { label: "DIY", total: 1200 },
  { label: "Rental truck + labor", total: 1800 },
  { label: "Full-service movers", total: 3200 }
];

test("route answer uses the exact route and scenario totals supplied by the page", () => {
  const answer = routeAnswer({
    from: "California",
    to: "Texas",
    homeSize: "2–3 rooms",
    scenarios
  });
  assert.match(answer, /2–3 rooms home/);
  assert.match(answer, /California to Texas/);
  assert.ok(answer.includes("$1,200 for diy"));
  assert.ok(answer.includes("$1,800 for rental truck + labor"));
  assert.ok(answer.includes("$3,200 for full-service movers"));
  assert.match(answer, /planning estimates/);
  assert.match(answer, /not quotes/);
  assert.match(answer, /straight-line distance between state centers/);
});

test("route answer rejects missing names, labels or non-finite totals", () => {
  assert.throws(() => routeAnswer({ from: "", to: "Texas", homeSize: "2–3 rooms", scenarios }), TypeError);
  assert.throws(() => routeAnswer({ from: "California", to: "Texas", homeSize: "", scenarios }), TypeError);
  assert.throws(() => routeAnswer({ from: "California", to: "Texas", homeSize: "2–3 rooms", scenarios: scenarios.slice(0, 2) }), TypeError);
  assert.throws(() => routeAnswer({ from: "California", to: "Texas", homeSize: "2–3 rooms", scenarios: [{ ...scenarios[0], total: NaN }, ...scenarios.slice(1)] }), TypeError);
});
