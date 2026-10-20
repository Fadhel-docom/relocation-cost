// "Was this estimate useful?" answer. Pure logic with an injected `track`
// function so it can be tested without a browser. The event carries the answer
// only: no money amounts, no route, no free text.
export const FEEDBACK_EVENT = "estimate_feedback";
export const FEEDBACK_ANSWERS = Object.freeze(["yes", "no"]);

export function createFeedback(track) {
  let interacted = false;
  let ready = false;
  let answered = false;

  return {
    // Same rule as the funnel: only a real interaction followed by a valid
    // estimate makes the question appear. The initial render and restored
    // inputs do not.
    interaction() {
      interacted = true;
    },
    estimate(isValid) {
      if (interacted && isValid) ready = true;
    },
    // True while the question should be shown and still unanswered.
    canAsk() {
      return ready && !answered;
    },
    // One answer per attempt. Returns what happened so the page can say it.
    vote(answer) {
      if (!FEEDBACK_ANSWERS.includes(answer)) return "invalid";
      if (!ready) return "not-ready";
      if (answered) return "already";
      answered = true;
      try { track(FEEDBACK_EVENT, { answer }); } catch {}
      return "sent";
    },
    // A reset starts a new attempt, so the question can come back.
    reset() {
      interacted = false;
      ready = false;
      answered = false;
    }
  };
}
