import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SOURCE, TIPS, TRUCKS, formatCubicFeet, stepUp, volumePatterns } from "./truck-sizes.js";
import { missingPatterns } from "./source-freshness.js";

const checks = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));

test("trucks are listed smallest to largest with distinct, positive whole volumes", () => {
  assert.ok(TRUCKS.length >= 5);
  for (let i = 0; i < TRUCKS.length; i++) {
    assert.ok(Number.isInteger(TRUCKS[i].cubicFeet) && TRUCKS[i].cubicFeet > 0, TRUCKS[i].name);
    assert.ok(TRUCKS[i].homeSize.length > 3);
    if (i) assert.ok(TRUCKS[i].cubicFeet > TRUCKS[i - 1].cubicFeet, `${TRUCKS[i].name} must be larger than the one before`);
  }
});

test("formatCubicFeet and stepUp", () => {
  assert.equal(formatCubicFeet(1016), "1,016 cu. ft.");
  assert.equal(formatCubicFeet(76), "76 cu. ft.");
  assert.equal(stepUp(2), Math.round((402 / 246 - 1) * 100));
  assert.throws(() => stepUp(0), RangeError);
  assert.throws(() => stepUp(TRUCKS.length), RangeError);
  assert.throws(() => stepUp(1.5), RangeError);
});

test("the source check watches exactly these volumes", () => {
  const entry = checks.sources[SOURCE.id];
  assert.ok(entry, "data/source-checks.json needs an entry for the truck source");
  assert.equal(entry.url, SOURCE.url);
  assert.equal(entry.scope, "truck-guide");
  assert.equal(entry.patternsFrom, "truck-volumes");
  const page = TRUCKS.map(truck => `${truck.name} ${formatCubicFeet(truck.cubicFeet)}`).join(" ");
  assert.deepEqual(missingPatterns(page, volumePatterns()), []);
  assert.deepEqual(missingPatterns(page.replace("1,016", "1,100"), volumePatterns()), ["1,?016\\s*cu"]);
});

test("the guide text carries no price, mileage or percentage claims", () => {
  for (const text of [...TIPS, ...TRUCKS.map(truck => truck.homeSize)]) assert.doesNotMatch(text, /\$|%|per mile/i, text);
});
