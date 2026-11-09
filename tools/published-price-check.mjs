// Read-only comparison: calculator totals vs published route-specific price figures.
// Does not change any coefficient. Source figures were read on 2026-11-09 (see
// docs/operations/PUBLISHED-PRICE-CHECK-2026-11-09.md for sources, dates and caveats).
import { calculateBudget } from "../src/lib/calculator.js";

const FULL_SERVICE = 1.65;
// size = calculator home-size multiplier(s) that could match the published home (a mapping assumption).
const cells = [
  { route: "Studio, Detroit to Los Angeles (2,252 mi)", miles: 2252, sizes: [1], pods: [3257, 5658], toh: null },
  { route: "1-bed, Raleigh to Ocala (562 mi)", miles: 562, sizes: [1, 1.35], pods: [2274, 4692], toh: 1999 },
  { route: "2-bed, Charleston to New Orleans (785 mi)", miles: 785, sizes: [1.35, 1.8], pods: [2609, 5757], toh: 2087 },
  { route: "2-bed, St. Louis to Sarasota (1,103 mi)", miles: 1103, sizes: [1.35, 1.8], pods: [3240, 6872], toh: 2668 },
  { route: "3-bed, Oklahoma City to Boston (1,695 mi)", miles: 1695, sizes: [1.8, 2.4], pods: [5370, 8346], toh: 4253 },
];
for (const c of cells) {
  for (const size of c.sizes) {
    const r = calculateBudget({ distance: c.miles, size, type: FULL_SERVICE });
    const inRange = (v) => (v == null ? "n/a" : v >= r.rangeLow && v <= r.rangeHigh ? "inside" : v < r.rangeLow ? "below our range" : "above our range");
    console.log(`${c.route} | size ${size} | ours ${Math.round(r.total)} (${Math.round(r.rangeLow)}-${Math.round(r.rangeHigh)}) | TOH avg ${c.toh ?? "-"}: ${inRange(c.toh)} | PODS blog ${c.pods.join("-")}: lower end ${inRange(c.pods[0])}, upper end ${inRange(c.pods[1])}`);
  }
}
