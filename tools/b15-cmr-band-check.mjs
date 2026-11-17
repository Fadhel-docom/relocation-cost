// B15 diagnostic (read-only): compares the model's full-service MOVE component with the CMR
// 25th-75th percentile booked-price cells in data/cmr-full-service-ranges.json (all five distance bands and all
// four size groups), and checks whether CMR's medians agree with the independently published ranges used
// in tools/published-price-check.mjs (B2). It changes nothing.
//
// Usage: node tools/b15-cmr-band-check.mjs
//
// Caveats printed with the results: CMR is one mover network; the B2 ranges are secondary compilations
// (Opendoor compiles NAVL and others) and are not independent of each other; the model's "move" excludes other
// costs and contingency, and so do CMR's booked prices.

import { readFileSync } from "node:fs";
import { calculateBudget, getUhaulBenchmark, MOVE_BASE_COST, MOVE_PER_MILE, DIY_TYPE_MULTIPLIER } from "../src/lib/calculator.js";

const cmr = JSON.parse(readFileSync(new URL("../data/cmr-full-service-ranges.json", import.meta.url), "utf8"));
const FULL_SERVICE = 1.65;
const move = (distance, size) => calculateBudget({ distance, size, type: FULL_SERVICE }).move;
const bandFor = distance => cmr.distance_bands.find(b => distance >= b.min_miles && (b.max_miles === null || distance < b.max_miles + 1));

// Three probe distances inside each band (the 2,000+ band is open-ended, so 2,000 / 2,500 / 3,000 are used).
const PROBES = { "100–499 miles": [150, 300, 499], "500–999 miles": [500, 750, 999], "1,000–1,499 miles": [1000, 1250, 1499], "1,500–1,999 miles": [1500, 1750, 1999], "2,000+ miles": [2000, 2500, 3000] };

console.log("1) Model full-service move vs the CMR 25th-75th percentile range, by band and size (3 probe distances per cell)");
const tally = { below: 0, inside: 0, above: 0 };
const bySize = {};
for (const band of cmr.distance_bands) {
  for (const [size, cell] of Object.entries(band.sizes)) {
    const values = PROBES[band.label].map(d => move(d, Number(size)));
    const states = values.map(v => (v < cell.low ? "below" : v > cell.high ? "above" : "inside"));
    states.forEach(s => { tally[s] += 1; (bySize[size] ??= { below: 0, inside: 0, above: 0 })[s] += 1; });
    const ratio = values[1] / cell.median;
    console.log(`  ${band.label.padEnd(18)} size ${size.padEnd(4)} CMR ${cell.low}-${cell.high} (median ${cell.median}, n=${cell.n})`.padEnd(70) + ` model ${values.map(Math.round).join(" / ").padEnd(20)} ${states.map(s => s[0]).join("")}  mid-probe/median ${ratio.toFixed(2)}`);
  }
}
console.log(`  probes below / inside / above: ${tally.below} / ${tally.inside} / ${tally.above} of ${tally.below + tally.inside + tally.above}`);
for (const [size, t] of Object.entries(bySize)) console.log(`    size ${size}: below ${t.below}, inside ${t.inside}, above ${t.above}`);

console.log("\n2) How CMR's median moves with distance (first band -> last band)");
for (const size of ["1", "1.35", "1.8", "2.4"]) {
  const medians = cmr.distance_bands.map(b => b.sizes[size].median);
  const modelFirst = move(300, Number(size));
  const modelLast = move(2500, Number(size));
  console.log(`  size ${size}: CMR medians ${medians.join(" -> ")} (x${(medians[4] / medians[0]).toFixed(2)}); model ${Math.round(modelFirst)} at 300 mi -> ${Math.round(modelLast)} at 2,500 mi (x${(modelLast / modelFirst).toFixed(2)})`);
}

