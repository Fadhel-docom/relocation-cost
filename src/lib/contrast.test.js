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

// ---- Theme palette (src/styles/global.css) ----
const css = fs.readFileSync("src/styles/global.css", "utf8");

const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const luminance = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Reads the custom properties declared in the first block that starts with `selector {`.
const tokensOf = selector => {
  const start = css.indexOf(selector + " {");
  assert.ok(start >= 0, `block not found: ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const tokens = {};
  for (const [, name, value] of body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) tokens[name] = value;
  return tokens;
};

const light = tokensOf(":root");
const dark = tokensOf(':root[data-theme="dark"]');
const darkAuto = tokensOf(":root:not([data-theme])");

// Normal-size text must reach 4.5:1 on every surface it can sit on.
const textOnSurfaces = [
  [["t900", "t700", "t600", "t500", "accent", "danger"], ["page", "surface", "panel", "inset", "sky-tint"]],
  [["amber-text"], ["amber-tint"]],
  [["sky-strong"], ["sky-tint"]],
  [["card-text", "card-soft", "card-muted", "card-accent"], ["card", "card-inset"]],
  [["inv-fg"], ["inv-bg", "inv-hover"]],
];

for (const [name, tokens] of [["light", light], ["dark", dark]]) {
  test(`${name} theme: every text and surface pair meets WCAG AA (4.5:1)`, () => {
    for (const [texts, surfaces] of textOnSurfaces) {
      for (const text of texts) for (const surface of surfaces) {
        assert.ok(tokens[text] && tokens[surface], `missing token ${text} or ${surface}`);
        const value = ratio(tokens[text], tokens[surface]);
        assert.ok(value >= 4.5, `${name}: ${text} ${tokens[text]} on ${surface} ${tokens[surface]} is ${value.toFixed(2)}:1`);
      }
    }
  });

  test(`${name} theme: chart colors and form field borders reach 3:1 on their surface`, () => {
    for (const key of Object.keys(tokens).filter(k => k.startsWith("chart-"))) {
      for (const surface of ["surface", "inset"]) {
        const value = ratio(tokens[key], tokens[surface]);
        assert.ok(value >= 3, `${name}: ${key} on ${surface} is ${value.toFixed(2)}:1`);
      }
    }
    for (const surface of ["surface", "page"]) {
      const border = ratio(tokens["field-border"], tokens[surface]);
      assert.ok(border >= 3, `${name}: form field border is only ${border.toFixed(2)}:1 on ${surface} (WCAG 1.4.11 needs 3:1)`);
    }
  });
}

test("dark theme avoids pure black and pure white (eye comfort)", () => {
  for (const key of ["page", "surface", "panel", "inset", "card", "card-inset", "t900", "t700", "card-text"]) {
    assert.notEqual(dark[key].toLowerCase(), "#000000", key);
    assert.notEqual(dark[key].toLowerCase(), "#ffffff", key);
  }
});

test("the automatic dark block matches the manual dark block", () => {
  assert.deepEqual(darkAuto, dark);
});

test("the print block resets every token, so printing never inherits the dark theme", () => {
  const start = css.indexOf("@media print {");
  assert.ok(start >= 0, "print block not found");
  const body = css.slice(css.indexOf("{", css.indexOf("{", start) + 1) + 1, css.indexOf("}", css.indexOf("{", start) + 1));
  const printTokens = new Set([...body.matchAll(/--([a-z0-9-]+):/g)].map(m => m[1]));
  const missing = Object.keys(dark).filter(key => !printTokens.has(key));
  assert.deepEqual(missing, []);
});

for (const [name, tokens] of [["light", light], ["dark", dark]]) {
  test(`${name} theme: text inside the dark result card reaches AAA (7:1) so it stays readable in sunlight`, () => {
    for (const text of ["card-text", "card-soft", "card-muted", "card-accent"]) {
      for (const surface of ["card", "card-inset"]) {
        const value = ratio(tokens[text], tokens[surface]);
        assert.ok(value >= 7, `${name}: ${text} on ${surface} is ${value.toFixed(2)}:1`);
      }
    }
  });
}
