// Calculator funnel events. Pure logic with an injected `track` function so it
// can be tested without a browser. Properties never include money amounts or
// free-text input; only the state codes and a share method.
export const EVENTS = Object.freeze({
  used: "calculator_used",
  estimateShown: "calculator_estimate_shown",
  shareCopied: "share_link_copied",
  shareFallback: "share_link_fallback_shown",
  reset: "calculator_reset"
});

export function createFunnel(track, getRoute = () => ({})) {
  let used = false;
  let estimateSent = false;
  let interacted = false;

  const safe = (name, props) => {
    try { track(name, props); } catch {}
  };

  return {
    // First real user interaction with the form (not the initial render).
    interaction() {
      interacted = true;
      if (used) return;
      used = true;
      safe(EVENTS.used, getRoute());
    },
    // First valid estimate shown after the user interacted. The initial render
    // and restored inputs do not count.
    estimate(isValid) {
      if (!interacted || estimateSent || !isValid) return;
      estimateSent = true;
      safe(EVENTS.estimateShown, getRoute());
    },
    share(method) {
      if (method === "clipboard") safe(EVENTS.shareCopied);
      else if (method === "fallback") safe(EVENTS.shareFallback);
    },
    reset() {
      safe(EVENTS.reset);
      // A reset starts a new attempt, so the funnel can fire again.
      used = false;
      estimateSent = false;
      interacted = false;
    }
  };
}
