# Decision for issue #100: a separate relocation-package calculator?

**Date:** 2026-10-28 (Claude). **Decision: DEFER. Do not build a new calculator or page now.**
Reviewed against `docs/value-before-publishing.md` (v1.0).

## 1. Does the site already solve this task? (gate item 1)
Yes, for the exact task in the issue ("compare an employer's allowance with likely move expenses and see what stays uncovered"):
- `/calculator/` has an optional "Employer relocation package" box: lump sum paid to the user + costs the employer pays directly. It shows "Covered by your employer", "Gap you would pay" (with range), the gap including the cash buffer, and a line in the printed summary.
- The same box carries a tax note (IRS Pub 15-B 2026, Form 3903 instructions 2025) and links to `/guides/employer-relocation-package/` (what the IRS says, what to ask the employer).
- The estimate side is already itemized (travel, temporary housing, deposits, fuel, insurance, packing, equipment, utilities, storage, tips, specialty items, access fees).
A second calculator would duplicate this and split the same audience across two pages.

## 2. Evidence of demand (our own data, read 2026-10-28 from Google Search Console, 2026-10-01 to 2026-10-27)
- 0 clicks on every query. The numbers are tiny and are not proof of demand.
- "relocation package calculator": 13 impressions, average position 49.3. "relocation allowance calculator": 2 (pos. 54.5). "relocation assistance calculator": 1. "relocation lump sum calculator": 1. "relocation pay calculator": 1.
- Broader "calculate relocation costs" variants: about 3 to 7 impressions each, positions 57 to 71.
- These queries land on the homepage (68 impressions, position about 57), not on `/calculator/` or the employer guide.
- Finding: neither the homepage title/description nor the calculator title/description mentions an employer package, although the feature exists.

## 3. Competitor feature gaps (gate items 2 and 4)
The four pages listed in the issue were **not read by Claude**: they are outside this session's fetch allowlist. Their descriptions are ChatGPT's observations and stay unconfirmed. So **no competitor gap is proven**, and none is claimed. (The moveBuddha press-release facts in `COMPETITOR-TRAFFIC-PAGES.md` are the only competitor facts Claude has verified, and they say nothing about package features.)

## 4. Why not build now
- No demonstrated unmet need: the exact task is already served, and visibility, not features, is the visible problem.
- Any new feature that touches tax treatment needs the same primary IRS sources already used; a gross-up calculator is excluded on purpose (no tax calculation, no invented rates).
- Value-before-publishing rule 16: if the added value over alternatives cannot be shown with evidence, do not publish.

## 5. What would change the decision (acceptance tests for a later "build")
Build only if at least one is true, with the evidence logged:
1. GSC shows clicks or sustained impressions growth on "relocation package/allowance/lump sum" queries after the visibility change below, and a person can show that users need something the box lacks (for example per-category coverage: "movers covered, temporary housing not").
2. Two or more competitor pages are actually read (date, URL) and show a feature we lack that serves a documented task.
3. Anonymous on-site events show the employer box is used and then abandoned at a specific field (the existing calculator events can show use; abandonment is not measured today).
Any build must: label inputs and assumptions, reuse `calculateBudget` and `src/lib/employer-package.js`, add no tax math without a primary source, and ship with tests and a measurement plan.

## 6. Cheaper, evidence-backed next step (separate PR, not done here)
Make the existing feature findable: mention the employer-package gap in the `/calculator/` description and in a visible line on the homepage, without changing any formula. Measure by comparing the same GSC query set 7 and 14 days after deployment (data lags 2 to 3 days). Success is not guaranteed; the baseline is 0 clicks.

## Not done / limits
- No competitor page opened by Claude; no traffic claims about competitors.
- GSC read only; no URL or sitemap submitted.
- No code, formula or page changed in this PR.