// Independent published full-service ranges, copied from tools/published-price-check.mjs (read 2026-11-10).
// [label, miles, size, low, high]; bedroom -> size is 1BR 1, 2BR 1.35, 3BR 1.8, 4BR 2.4.
const PUBLISHED = [
  ["Opendoor 1BR 1,000 mi", 1000, 1, 1500, 3500], ["Opendoor 2BR 1,000 mi", 1000, 1.35, 2500, 5500], ["Opendoor 3BR 1,000 mi", 1000, 1.8, 3500, 7500], ["Opendoor 4BR 1,000 mi", 1000, 2.4, 5000, 10000],
  ["NAVL 1BR 500 mi", 500, 1, 1500, 2800], ["NAVL 2BR 500 mi", 500, 1.35, 2500, 4200], ["NAVL 3BR 500 mi", 500, 1.8, 3500, 5800],
  ["NAVL 1BR 1,000 mi", 1000, 1, 2000, 3500], ["NAVL 2BR 1,000 mi", 1000, 1.35, 3200, 5500], ["NAVL 3BR 1,000 mi", 1000, 1.8, 4500, 7500],
  ["NAVL 1BR 2,000+ mi", 2000, 1, 2500, 4500], ["NAVL 2BR 2,000+ mi", 2000, 1.35, 4000, 7000], ["NAVL 3BR 2,000+ mi", 2000, 1.8, 5500, 9500],
  ["Angi 3BR 1,000+ mi", 1000, 1.8, 3100, 6000], ["Angi 3BR 2,500+ mi", 2500, 1.8, 4200, 8600],
];
console.log("\n3) Does the CMR median fall inside each independently published range (and where is the model)?");
let cmrInside = 0;
let modelInside = 0;
for (const [label, miles, size, low, high] of PUBLISHED) {
  const median = bandFor(miles).sizes[String(size)].median;
  const m = move(miles, size);
  const cmrOk = median >= low && median <= high;
  const modelOk = m >= low && m <= high;
  if (cmrOk) cmrInside += 1;
  if (modelOk) modelInside += 1;
  console.log(`  ${label.padEnd(24)} published ${String(low).padStart(5)}-${String(high).padEnd(5)} CMR median ${String(median).padStart(5)} ${cmrOk ? "inside" : "OUTSIDE"}   model ${String(Math.round(m)).padStart(5)} ${modelOk ? "inside" : m < low ? "below" : "above"}`);
}
console.log(`  CMR median inside: ${cmrInside} of ${PUBLISHED.length}; current model inside: ${modelInside} of ${PUBLISHED.length}`);

// 4+ bedrooms: CMR against the route-level ranges of the other two publishers.
const ROUTES = [["moveBuddha Boston-Miami", 1501, 5343, 8726], ["moveBuddha Nashville-Burlington", 1089, 4443, 8900], ["My Good Movers Nashville-Burlington", 1071, 3964, 7534]];
console.log("\n4) 4+ bedrooms: CMR 25th-75th vs the route-level ranges of the other publishers");
for (const [label, miles, low, high] of ROUTES) {
  const c = bandFor(miles).sizes["2.4"];
  const lo = Math.max(low, c.low);
  const hi = Math.min(high, c.high);
  console.log(`  ${label.padEnd(38)} CMR ${c.low}-${c.high}  route ${low}-${high}  overlap ${lo <= hi ? `${lo}-${hi}` : "none"}  model ${Math.round(move(miles, 2.4))}`);
}

// 5) A size exponent alone is not a fix. Candidate: scale only the full-service premium by size^k instead of size
// (k = 1 is today's formula; studio is unchanged for every k). Median ratio = model at the middle probe / CMR median.
const withExponent = (distance, size, k) => {
  const perMile = distance * MOVE_PER_MILE;
  const diyBase = Math.max(MOVE_BASE_COST + perMile * size * DIY_TYPE_MULTIPLIER, getUhaulBenchmark(distance));
  return diyBase + perMile * Math.pow(size, k) * (FULL_SERVICE - DIY_TYPE_MULTIPLIER);
};
console.log("\n5) Candidate size exponent k on the full-service premium: model / CMR median at the middle probe of each band");
for (const k of [1, 2.25]) {
  console.log(`  k = ${k}`);
  for (const band of cmr.distance_bands) {
    const mid = PROBES[band.label][1];
    const ratios = ["1", "1.35", "1.8", "2.4"].map(size => (withExponent(mid, Number(size), k) / band.sizes[size].median).toFixed(2));
    console.log(`    ${band.label.padEnd(18)} at ${String(mid).padStart(4)} mi  sizes 1 / 1.35 / 1.8 / 2.4: ${ratios.join(" / ")}`);
  }
}
