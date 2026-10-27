import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../pages/calculator.astro", import.meta.url), "utf8");

test("the fixed mobile estimate bar leaves room below the footer", () => {
  assert.match(page, /fixed inset-x-0 bottom-0[^"]*lg:hidden/, "the bar is fixed and mobile-only");
  assert.match(page, /@media screen and \(max-width: 1023px\)\s*\{\s*body\s*\{\s*padding-bottom:\s*5rem/, "body gets bottom padding at the same breakpoint");
});
