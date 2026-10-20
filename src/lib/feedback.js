// "Was this page helpful?" answer. Pure logic with an injected `track` function so
// it can be tested without a browser. The event carries only the page path and a
// yes/no answer: no free text, no money amounts, no personal data.
export const FEEDBACK_EVENT = "page_feedback";
export const ANSWERS = Object.freeze(["yes", "no"]);

// Keep only a plain path ("/guides/truck-size/"): no query string, no hash, no host.
export function cleanPath(path) {
  if (typeof path !== "string") return "/";
  const bare = path.split("#")[0].split("?")[0];
  if (!bare.startsWith("/")) return "/";
  return bare.slice(0, 120);
}

export function createFeedback(track, getPath = () => "/") {
  let answered = false;

  return {
    // One answer per page view. Returns the stored answer, or null if the call was ignored.
    vote(answer) {
      if (answered || !ANSWERS.includes(answer)) return null;
      answered = true;
      try {
        track(FEEDBACK_EVENT, { page: cleanPath(getPath()), answer });
      } catch {}
      return answer;
    },
    get answered() {
      return answered;
    }
  };
}
