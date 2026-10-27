import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CHECKED_ON, DESCRIPTION, MAIL_FACTS, NOT_STATED, SOURCES, STEPS, TIPS, TITLE, sourceNumber } from "./address-change.js";

const iso = /^\d{4}-\d{2}-\d{2}$/;
const knownIds = new Set(SOURCES.map(source => source.id));
const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));
const page = fs.readFileSync(new URL("../pages/guides/address-change.astro", import.meta.url), "utf8");

test("both sources are official https pages with a real verification date", () => {
  assert.equal(SOURCES.length, 2);
  for (const source of SOURCES) {
    assert.equal(new URL(source.url).protocol, "https:");
    assert.match(source.url, /^https:\/\/(www\.usa\.gov|faq\.usps\.com)\//);
    assert.match(source.verified, iso);
  }
  assert.match(CHECKED_ON, iso);
  assert.equal(SOURCES.find(source => source.id === "usagov-moving").pageUpdated, "2026-04-15");
});

test("the check data lists exactly these sources, read by hand", () => {
  const ids = Object.entries(data.sources).filter(([, config]) => config.scope === "address-guide").map(([id]) => id);
  assert.deepEqual(ids.sort(), [...knownIds].sort());
  for (const id of ids) {
    assert.equal(data.sources[id].monitor, "manual", id);
    assert.equal(data.sources[id].url, SOURCES.find(source => source.id === id).url, id);
  }
});

test("the list has the seven offices the USAGov page names, in its order", () => {
  assert.deepEqual(STEPS.map(step => step.who.split(" (")[0]), [
    "U.S. Postal Service",
    "Internal Revenue Service",
    "Social Security",
    "Veterans benefits",
    "Immigration",
    "Driver's license and vehicle registration",
    "Voter registration",
  ]);
});

test("every step and fact cites a listed source", () => {
  for (const item of [...STEPS, ...MAIL_FACTS]) {
    assert.ok(item.sources.length > 0);
    for (const id of item.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
  assert.equal(sourceNumber("usagov-moving"), 1);
  assert.equal(sourceNumber("usps-coa"), 2);
  assert.equal(sourceNumber("nope"), 0);
  assert.ok(STEPS.every(step => step.sources.includes("usagov-moving")));
});

test("the only figures are the ones the USPS page states", () => {
  const text = MAIL_FACTS.map(fact => fact.text).join(" ");
  assert.deepEqual([...new Set(text.match(/\d+/g))].sort(), ["12", "30", "3575", "364", "60", "90"]);
  assert.match(text, /two weeks/);
});

test("no money figures, deadlines of our own, promises or legal advice in the content", () => {
  const text = [TITLE, DESCRIPTION, ...STEPS.map(step => step.what), ...MAIL_FACTS.map(fact => fact.text), ...NOT_STATED, ...TIPS].join(" ");
  assert.doesNotMatch(text, /\$|\bUSD\b|\bguarantee|\byou must\b/i);
  assert.ok(TITLE.length <= 70 && DESCRIPTION.length <= 160);
  assert.ok(NOT_STATED.length >= 4 && TIPS.length >= 3);
});

test("the page renders from the module and is linked from the footer and the guide list", () => {
  for (const name of ["STEPS", "MAIL_FACTS", "NOT_STATED", "TIPS", "SOURCES"]) assert.match(page, new RegExp(`${name}\\.map`));
  for (const file of ["../layouts/Layout.astro", "../components/GuideNext.astro", "../pages/calculator.astro"]) {
    assert.ok(fs.readFileSync(new URL(file, import.meta.url), "utf8").includes("/guides/address-change/"), file);
  }
});
