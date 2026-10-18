import test from "node:test";
import assert from "node:assert/strict";
import { ALL_ITEM_IDS, PHASES, cleanChecked, dueDate, formatDate, progress } from "./checklist.js";

test("every item has a unique id, text and a phase", () => {
  assert.equal(new Set(ALL_ITEM_IDS).size, ALL_ITEM_IDS.length);
  for (const phase of PHASES) {
    assert.ok(phase.title && phase.id);
    assert.ok(phase.items.length > 0, phase.id);
    for (const item of phase.items) {
      assert.ok(item.id.startsWith(phase.id.slice(0, 1)) || item.id.startsWith(phase.id), item.id);
      assert.ok(item.text.length > 10, item.id);
    }
  }
});

test("phases run from earliest to latest", () => {
  const weeks = PHASES.map(phase => phase.weeksBefore);
  assert.deepEqual(weeks, [...weeks].sort((a, b) => b - a));
});

test("the checklist makes no price or legal-deadline claims", () => {
  for (const phase of PHASES) for (const item of phase.items) {
    assert.doesNotMatch(item.text, /\$\s?\d|\d\s?%|within \d+ days|by law/i, item.id);
  }
});

test("dueDate counts weeks back from the move date without time-zone drift", () => {
  assert.equal(dueDate("2026-12-01", 8), "2026-10-06");
  assert.equal(dueDate("2026-12-01", 1), "2026-11-24");
  assert.equal(dueDate("2026-12-01", 0), "2026-12-01");
  assert.equal(dueDate("2026-12-01", -2), "2026-12-15");
  assert.equal(dueDate("2027-03-01", 1), "2027-02-22");
  assert.equal(dueDate("2026-01-05", 3), "2025-12-15");
});

test("dueDate and formatDate reject anything that is not a real date", () => {
  for (const bad of ["", "2026-02-31", "12/01/2026", "abc", null, undefined]) {
    assert.equal(dueDate(bad, 1), "");
  }
  assert.equal(formatDate("2026-12-01"), "Dec 1, 2026");
  assert.equal(formatDate("nope"), "");
});

test("progress counts only known ids once each", () => {
  assert.deepEqual(progress([]), { done: 0, total: ALL_ITEM_IDS.length, percent: 0 });
  const some = progress([ALL_ITEM_IDS[0], ALL_ITEM_IDS[0], "made-up", 5, null]);
  assert.equal(some.done, 1);
  assert.equal(progress(ALL_ITEM_IDS).percent, 100);
  assert.deepEqual(progress("not an array"), { done: 0, total: ALL_ITEM_IDS.length, percent: 0 });
});

test("cleanChecked drops unknown and duplicate ids", () => {
  assert.deepEqual(cleanChecked([ALL_ITEM_IDS[1], ALL_ITEM_IDS[1], "x"]), [ALL_ITEM_IDS[1]]);
  assert.deepEqual(cleanChecked(undefined), []);
});
