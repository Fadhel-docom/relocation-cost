import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { EMPLOYER_TAX_NOTE, TAX_SOURCES } from "./trust.js";

const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));
const page = fs.readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");

test("the tax note states no amount and no percentage", () => {
  const withoutNames = EMPLOYER_TAX_NOTE.replace(/Publication 15-B \(2026\)|Form 3903/g, "");
  assert.doesNotMatch(withoutNames, /[$%]|\d/);
});

test("the tax note names the exceptions its source states and points to a person for advice", () => {
  assert.match(EMPLOYER_TAX_NOTE, /Armed Forces/);
  assert.match(EMPLOYER_TAX_NOTE, /intelligence community/);
  assert.match(EMPLOYER_TAX_NOTE, /tax professional/);
});

test("each tax source is https, hand-checked, and listed in the weekly reminder data", () => {
  assert.equal(TAX_SOURCES.length, 2);
  for (const source of TAX_SOURCES) {
    assert.match(source.url, /^https:\/\/www\.irs\.gov\//);
    const config = data.sources[source.id];
    assert.equal(config.scope, "tax-note");
    assert.equal(config.monitor, "manual");
    assert.equal(config.url, source.url);
    assert.match(config.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("the calculator renders the note from the constant and still says it does not work out taxes", () => {
  assert.match(page, /\{EMPLOYER_TAX_NOTE\}/);
  assert.match(page, /This calculator does not work out taxes\./);
});
