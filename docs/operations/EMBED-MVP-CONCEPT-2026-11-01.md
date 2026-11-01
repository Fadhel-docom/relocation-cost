# Embed MVP — Product concept and acceptance criteria
**Date:** 2026-11-01 | **Status:** concept only; not implemented.

## Job to be done
A publisher (HR/onboarding, university relocation resources, renter/moving education) wants to offer visitors a useful interstate moving-budget estimator without building or maintaining its own calculator. A visitor should complete a basic estimate on the publisher page and understand its limits.

## MVP shape
- Dedicated route: `/embed/calculator/` (separate from the full `/calculator/` experience).
- Responsive, compact flow: origin state, destination state, approximate distance with explicit straight-line disclosure, home size, move type, optional known extras, result range and cost breakdown.
- Clear identity and attribution: “Moving budget calculator by Relocation Cost” plus visible methodology link.
- Result is explicitly a planning estimate, not a mover quote, and does not imply employer reimbursement or tax eligibility.
- Optional query parameters for route prefill only; never accept or echo personal information.
- Host page can set a sensible iframe height; phase 1 may use a documented fixed responsive height with internal scroll, then add a narrowly scoped `postMessage` height contract only if publisher tests show need.

## Exclude from first MVP
- No account, lead form, email capture, address-level personal data, file uploads, or saved quote history.
- No provider marketplace, affiliate ranking, paid placement, or claim that the cheapest provider is best.
- No print/email controls in the embedded frame until sandbox and host behavior are validated.
- No custom theme builder or complex publisher dashboard.

## Technical / trust requirements
- Confirm live Vercel response headers before release; repository inspection alone cannot prove deployed CSP or X-Frame-Options behavior.
- Apply any `frame-ancestors` policy only to the embed route, with explicit allowed publisher origins; do not weaken framing protections site-wide.
- Keep the canonical/indexing decision separate from frame support; decide canonical or noindex after testing duplicate-content and discovery implications.
- Use sandbox-compatible behavior; test blocked storage, clipboard, navigation, third-party cookies and analytics.
- Include accessible labels, keyboard support, visible errors, 320/375px mobile and desktop checks, and a graceful fallback link to the full calculator.
- Privacy-minimal measurement: count embed loads, calculator starts, completed estimates and outbound methodology clicks; no route values or user-entered costs in analytics payloads.
- Attribute by publisher ID / signed allow-listed configuration or UTM referrer, not arbitrary untrusted text.

## Demand gate before building
Keep the previous gate: obtain at least two genuine publisher signals of interest before building the full embed route. Signals must be actual replies or explicit requests, not a prospect list or inferred interest. Until then, show a static mock / clickable prototype privately and test the value proposition.

## Success metrics for a pilot
- Publisher acceptance and placement (number of live embeds).
- Embed load → start → completion funnel.
- Share of completions reaching methodology or full calculator.
- Publisher page performance and mobile usability.
- Qualitative publisher/visitor feedback. No arbitrary traffic or revenue promise.

## Proposed phase 0 test
Create a one-page publisher demo spec and a screenshot/mockup (not production code), then ask for permission to show it to selected publishers. No outreach sent without owner approval.