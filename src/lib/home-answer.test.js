import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  HOME_ANSWER_HEADING, HOME_ANSWER_LEAD, HOME_ANSWER_MOVE, HOME_ANSWER_AROUND, HOME_ANSWER_LIMITS, HOME_ANSWER_LINKS,
} from "./home-answer.js";
import { calculateBudget, getUhaulBenchmark, HOME_SIZES, MOVE_TYPES, DEFAULT_CONTINGENCY_RATE } from "./calculator.js";
import { SEASON_NOTE } from "./trust.js";
import { LIVE_PAGES } from "./live-check.js";

const read = file => readFileSync(new URL(file, import.meta.url), "utf8");
const home = read("../pages/index.astro");
const calculator = read("../pages/calculator.astro");
const ALL = [HOME_ANSWER_HEADING, HOME_ANSWER_LEAD, HOME_ANSWER_MOVE, HOME_ANSWER_AROUND, HOME_ANSWER_LIMITS, HOME_ANSWER_LINKS.calculator.label, HOME_ANSWER_LINKS.employer.label];

test("the home answer types no number, price, percentage or period", () => {
  for (const text of ALL) assert.doesNotMatch(text, /[$%]|\d/, text);
});

test("the home answer makes no promise or superlative", () => {
  for (const text of ALL) assert.doesNotMatch(text, /\b(free|accurate|best|cheapest|guarantee\w*|save|saving\w*)\b/i, text);
});

test("the three parts it names are the ones the calculator has", () => {
  assert.match(HOME_ANSWER_LEAD, /the move itself/);
  assert.match(HOME_ANSWER_LEAD, /the costs around the move/);
  assert.match(HOME_ANSWER_LEAD, /planning buffer/);
});

test("the move cost is never set below the published truck-rental average, for every size, type and distance band", () => {
  for (const distance of [1, 40, 120, 300, 700, 1317, 2500, 3500, 6000]) {
    for (const size of HOME_SIZES) {
      for (const type of MOVE_TYPES) {
        const result = calculateBudget({ distance, size, type });
        assert.ok(result.move >= getUhaulBenchmark(distance), `${distance} mi, size ${size}, type ${type}`);
      }
    }
  }
});

test("each cost the answer lists has its own field in the calculator, entered by the person", () => {
  for (const label of ["Travel", "Temporary housing", "Deposits / setup", "Packing materials", "Moving insurance", "Storage"]) {
    assert.ok(calculator.includes(`>${label} `), label);
  }
  const empty = calculateBudget({ distance: 500, size: 1, type: 1 });
  assert.equal(empty.other, 0, "costs around the move start at zero until the person enters them");
  const filled = calculateBudget({ distance: 500, size: 1, type: 1, travel: 100, housing: 200, setup: 300, packing: 50, insurance: 40, storage: 60 });
  assert.equal(filled.other, 750);
  assert.ok(DEFAULT_CONTINGENCY_RATE > 0);
  assert.ok(Math.abs(filled.contingency - (filled.move + filled.other) * DEFAULT_CONTINGENCY_RATE) < 1e-9);
});

test("each limit the answer states is stated by the calculator or an existing note", () => {
  assert.ok(calculator.includes("approximate straight line between the centers of the two states"));
  assert.ok(calculator.includes("type them in below to replace it") || calculator.includes("actual driving miles"));
  assert.match(SEASON_NOTE, /does not use your move date/);
  assert.ok(home.includes("The calculator does not calculate taxes."));
  assert.match(HOME_ANSWER_LIMITS, /not a quote/);
  assert.match(HOME_ANSWER_LIMITS, /does not use your move date/);
  assert.match(HOME_ANSWER_LIMITS, /does not calculate taxes/);
  assert.match(HOME_ANSWER_LIMITS, /straight-line distance between the centers of two states/);
});

test("the home page renders every constant and the employer link has its anchor", () => {
  for (const name of ["HOME_ANSWER_HEADING", "HOME_ANSWER_LEAD", "HOME_ANSWER_MOVE", "HOME_ANSWER_AROUND", "HOME_ANSWER_LIMITS", "HOME_ANSWER_LINKS"]) {
    assert.ok(home.includes(`{${name}`), name);
  }
  assert.equal(HOME_ANSWER_LINKS.calculator.href, "/calculator/");
  assert.equal(HOME_ANSWER_LINKS.employer.href, "/calculator/#employer-package");
  assert.ok(calculator.includes('id="employer-package"'));
});

test("the old heading is replaced and the page still has its main heading", () => {
  assert.ok(!home.includes("Start with the costs you can control."));
  assert.ok(home.includes("<h1"));
});

test("the post-deploy check looks for the lead sentence on the home page", () => {
  assert.deepEqual(LIVE_PAGES.find(page => page.path === "/").texts, [HOME_ANSWER_LEAD]);
});
