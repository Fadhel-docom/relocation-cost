import test from "node:test";
import assert from "node:assert/strict";
import { clickrefFor, trackedHref } from "./partners.js";

test("clickrefFor builds a short safe slug from the page path", () => {
  assert.equal(clickrefFor("/calculator/"), "calculator");
  assert.equal(clickrefFor("/moving-cost/new-york-to-florida/"), "moving-cost-new-york-to-florida");
  assert.equal(clickrefFor("/"), "home");
  assert.ok(clickrefFor("/moving-cost/cities/san-francisco-to-washington-dc-long-route/").length <= 50);
});

test("trackedHref adds clickref to Awin links only", () => {
  const awin = "https://www.awin1.com/cread.php?awinmid=111&awinaffid=222";
  assert.match(trackedHref(awin, "/calculator/"), /clickref=calculator/);
  assert.equal(trackedHref("https://example.com/x", "/calculator/"), "https://example.com/x");
  assert.equal(trackedHref("", "/calculator/"), "");
});

test("trackedHref keeps an existing clickref", () => {
  const awin = "https://www.awin1.com/cread.php?awinmid=1&awinaffid=2&clickref=custom";
  assert.match(trackedHref(awin, "/calculator/"), /clickref=custom/);
});
