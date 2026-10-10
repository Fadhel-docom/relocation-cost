import test from "node:test";
import assert from "node:assert/strict";
import { EVENTS, createFunnel } from "./calculator-analytics.js";

const setup = () => {
  const calls = [];
  const funnel = createFunnel((name, props) => calls.push([name, props]), () => ({ from: "CA", to: "TX" }));
  return { calls, funnel };
};

test("initial render and restored inputs send nothing", () => {
  const { calls, funnel } = setup();
  funnel.estimate(true);
  assert.deepEqual(calls, []);
});

test("usage fires once, estimate fires once after interaction", () => {
  const { calls, funnel } = setup();
  funnel.interaction();
  funnel.interaction();
  funnel.estimate(true);
  funnel.estimate(true);
  assert.deepEqual(calls, [
    [EVENTS.used, { from: "CA", to: "TX" }],
    [EVENTS.estimateShown, { from: "CA", to: "TX" }]
  ]);
});

test("an invalid estimate after interaction does not count, a later valid one does", () => {
  const { calls, funnel } = setup();
  funnel.interaction();
  funnel.estimate(false);
  assert.equal(calls.length, 1);
  funnel.estimate(true);
  assert.equal(calls[1][0], EVENTS.estimateShown);
});

test("share events distinguish clipboard success from fallback", () => {
  const { calls, funnel } = setup();
  funnel.share("clipboard");
  funnel.share("fallback");
  funnel.share("other");
  assert.deepEqual(calls.map(c => c[0]), [EVENTS.shareCopied, EVENTS.shareFallback]);
});

test("reset is tracked and starts a new funnel attempt", () => {
  const { calls, funnel } = setup();
  funnel.interaction();
  funnel.estimate(true);
  funnel.reset();
  funnel.interaction();
  funnel.estimate(true);
  assert.deepEqual(calls.map(c => c[0]), [
    EVENTS.used, EVENTS.estimateShown, EVENTS.reset, EVENTS.used, EVENTS.estimateShown
  ]);
});

test("a throwing tracker never breaks the calculator", () => {
  const funnel = createFunnel(() => { throw new Error("blocked"); });
  assert.doesNotThrow(() => {
    funnel.interaction();
    funnel.estimate(true);
    funnel.share("clipboard");
    funnel.reset();
  });
});
