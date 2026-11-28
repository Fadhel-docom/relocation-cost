import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("the hidden attribute wins over utility display classes", () => {
  assert.match(read("../styles/global.css"), /\[hidden\]:not\(\[hidden="until-found"\]\)\s*\{\s*display:\s*none\s*!important/);
});

test("an invalid input also clears the printable summary", () => {
  const script = read("../scripts/calculator.js");
  const body = script.slice(script.indexOf("const clearResults"), script.indexOf("compareCards, ...sizeCompareCards].forEach", script.indexOf("const clearResults")));
  for (const id of ["printTotal", "printRange", "printDistance", "printEmployerRow", "printCashRow"]) assert.ok(body.includes(`"${id}"`), id);
});
