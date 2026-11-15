// B15 diagnostic (read-only): compares the current full-service move component
// with the published route ranges and the unified source matrix documented in
// docs/operations/B15-UNIFIED-MATRIX-HOLDOUT-2026-11-14.md (sections 1, 2 and 6).
// It changes nothing. The published numbers below are copied from that report;
// they are not read from the sources again by this script.
//
// Usage: node tools/b15-size-scaling-check.mjs

import { calculateBudget, HOME_SIZES } from "../src/lib/calculator.js";

const FULL_SERVICE = 1.65;
const fullMove = (distance, size) => calculateBudget({ distance, size, type: FULL_SERVICE }).move;

// The report maps Studio/1BR, 2-3BR and 4+BR to the legacy size values 1.0, 1.8
// and 2.4. That mapping is an assumption (the UI says "rooms", sources say
// bedrooms), so every comparison below inherits it.
const SIZE_FOR_GROUP = { "Studio/1BR": 1.0, "2-3BR": 1.8, "4+BR": 2.4 };

const routeRanges = [
  { route: "Boston-Miami", miles: 1501, publisher: "moveBuddha", ranges: { "Studio/1BR": [2127, 4772], "2-3BR": [2754, 6840], "4+BR": [5343, 8726] } },
  { route: "Nashville-Burlington", miles: 1089, publisher: "moveBuddha", ranges: { "Studio/1BR": [2123, 4773], "2-3BR": [2658, 6736], "4+BR": [4443, 8900] } },
  { route: "Nashville-Burlington", miles: 1071, publisher: "My Good Movers", ranges: { "Studio/1BR": [1957, 4581], "2-3BR": [2437, 5711], "4+BR": [3964, 7534] } },
];

console.log("1) Is the model inside the published full-service range?");
let inside = 0;
let cells = 0;
for (const { route, miles, publisher, ranges } of routeRanges) {
  for (const [group, [low, high]] of Object.entries(ranges)) {
    const model = Math.round(fullMove(miles, SIZE_FOR_GROUP[group]));
    const state = model < low ? `BELOW low end by ${((1 - model / low) * 100).toFixed(0)}%` : model > high ? "ABOVE high end" : "inside";
    cells += 1;
    if (state === "inside") inside += 1;
    console.log(`  ${publisher.padEnd(14)} ${route.padEnd(20)} ${String(miles).padStart(4)} mi  ${group.padEnd(10)} model $${model}  range $${low}-$${high}  ${state}`);
  }
}
console.log(`  inside: ${inside} of ${cells} cells\n`);

console.log("2) Size scaling at 1,250 miles: model vs sources (ratio to the smallest size)");
const modelRatios = HOME_SIZES.map(size => fullMove(1250, size) / fullMove(1250, HOME_SIZES[0]));
console.log(`  model, four size options: ${modelRatios.map(r => r.toFixed(2)).join(" : ")}`);
const matrix = { "Studio/1BR": 2481, "2BR": 3975, "3BR": 4783, "4+BR": 9487 };
const studio = matrix["Studio/1BR"];
console.log(`  four-source means, Studio : 2BR : 3BR : 4+BR = 1.00 : ${(matrix["2BR"] / studio).toFixed(2)} : ${(matrix["3BR"] / studio).toFixed(2)} : ${(matrix["4+BR"] / studio).toFixed(2)}`);
const mid = (low, high) => (low + high) / 2;
for (const { route, miles, publisher, ranges } of routeRanges) {
  const s = mid(...ranges["Studio/1BR"]);
  console.log(`  ${publisher} ${route} ${miles} mi range midpoints: 1.00 : ${(mid(...ranges["2-3BR"]) / s).toFixed(2)} (2-3BR) : ${(mid(...ranges["4+BR"]) / s).toFixed(2)} (4+BR)`);
}
console.log();

console.log("3) 4+BR central values: how much does one source move the mean?");
const fourPlus = { CMR: 9000, LDM: 16790, moveBuddha: 5950, TOH: 6207 };
const values = Object.values(fourPlus).sort((a, b) => a - b);
const mean = list => list.reduce((sum, v) => sum + v, 0) / list.length;
const median = list => { const s = [...list].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
console.log(`  all four: mean $${Math.round(mean(values))}, median $${Math.round(median(values))}`);
const withoutLdm = Object.entries(fourPlus).filter(([k]) => k !== "LDM").map(([, v]) => v);
console.log(`  without LDM (shipment-weight proxy, n undisclosed): mean $${Math.round(mean(withoutLdm))}`);
const holdoutMidpoints = routeRanges.map(({ ranges }) => mid(...ranges["4+BR"]));
console.log(`  route-range midpoints for 4+BR: ${holdoutMidpoints.map(Math.round).join(", ")}`);
console.log(`  the four-source mean is ${((mean(values) / Math.max(...holdoutMidpoints) - 1) * 100).toFixed(0)}% above the highest of those midpoints`);
