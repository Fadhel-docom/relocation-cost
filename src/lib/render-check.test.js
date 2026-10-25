import test from "node:test";
import assert from "node:assert/strict";
import { seriousViolations, judgePage, summarize } from "./render-check.js";

test("only serious and critical accessibility violations are kept", () => {
  const out = seriousViolations([
    { id: "a", impact: "minor", nodes: [{}], help: "x" },
    { id: "b", impact: "moderate", nodes: [{}], help: "x" },
    { id: "color-contrast", impact: "serious", nodes: [{}, {}], help: "contrast" },
    { id: "label", impact: "critical", nodes: [{}], help: "label" },
  ]);
  assert.deepEqual(out.map((v) => v.id), ["color-contrast", "label"]);
  assert.equal(out[0].nodes, 2);
});

test("a clean page has no problems", () => {
  assert.deepEqual(judgePage({ status: 200, h1Count: 1, scrollWidth: 375, innerWidth: 375, violations: [] }), []);
});

test("one pixel of rounding is not horizontal scroll, ten pixels is", () => {
  const base = { status: 200, h1Count: 1, innerWidth: 375, violations: [] };
  assert.equal(judgePage({ ...base, scrollWidth: 376 }).length, 0);
  assert.equal(judgePage({ ...base, scrollWidth: 385 }).length, 1);
});

test("errors, missing headings and violations are all reported", () => {
  const p = judgePage({ status: 404, h1Count: 0, scrollWidth: 375, innerWidth: 375, violations: [{ id: "label", impact: "critical", nodes: 1 }] });
  assert.equal(p.length, 3);
  assert.match(p.join("|"), /HTTP 404/);
  assert.match(p.join("|"), /accessibility critical: label \(1 element\)/);
});

test("summary is ok only when every view is clean", () => {
  assert.equal(summarize([{ path: "/", viewport: "375", scheme: "light", problems: [] }]).status, "ok");
  const s = summarize([
    { path: "/", viewport: "375", scheme: "light", problems: [] },
    { path: "/x/", viewport: "1280", scheme: "dark", problems: ["HTTP 404"] },
  ]);
  assert.equal(s.status, "problem");
  assert.equal(s.problemCount, 1);
  assert.match(s.text, /\/x\/ \(1280, dark\): HTTP 404/);
});
