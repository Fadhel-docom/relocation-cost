import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  CHECKED_ON,
  CONTACTS,
  DESCRIPTION,
  NOT_STATED,
  QUESTIONS,
  RULE_GROUPS,
  SOURCES,
  TITLE,
  sourceNumber,
} from "./mover-checks.js";

const knownIds = new Set(SOURCES.map(source => source.id));
const allRules = RULE_GROUPS.flatMap(group => group.rules);
const iso = /^\d{4}-\d{2}-\d{2}$/;
const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));

test("every source has an id, label, official host and a real date", () => {
  assert.equal(knownIds.size, SOURCES.length);
  for (const source of SOURCES) {
    assert.ok(source.label.length > 10, source.id);
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.ok(["www.fmcsa.dot.gov", "consumer.ftc.gov"].includes(url.hostname), source.url);
    assert.match(source.verified, iso, source.id);
    if (source.pageUpdated) assert.match(source.pageUpdated, iso, source.id);
  }
  assert.match(CHECKED_ON, iso);
});

test("the guide's sources match the check data one to one, all read by hand", () => {
  const ids = Object.entries(data.sources).filter(([, config]) => config.scope === "scam-guide").map(([id]) => id);
  assert.deepEqual(ids.sort(), [...knownIds].sort());
  for (const id of ids) {
    assert.equal(data.sources[id].monitor, "manual", id);
    assert.equal(data.sources[id].url, SOURCES.find(source => source.id === id).url, id);
  }
});

test("every rule cites at least one listed source, and every source is used", () => {
  assert.ok(allRules.length >= 10);
  for (const rule of allRules) {
    assert.ok(rule.sources.length > 0, rule.text);
    for (const id of rule.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
  const used = new Set([...allRules, ...CONTACTS].flatMap(item => item.sources));
  for (const id of knownIds) assert.ok(used.has(id), `${id} is never cited`);
});

test("figures in the rules stay within what the pages state: 30 days, 50 miles, 100 and 110 percent", () => {
  const text = allRules.map(rule => rule.text).join(" ");
  const numbers = new Set(text.match(/\d+/g) ?? []);
  assert.deepEqual([...numbers].sort(), ["100", "110", "30", "50"]);
  assert.doesNotMatch(text, /\$/);
});

test("the guide makes no promises, no legal advice and no accusations of named companies", () => {
  const text = [...allRules.map(rule => rule.text), ...QUESTIONS, ...NOT_STATED].join(" ");
  assert.doesNotMatch(text, /\bguarantee[sd]? (that )?you\b|you will (never|get)|legal advice|always pay|will (be )?refund/i);
});

test("groups are complete and in a sensible order", () => {
  assert.deepEqual(RULE_GROUPS.map(group => group.id), ["check", "signs", "writing", "price", "report"]);
  for (const group of RULE_GROUPS) assert.ok(group.title && group.rules.length > 0, group.id);
  assert.ok(QUESTIONS.length >= 6);
  assert.ok(NOT_STATED.length >= 3);
});

test("contacts use https or tel links and cite a listed source", () => {
  assert.ok(CONTACTS.length >= 5);
  for (const contact of CONTACTS) {
    assert.match(contact.url, /^(https:\/\/|tel:\+1\d{10}$)/, contact.url);
    assert.ok(contact.label && contact.text, contact.url);
    for (const id of contact.sources) assert.ok(knownIds.has(id), `unknown source ${id}`);
  }
  assert.ok(CONTACTS.some(contact => contact.text === "1-888-368-7238" && contact.url === "tel:+18883687238"), "hotline matches the tel link");
});

test("title and description fit a search result", () => {
  assert.ok(TITLE.length <= 70, `${TITLE.length}`);
  assert.ok(DESCRIPTION.length <= 160, `${DESCRIPTION.length}`);
});

test("sourceNumber follows the order of the sources list", () => {
  assert.equal(sourceNumber(SOURCES[0].id), 1);
  assert.equal(sourceNumber(SOURCES.at(-1).id), SOURCES.length);
  assert.equal(sourceNumber("nope"), 0);
});
