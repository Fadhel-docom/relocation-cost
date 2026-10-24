import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatReviewDate, marginSummary, trustSources, SEASON_NOTE } from "./trust.js";
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

test("season note says the date is not used, names no percentage and no price", () => {
  assert.match(SEASON_NOTE, /does not use your move date/);
  assert.doesNotMatch(SEASON_NOTE, /[0-9$%]/);
});

test("the calculator and methodology pages show the season note", () => {
  for (const page of ["../pages/calculator.astro", "../pages/methodology.astro"]) {
    const source = readFileSync(new URL(page, import.meta.url), "utf8");
    assert.match(source, /SEASON_NOTE/);
  }
});
