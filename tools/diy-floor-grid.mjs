// Read-only measurement: how often the published U-Haul average sets the DIY base.
// Usage: node tools/diy-floor-grid.mjs   (changes nothing, prints a summary)
import { calculateBudget, HOME_SIZES, MOVE_TYPES, getUhaulBenchmark } from "../src/lib/calculator.js";

const [DIY, LABOR, FULL] = MOVE_TYPES;
const distances = [];
for (let d = 100; d <= 3000; d += 50) distances.push(d);

let floored = 0;
let cells = 0;
let allTie = 0;
const perSize = HOME_SIZES.map(() => 0);
const tieDistances = [];
for (const d of distances) {
  const moves = HOME_SIZES.map(size => calculateBudget({ distance: d, size, type: DIY }));
  moves.forEach((r, i) => {
    cells++;
    if (r.moveFloored) { floored++; perSize[i]++; }
  });
  if (new Set(moves.map(r => Math.round(r.move))).size === 1) { allTie++; tieDistances.push(d); }
}
console.log(`distances sampled: ${distances.length} (100..3000 step 50)`);
console.log(`DIY cells where the floor sets the base: ${floored}/${cells} (${Math.round(100 * floored / cells)}%)`);
console.log(`floored share per home size ${JSON.stringify(HOME_SIZES)}: ${perSize.map(n => Math.round(100 * n / distances.length) + "%").join(" ")}`);
console.log(`distances where all 4 home sizes give the same DIY move cost: ${allTie}/${distances.length} (first ${tieDistances[0]}, last ${tieDistances.at(-1)})`);

let orderViolations = 0;
for (const d of distances) for (const size of HOME_SIZES) {
  const [a, b, c] = [DIY, LABOR, FULL].map(type => calculateBudget({ distance: d, size, type }).total);
  if (!(a <= b && b <= c)) orderViolations++;
}
console.log(`move-type ordering violations (DIY <= labor <= full): ${orderViolations}`);

let monotonicViolations = 0;
for (const size of HOME_SIZES) for (const type of MOVE_TYPES) {
  let previous = -1;
  for (let d = 50; d <= 3200; d++) {
    const move = calculateBudget({ distance: d, size, type }).move;
    if (move + 1e-9 < previous) monotonicViolations++;
    previous = move;
  }
}
console.log(`distance monotonicity violations (1-mile steps, 50..3200): ${monotonicViolations}`);

const jumps = [];
let last = null;
for (let d = 1; d <= 3200; d++) {
  const move = calculateBudget({ distance: d, size: HOME_SIZES[0], type: DIY }).move;
  if (last !== null && move - last > 40) jumps.push(`${d - 1}->${d} mi: +$${Math.round(move - last)}`);
  last = move;
}
console.log(`DIY (smallest size) jumps over $40 between adjacent miles: ${jumps.join("; ") || "none"}`);
console.log(`example 1317 mi: moves ${HOME_SIZES.map(size => Math.round(calculateBudget({ distance: 1317, size, type: DIY }).move)).join(", ")}; U-Haul band average ${getUhaulBenchmark(1317)}`);
