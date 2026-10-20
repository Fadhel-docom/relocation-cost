import test from "node:test";
import assert from "node:assert/strict";
import { ANSWERS, FEEDBACK_EVENT, cleanPath, createFeedback } from "./feedback.js";

const setup = (path = "/guides/truck-size/") => {
  const calls = [];
  const feedback = createFeedback((name, props) => calls.push([name, props]), () => path);
  return { calls, feedback };
};

test("a yes or no answer sends one event with only the page and the answer", () => {
  const { calls, feedback } = setup();
  assert.equal(feedback.vote("yes"), "yes");
  assert.deepEqual(calls, [[FEEDBACK_EVENT, { page: "/guides/truck-size/", answer: "yes" }]]);
  assert.deepEqual(Object.keys(calls[0][1]).sort(), ["answer", "page"]);
});

test("only one answer is counted per page view", () => {
  const { calls, feedback } = setup();
  feedback.vote("no");
  assert.equal(feedback.vote("yes"), null);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1].answer, "no");
  assert.equal(feedback.answered, true);
});

test("anything other than yes or no is ignored and does not use up the answer", () => {
  const { calls, feedback } = setup();
  assert.equal(feedback.vote("maybe"), null);
  assert.equal(feedback.vote(undefined), null);
  assert.equal(feedback.vote("<script>"), null);
  assert.deepEqual(calls, []);
  assert.equal(feedback.answered, false);
  assert.equal(feedback.vote("yes"), "yes");
});

test("the page is a plain path: no query string, no hash, no host", () => {
  assert.equal(cleanPath("/calculator/?from=CA&to=TX#result"), "/calculator/");
  assert.equal(cleanPath("https://example.com/calculator/"), "/");
  assert.equal(cleanPath(undefined), "/");
  assert.equal(cleanPath("/" + "a".repeat(500)).length, 120);
});

test("the shared-link query of the calculator never reaches the event", () => {
  const { calls, feedback } = setup("/calculator/?s=abc123&t=full");
  feedback.vote("yes");
  assert.equal(calls[0][1].page, "/calculator/");
});

test("a throwing tracker never breaks the page", () => {
  const feedback = createFeedback(() => { throw new Error("blocked"); });
  assert.doesNotThrow(() => feedback.vote("yes"));
  assert.equal(feedback.answered, true);
});

test("the answers are exactly yes and no", () => {
  assert.deepEqual([...ANSWERS], ["yes", "no"]);
});
