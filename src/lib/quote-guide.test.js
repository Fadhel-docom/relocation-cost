import test from "node:test";
import assert from "node:assert/strict";
import {
  CHECKED_ON,
  COMPARISON,
  DESCRIPTION,
  QUESTIONS,
  RULE_GROUPS,
  SOURCES,
  TITLE,
  sourceNumber,
} from "./quote-guide.js";

const knownIds = new Set(SOURCES.map(source => source.id));
const allRules = RULE_GROUPS.flatMap(group => group.rules);
const iso = /^\d{4}-\d{2}-\d{2}$/;

test("every source has an id, label, official host and a real date", () => {
  assert.equal(knownIds.size, SOURCES.length);
  for (const source of SOURCES) {
    assert.ok(source.label.length > 10, source.id);
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.ok(["www.fmcsa.dot.gov", "www.law.cornell.edu"].includes(url.hostname), source.url);
    if (source.pageUpdated) assert.match(source.pageUpdated, iso, source.id);
  }
  assert.match(CHECKED_ON, iso);
});

test("every rule and comparison row cites at least one listed source", () => {
  assert.ok(allRules.length >= 10);
  for (const item of [...allRules, ...COMPARISON]) {
    assert.ok(item.sources.length > 0, item.text ?? item.label);
    for (const id of item.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
});

test("every listed source is used by at least one rule", () => {
  const used = new Set([...allRules, ...COMPARISON].flatMap(item => item.sources));
  for (const id of knownIds) assert.ok(used.has(id), `${id} is never cited`);
});

test("figures stay within what the sources state: 110 percent, 15 percent and 30 days", () => {
  const text = [...allRules.map(rule => rule.text), ...COMPARISON.flatMap(row => [row.binding, row.nonBinding])].join(" ");
  const numbers = new Set(text.match(/\d+/g) ?? []);
  assert.deepEqual([...numbers].sort(), ["110", "15", "30"]);
  assert.doesNotMatch(text, /\$/);
});

test("the guide makes no promises or legal advice", () => {
  const text = [...allRules.map(rule => rule.text), ...QUESTIONS].join(" ");
  assert.doesNotMatch(text, /\bguarantee[sd]? (that )?you\b|you will never|legal advice|always pay/i);
});

test("each group and comparison row is complete", () => {
  const titles = RULE_GROUPS.map(group => group.id);
  assert.deepEqual(titles, ["getting", "binding", "non-binding", "coverage"]);
  for (const row of COMPARISON) assert.ok(row.label && row.binding && row.nonBinding);
  assert.ok(QUESTIONS.length >= 6);
});

test("title and description fit a search result", () => {
  assert.ok(TITLE.length <= 70, `${TITLE.length}`);
  assert.ok(DESCRIPTION.length <= 160, `${DESCRIPTION.length}`);
  assert.match(DESCRIPTION, /110%/);
});

test("sourceNumber follows the order of the sources list", () => {
  assert.equal(sourceNumber(SOURCES[0].id), 1);
  assert.equal(sourceNumber(SOURCES.at(-1).id), SOURCES.length);
  assert.equal(sourceNumber("nope"), 0);
});
