import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// WCAG AA needs 4.5:1 for small text. sky-600 on white or slate-50 is only
// about 3.9-4.1:1, so small text on light backgrounds must use sky-700 (5.6:1+).
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});

test("no text-sky-600 (fails AA contrast on light backgrounds)", () => {
  const offenders = walk("src")
    .filter(f => /\.(astro|js|html)$/.test(f) && !f.endsWith("contrast.test.js"))
    .filter(f => fs.readFileSync(f, "utf8").includes("text-sky-600"));
  assert.deepEqual(offenders, []);
});
