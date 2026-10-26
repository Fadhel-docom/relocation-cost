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

import { formatMoney, parseMoney, expectedDisplay, compareDisplay, judgeInvalidState } from "./render-check.js";
import { calculateBudget } from "./calculator.js";

test("money is written like the calculator page and read back", () => {
  assert.equal(formatMoney(1234.56), "$1,235");
  assert.equal(parseMoney("$1,235"), 1235);
  assert.equal(parseMoney("—"), null);
  assert.equal(parseMoney(""), null);
  assert.equal(parseMoney(undefined), null);
});

test("expected display comes straight from the calculation", () => {
  const r = calculateBudget({ distance: 500, size: 1.35, type: 1, travel: 100, fuel: 50 });
  const d = expectedDisplay(r);
  assert.equal(d.result, formatMoney(r.total));
  assert.equal(d.mobileTotal, d.result);
  assert.match(d.range, /^\$[\d,]+–\$[\d,]+$/);
  assert.equal(parseMoney(d.other), 150);
});

test("a matching display has no problems, a stale one is named", () => {
  const d = expectedDisplay(calculateBudget({ distance: 500, size: 1, type: 1 }));
  assert.deepEqual(compareDisplay("typed values", { ...d }, d), []);
  const stale = compareDisplay("typed values", { ...d, result: "$1" }, d);
  assert.equal(stale.length, 1);
  assert.match(stale[0], /result shows "\$1"/);
});

test("invalid input must show an error and dashes, never an old estimate", () => {
  const dashes = { result: "—", mobileTotal: "—", move: "—", other: "—", contingency: "—", range: "—" };
  assert.deepEqual(judgeInvalidState("distance 0", { ...dashes, error: "Enter a distance from 1 to 30,000 miles." }), []);
  assert.equal(judgeInvalidState("distance 0", { ...dashes, error: "" }).length, 1);
  const stale = judgeInvalidState("distance 0", { ...dashes, result: "$4,000", error: "x" });
  assert.equal(stale.length, 1);
  assert.match(stale[0], /result still shows "\$4,000"/);
});

test("the summary counts scenarios as well as page views", () => {
  assert.match(summarize([{ path: "/calculator/ [typing]", viewport: "375", scheme: "light", problems: [] }]).text, /page views and calculator scenarios/);
});

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

test("every horizontally scrollable box on a page can be reached with the keyboard", () => {
  const files = [];
  const walk = (dir) => { for (const f of readdirSync(dir)) { const p = join(dir, f); statSync(p).isDirectory() ? walk(p) : p.endsWith(".astro") && files.push(p); } };
  walk(new URL("../pages", import.meta.url).pathname);
  const bad = [];
  for (const f of files) for (const line of readFileSync(f, "utf8").split("\n")) {
    if (/<div[^>]*overflow-x-auto/.test(line) && !/tabindex="0"/.test(line)) bad.push(f);
  }
  assert.deepEqual(bad, []);
});
