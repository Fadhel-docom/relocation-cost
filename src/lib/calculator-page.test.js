import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");
const script = readFileSync(new URL("../scripts/calculator.js", import.meta.url), "utf8");

const optionalSectionIds = [
  "other-costs-details",
  "itemized-costs-details",
  "employer-package-details",
  "cash-buffer-details",
];

test("optional calculator sections start collapsed and remain keyboard-discoverable", () => {
  for (const id of optionalSectionIds) {
    const matches = page.match(new RegExp(`<details id="${id}"[^>]*>`, "g")) ?? [];
    assert.equal(matches.length, 1, `expected one details section for ${id}`);
    assert.doesNotMatch(matches[0], /\sopen(?:\s|>|=)/, `${id} should start collapsed`);
    const start = page.indexOf(matches[0]);
    const end = page.indexOf("</details>", start);
    assert.ok(end > start, `${id} should close correctly`);
    assert.match(page.slice(start, end), /<summary[^>]*>/, `${id} needs a summary control`);
  }
});

test("saved or shared optional values reveal the relevant section", () => {
  assert.match(script, /const revealOptionalDetails = \(\) =>/);
  assert.match(script, /hasSavedOrSharedValue/);
  assert.match(script, /if \(hasSavedOrSharedValue\) section\.open = true/);
  assert.match(script, /revealOptionalDetails\(\);/);
  assert.match(script, /location\.hash === "#employer-package"/);
});

test("reset closes optional sections without changing calculator values or formulas", () => {
  assert.match(script, /const closeOptionalDetails = \(\) =>/);
  assert.match(script, /if \(section\) section\.open = false/);
  assert.match(script, /closeOptionalDetails\(\);/);
});
