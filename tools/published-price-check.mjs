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

// ---------------------------------------------------------------------------------------------------------
// Second set (B2, read on 2026-11-10; see docs/operations/PUBLISHED-PRICE-CHECK-2-2026-11-10.md).
// Full-service ranges published by named sources, compared with our full-service total at the same miles.
// "sizes" is the home-size mapping assumption (bedrooms -> calculator size); the verdict uses the size most
// favourable to us, so an unfavourable mapping can never be what produces a "below" result.
// Sources are NOT independent: Opendoor compiles Forbes Home, Move.org, MoveBuddha, AMSA, NAVL and PODS.
// ---------------------------------------------------------------------------------------------------------
const OPENDOOR = "Opendoor article (updated 2026-04-20; compiles Forbes Home/Move.org table)";
const NAVL = "Opendoor article (updated 2026-04-20), table credited to North American Van Lines";
const HAH = "HireAHelper (last updated 2026-07-13; own marketplace data, 50,000+ moves)";
const HAH_LOCAL = "HireAHelper local full-service (last updated 2026-07-13; hourly pricing, usually 2-mover minimum)";
const ANGI = "Angi, 3-bedroom long-distance ('2025 Data' in title; no page date)";
const S1 = [1, 1.35], S2 = [1.35, 1.8], S3 = [1.8, 2.4], S4 = [1.8, 2.4], S23 = [1.35, 1.8, 2.4];
export const observations = [
  { source: OPENDOOR, label: "1 BR, 1,000 mi", miles: 1000, sizes: S1, low: 1500, high: 3500 },
  { source: OPENDOOR, label: "2 BR, 1,000 mi", miles: 1000, sizes: S2, low: 2500, high: 5500 },
  { source: OPENDOOR, label: "3 BR, 1,000 mi", miles: 1000, sizes: S3, low: 3500, high: 7500 },
  { source: OPENDOOR, label: "4 BR, 1,000 mi", miles: 1000, sizes: S4, low: 5000, high: 10000 },
  { source: NAVL, label: "1 BR, 500 mi", miles: 500, sizes: S1, low: 1500, high: 2800 },
  { source: NAVL, label: "2 BR, 500 mi", miles: 500, sizes: S2, low: 2500, high: 4200 },
  { source: NAVL, label: "3 BR, 500 mi", miles: 500, sizes: S3, low: 3500, high: 5800 },
  { source: NAVL, label: "1 BR, 1,000 mi", miles: 1000, sizes: S1, low: 2000, high: 3500 },
  { source: NAVL, label: "2 BR, 1,000 mi", miles: 1000, sizes: S2, low: 3200, high: 5500 },
  { source: NAVL, label: "3 BR, 1,000 mi", miles: 1000, sizes: S3, low: 4500, high: 7500 },
  { source: NAVL, label: "1 BR, 2,000+ mi (compared at 2,000)", miles: 2000, sizes: S1, low: 2500, high: 4500 },
  { source: NAVL, label: "2 BR, 2,000+ mi (compared at 2,000)", miles: 2000, sizes: S2, low: 4000, high: 7000 },
  { source: NAVL, label: "3 BR, 2,000+ mi (compared at 2,000)", miles: 2000, sizes: S3, low: 5500, high: 9500 },
  { source: HAH, label: "2-3 BR, New York to Miami, 1,280 mi", miles: 1280, sizes: S23, low: 5359, high: 8226 },
  { source: HAH_LOCAL, label: "Studio/1 BR, local (HireAHelper table, no distance; compared at 20 mi)", miles: 20, sizes: S1, low: 791, high: 1099 },
  { source: HAH_LOCAL, label: "2 BR, 20-mile local move", miles: 20, sizes: S2, low: 1038, high: 1441 },
  { source: ANGI, label: "3 BR, 1,000+ mi (compared at 1,000)", miles: 1000, sizes: S3, low: 3100, high: 6000 },
  { source: ANGI, label: "3 BR, 2,500+ mi (compared at 2,500)", miles: 2500, sizes: S3, low: 4200, high: 8600 },
];
// Published but not comparable by size/distance, so not counted: HireAHelper long-distance table (distance not
// stated: 2-3 BR $2,910-$4,569), ConsumerAffairs 2026-05-27 (more than 1,000 mi "typically around $5,000", up to
// $10,000, no home size), MoveBuddha 2026-11-04 (19 quotes at 2,036-3,134 mi, median $4,500, range $2,469-$15,000,
// no home size, services not stated, includes container and truck-rental firms).

export function compareObservation(o) {
  const rows = o.sizes.map((size) => {
    const r = calculateBudget({ distance: o.miles, size, type: FULL_SERVICE });
    return { size, total: r.total, bandLow: r.rangeLow, bandHigh: r.rangeHigh };
  });
  const best = rows.reduce((a, b) => (b.total > a.total ? b : a)); // most favourable to us
  let verdict;
  if (best.total >= o.low && best.total <= o.high) verdict = "inside published range";
  else if (best.total > o.high) verdict = "above published range";
  else if (best.bandHigh >= o.low) verdict = "total below range, band reaches it";
  else verdict = "published range entirely above our band";
  return { ...o, rows, best, verdict };
}

if (process.argv[1] && process.argv[1].endsWith("published-price-check.mjs")) {
  console.log("\n== Second set: full-service ranges, verdict uses the size most favourable to us ==");
  const results = observations.map(compareObservation);
  for (const r of results) {
    const sizes = r.rows.map((x) => `${x.size}: ${Math.round(x.total)} (${Math.round(x.bandLow)}-${Math.round(x.bandHigh)})`).join("; ");
    console.log(`${r.label} | ${r.source.split(" (")[0]} | published ${r.low}-${r.high} | ours ${sizes} | ${r.verdict}`);
  }
  const tally = {};
  for (const r of results) tally[r.verdict] = (tally[r.verdict] ?? 0) + 1;
  console.log("\nTally over", results.length, "cells:", JSON.stringify(tally));
  const bySource = {};
  for (const r of results) {
    const k = r.source.split(" (")[0].split(",")[0].replace(" local full-service", " local");
    bySource[k] ??= { cells: 0, entirelyAbove: 0 };
    bySource[k].cells += 1;
    if (r.verdict === "published range entirely above our band") bySource[k].entirelyAbove += 1;
  }
  console.log("By source:", JSON.stringify(bySource));
}
