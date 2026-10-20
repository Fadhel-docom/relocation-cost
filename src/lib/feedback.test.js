import test from "node:test";
import assert from "node:assert/strict";
import { FEEDBACK_ANSWERS, FEEDBACK_EVENT, createFeedback } from "./feedback.js";

const setup = () => {
  const calls = [];
  const feedback = createFeedback((name, props) => calls.push([name, props]));
  return { calls, feedback };
};

const ready = feedback => {
  feedback.interaction();
  feedback.estimate(true);
};

test("the question is not offered on the initial render or for restored inputs", () => {
  const { feedback } = setup();
  feedback.estimate(true);
  assert.equal(feedback.canAsk(), false);
});

test("an invalid estimate after interaction does not open the question", () => {
  const { feedback } = setup();
  feedback.interaction();
  feedback.estimate(false);
  assert.equal(feedback.canAsk(), false);
  feedback.estimate(true);
  assert.equal(feedback.canAsk(), true);
});

test("a vote before the question is ready sends nothing", () => {
  const { calls, feedback } = setup();
  assert.equal(feedback.vote("yes"), "not-ready");
  assert.deepEqual(calls, []);
});

test("the event carries the answer only, and only the two known answers count", () => {
  assert.deepEqual([...FEEDBACK_ANSWERS], ["yes", "no"]);
  const { calls, feedback } = setup();
  ready(feedback);
  assert.equal(feedback.vote("maybe"), "invalid");
  assert.equal(feedback.vote(undefined), "invalid");
  assert.deepEqual(calls, []);
  assert.equal(feedback.vote("no"), "sent");
  assert.deepEqual(calls, [[FEEDBACK_EVENT, { answer: "no" }]]);
});

test("one answer per attempt; the question closes after it", () => {
  const { calls, feedback } = setup();
  ready(feedback);
  assert.equal(feedback.vote("yes"), "sent");
  assert.equal(feedback.vote("no"), "already");
  assert.equal(feedback.canAsk(), false);
  assert.equal(calls.length, 1);
});

test("a reset starts a new attempt: closed until the next interaction, then it can be answered again", () => {
  const { calls, feedback } = setup();
  ready(feedback);
  feedback.vote("yes");
  feedback.reset();
  feedback.estimate(true);
  assert.equal(feedback.canAsk(), false);
  ready(feedback);
  assert.equal(feedback.vote("no"), "sent");
  assert.deepEqual(calls.map(c => c[1].answer), ["yes", "no"]);
});

test("a throwing tracker never breaks the calculator", () => {
  const feedback = createFeedback(() => { throw new Error("blocked"); });
  ready(feedback);
  assert.doesNotThrow(() => feedback.vote("yes"));
  assert.equal(feedback.canAsk(), false);
});
