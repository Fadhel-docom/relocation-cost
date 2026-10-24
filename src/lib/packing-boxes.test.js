import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  BOX_TYPES,
  CHECKED_ON,
  DESCRIPTION,
  DISAGREEMENTS,
  NOT_STATED,
  RANGES,
  RULES,
  SOURCES,
  TIPS,
  TITLE,
  rangeLabel,
  sourceNumber,
} from "./packing-boxes.js";

const iso = /^\d{4}-\d{2}-\d{2}$/;
const knownIds = new Set(SOURCES.map(source => source.id));
const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));

test("the source has an id, label, https url and a real date", () => {
  assert.equal(SOURCES.length, 1);
  const [source] = SOURCES;
  assert.equal(new URL(source.url).protocol, "https:");
  assert.ok(source.label.length > 10);
  assert.match(source.verified, iso);
  assert.match(source.pageUpdated, iso);
  assert.match(CHECKED_ON, iso);
});

test("the source matches the check data, read by hand", () => {
  const ids = Object.entries(data.sources).filter(([, config]) => config.scope === "packing-guide").map(([id]) => id);
  assert.deepEqual(ids.sort(), [...knownIds].sort());
  for (const id of ids) {
    assert.equal(data.sources[id].monitor, "manual", id);
    assert.equal(data.sources[id].url, SOURCES.find(source => source.id === id).url, id);
  }
});

test("the ranges are the six rows the source states, in increasing order", () => {
  assert.deepEqual(RANGES.map(range => range.size), ["Studio", "1-bedroom", "2-bedroom", "3-bedroom", "4-bedroom", "5+ bedrooms"]);
  assert.deepEqual(RANGES.map(rangeLabel), ["10–20", "20–40", "40–60", "60–80", "80–120", "120+"]);
  for (let i = 0; i < RANGES.length; i++) {
    const range = RANGES[i];
    assert.ok(Number.isInteger(range.min) && range.min > 0);
    if (range.max !== null) assert.ok(range.max > range.min, range.size);
    if (i > 0) {
      assert.ok(range.min >= RANGES[i - 1].min, `${range.size} starts no lower than the row above`);
      assert.equal(range.min, RANGES[i - 1].max, `${range.size} starts where the row above ends`);
    }
  }
  assert.equal(RANGES.at(-1).max, null, "the last row is open ended");
});

test("every rule cites a listed source and the source is used", () => {
  assert.ok(RULES.length >= 5);
  for (const rule of RULES) {
    assert.ok(rule.sources.length > 0, rule.text);
    for (const id of rule.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
  assert.ok(RULES.some(rule => rule.sources.includes("redfin-boxes")));
  assert.equal(sourceNumber("redfin-boxes"), 1);
  assert.equal(sourceNumber("nope"), 0);
});

test("figures in the rules stay within what the source states: 10 to 15 extra boxes and about 10 percent", () => {
  const text = RULES.map(rule => rule.text).join(" ");
  const numbers = new Set(text.match(/\d+/g) ?? []);
  assert.deepEqual([...numbers].sort(), ["10", "15"]);
});

test("the disagreeing expert figures are shown and match the source", () => {
  const text = DISAGREEMENTS.join(" ");
  assert.match(text, /30 to 50/);
  assert.match(text, /75 or more/);
});

test("no money figures, promises or legal advice anywhere in the content", () => {
  const text = [TITLE, DESCRIPTION, ...RULES.map(rule => rule.text), ...DISAGREEMENTS, ...NOT_STATED, ...TIPS, ...BOX_TYPES.map(type => type.items)].join(" ");
  assert.doesNotMatch(text, /\$|\bUSD\b|\bcosts? about\b|\bguarantee|legal advice/i);
});

test("box types, tips and the not-stated list are complete", () => {
  assert.deepEqual(BOX_TYPES.map(type => type.name), ["Small", "Medium", "Large", "Specialty"]);
  for (const type of BOX_TYPES) assert.ok(type.items.length > 10, type.name);
  assert.ok(TIPS.length >= 3);
  assert.ok(NOT_STATED.length >= 3);
  assert.ok(TITLE.length <= 70 && DESCRIPTION.length <= 160);
});
