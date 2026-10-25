import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatReviewDate, marginSummary, trustSources, SEASON_NOTE, FLOOR_NOTE } from "./trust.js";
import { DEFAULT_RANGE_LOW, DEFAULT_RANGE_HIGH } from "./calculator.js";

const data = JSON.parse(readFileSync(new URL("../../data/coefficients.json", import.meta.url), "utf8"));

test("formatReviewDate formats valid ISO dates", () => {
  assert.equal(formatReviewDate("2026-10-03"), "October 3, 2026");
  assert.equal(formatReviewDate("2025-09-10"), "September 10, 2025");
});

test("formatReviewDate rejects anything that is not a real ISO date", () => {
  assert.equal(formatReviewDate(""), "");
  assert.equal(formatReviewDate(undefined), "");
  assert.equal(formatReviewDate("2026-02-31"), "");
  assert.equal(formatReviewDate("10/03/2026"), "");
});

test("marginSummary matches the calculator range constants", () => {
  const margin = marginSummary();
  assert.equal(margin.below, Math.round((1 - DEFAULT_RANGE_LOW) * 100));
  assert.equal(margin.above, Math.round((DEFAULT_RANGE_HIGH - 1) * 100));
  assert.equal(margin.label, "±20%");
  assert.equal(margin.contingency, 10);
});

test("the data file carries a valid review date and sourced benchmarks", () => {
  assert.notEqual(formatReviewDate(data.last_reviewed), "");
  for (const source of trustSources(data.sources)) {
    assert.ok(source.name, `${source.key} has a name`);
    assert.match(source.url, /^https:\/\//, `${source.key} has an https url`);
    assert.ok(source.role, `${source.key} has a role`);
  }
});

test("season note says the date is not used, limits its claim to moving companies, and names no price", () => {
  assert.match(SEASON_NOTE, /does not use your move date/);
  assert.match(SEASON_NOTE, /Moving companies may charge more/);
  assert.doesNotMatch(SEASON_NOTE, /truck rentals|[0-9$%]/i);
});

test("the calculator and methodology pages show the season note", () => {
  for (const page of ["../pages/calculator.astro", "../pages/methodology.astro"]) {
    const source = readFileSync(new URL(page, import.meta.url), "utf8");
    assert.match(source, /SEASON_NOTE/);
  }
});

test("floor note says home size does not change the base amount and names no number", () => {
  assert.match(FLOOR_NOTE, /Home size does not change this base amount/);
  assert.match(FLOOR_NOTE, /only changes the premium/);
  assert.doesNotMatch(FLOOR_NOTE, /[0-9$%]/);
});

test("the calculator page renders the floor note from the shared constant", () => {
  const source = readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
  assert.match(source, /id="floorNote"[^>]*>\{FLOOR_NOTE\}</);
});

test("the premium really does depend on home size, so the floor note stays true", async () => {
  const { calculateBudget, HOME_SIZES, MOVE_TYPES } = await import("./calculator.js");
  const [diy, labor] = MOVE_TYPES;
  const distance = 1317; // the benchmark floors the DIY base here
  const diyMoves = new Set(HOME_SIZES.map(size => Math.round(calculateBudget({ distance, size, type: diy }).move)));
  const laborMoves = new Set(HOME_SIZES.map(size => Math.round(calculateBudget({ distance, size, type: labor }).move)));
  assert.equal(diyMoves.size, 1);
  assert.equal(laborMoves.size, HOME_SIZES.length);
});


test("calculator explains that no email or account is needed and email remains user-controlled", () => {
  const calculator = readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
  const privacy = readFileSync(new URL("../pages/privacy.astro", import.meta.url), "utf8");
  assert.match(calculator, /No email address or account is needed to see your estimate/);
  assert.match(calculator, /opens your email app with a draft for you to review and send/);
  assert.match(privacy, /without entering an email address or creating an account/);
  assert.match(privacy, /the site does not send the email for you/);
});

test("overlooked-cost reminders cite official guidance and do not add new calculator fields", () => {
  const calculator = readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
  assert.match(calculator, /Pet travel and care/);
  assert.match(calculator, /Shipping a car/);
  assert.doesNotMatch(calculator, /Time away from work/);
  assert.match(calculator, /unitedvanlines\.com\/moving-tips\/blog\/how-to-move-with-pets/);
  assert.match(calculator, /unitedvanlines\.com\/moving-services\/car-shipping\/faq/);
  assert.match(calculator, /Field: Travel or Packing \/ extras/);
  assert.match(calculator, /Field: Packing \/ extras\./);
});
