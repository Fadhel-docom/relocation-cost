import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MOVE_OPTIONS, MOVE_TYPE_COUNT, WHO_DOES_WHAT, notInMoveCost } from "./inclusions.js";
import { ITEMIZED_KEYS, MOVE_TYPES, costLines } from "./calculator.js";

test("the options are exactly the calculator's move types, in order", () => {
  assert.deepEqual(MOVE_OPTIONS.map(option => option.type), [...MOVE_TYPES]);
  assert.equal(MOVE_OPTIONS.length, MOVE_TYPE_COUNT);
});

test("option labels match the move type menu on the calculator page", () => {
  const source = fs.readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
  const block = source.match(/<select id="type"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(block, "move type select not found");
  const menu = [...block[1].matchAll(/<option value="([\d.]+)">([^<]+)<\/option>/g)]
    .map(([, value, label]) => ({ type: Number(value), label }));
  assert.deepEqual(menu, MOVE_OPTIONS.map(({ type, label }) => ({ type, label })));
});

test("every task has one cell per move type", () => {
  assert.ok(WHO_DOES_WHAT.length >= 5);
  for (const row of WHO_DOES_WHAT) {
    assert.ok(row.task.length > 3);
    assert.equal(row.cells.length, MOVE_OPTIONS.length, row.task);
    for (const cell of row.cells) assert.ok(cell.length > 3, row.task);
  }
});

test("the table makes no price, percentage or number claims", () => {
  for (const row of WHO_DOES_WHAT) for (const cell of [row.task, ...row.cells]) {
    assert.doesNotMatch(cell, /\d|\$|%/, cell);
  }
});

test("cells that depend on the provider tell the reader to ask", () => {
  const coverage = WHO_DOES_WHAT.find(row => row.task.startsWith("Coverage"));
  assert.ok(coverage);
  for (const cell of coverage.cells) assert.match(cell, /ask/i);
});

test("the list of costs outside the move cost covers every optional calculator cost", () => {
  const labels = notInMoveCost();
  const all = costLines(Object.fromEntries(["travel", "housing", "setup", "extras", ...ITEMIZED_KEYS].map(key => [key, 1]))).map(line => line.label);
  assert.deepEqual(labels, all);
  assert.equal(labels.length, 4 + ITEMIZED_KEYS.length);
});
