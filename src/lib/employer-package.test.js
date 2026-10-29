import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CHECKED_ON, DESCRIPTION, FACTS, LEAD, NOT_STATED, QUESTIONS, SOURCES, TITLE, sourceNumber } from "./employer-package.js";
import { TAX_SOURCES } from "./trust.js";

const iso = /^\d{4}-\d{2}-\d{2}$/;
const knownIds = new Set(SOURCES.map(source => source.id));
const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));
const page = fs.readFileSync(new URL("../pages/guides/employer-relocation-package.astro", import.meta.url), "utf8");

test("the sources are the same two IRS pages as the calculator's tax note", () => {
  assert.deepEqual(SOURCES.map(source => [source.id, source.url]), TAX_SOURCES.map(source => [source.id, source.url]));
  for (const source of SOURCES) {
    assert.match(source.url, /^https:\/\/www\.irs\.gov\//);
    assert.equal(data.sources[source.id].scope, "tax-note");
    assert.equal(data.sources[source.id].monitor, "manual");
    assert.match(source.verified, iso);
  }
  assert.match(CHECKED_ON, iso);
  assert.equal(SOURCES.find(source => source.id === "irs-i3903").pageUpdated, null);
});

test("the unsupported IRS page-update date is not presented as verified", () => {
  const fact = FACTS.find(item => item.text.includes("Form 3903 instructions"));
  assert.ok(fact);
  assert.match(fact.text, /does not display a page-update date/i);
  assert.match(fact.text, /posted November 21, 2025/i);
  assert.equal(SOURCES.find(source => source.id === "irs-i3903").pageUpdated, null);
});

test("every fact cites a listed source and the numbering follows the list", () => {
  assert.ok(FACTS.length >= 4);
  for (const fact of FACTS) {
    assert.ok(fact.sources.length > 0);
    for (const id of fact.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
  assert.equal(sourceNumber("irs-p15b"), 1);
  assert.equal(sourceNumber("irs-i3903"), 2);
  assert.equal(sourceNumber("nope"), 0);
});

test("the facts keep to what the pages state: both exceptions and the tax year", () => {
  const text = FACTS.map(fact => fact.text).join(" ");
  assert.match(text, /permanently eliminated/);
  assert.match(text, /Armed Forces/);
  assert.match(text, /intelligence community/);
  assert.match(text, /Form W-2/);
  assert.match(text, /tax years after 2017/);
});

test("no amounts, rates, promises or advice phrased as an instruction to a taxpayer", () => {
  const text = [TITLE, DESCRIPTION, LEAD, ...FACTS.map(fact => fact.text), ...NOT_STATED, ...QUESTIONS].join(" ");
  assert.doesNotMatch(text, /\$|\bUSD\b|\bpercent\b|%|\bguarantee|\byou must\b|\byou should\b/i);
  assert.ok(TITLE.length <= 70 && DESCRIPTION.length <= 160, `${TITLE.length}/${DESCRIPTION.length}`);
  assert.ok(NOT_STATED.length >= 4 && QUESTIONS.length >= 5);
});

test("the page renders from the module, leads with the phrase the live check requires, and is linked", () => {
  for (const name of ["FACTS", "NOT_STATED", "QUESTIONS", "SOURCES"]) assert.match(page, new RegExp(`${name}\\.map`));
  assert.match(page, /\{LEAD\}/);
  for (const file of ["../components/GuideNext.astro", "../pages/calculator.astro", "../../tools/verify-seo.mjs"]) {
    assert.ok(fs.readFileSync(new URL(file, import.meta.url), "utf8").includes("/guides/employer-relocation-package/"), file);
  }
});
