# Employer-relocation query and source review — 2026-11-01
**Owner:** ChatGPT | **Status:** evidence review completed; documentation only. No production or tax copy changed.

## 1. Exact GSC query-to-page evidence

Read-only Search Console query+page report for the verified property `https://relocation-cost-psi.vercel.app/`, Web search, 2026-10-01 through 2026-10-29, final data.

| Query | Impressions | Avg. position | Landing page |
|---|---:|---:|---|
| relocation package calculator | 20 | 46.15 | `/` |
| relocation expenses calculator | 6 | 47.33 | `/` |
| relocation allowance calculator | 4 | 57.00 | `/` |
| relocation compensation calculator | 4 | 64.25 | `/` |
| relocation assistance calculator | 1 | 54.00 | `/` |
| relocation lump sum calculator | 1 | 66.00 | `/` |

The homepage is the actual reported landing page for these queries in this period. This confirms the opportunity is not merely an inference from separate query and page aggregates. Samples remain small and there were no clicks in the corresponding page aggregate; do not describe these as conversions or validated demand.

## 2. Current product capability verified in source

- Homepage already says job movers can compare estimated costs with an employer lump sum and costs paid directly, and links to the calculator and employer guide.
- Calculator has an optional “Employer relocation package” section with:
  - “Lump sum paid to you”
  - “Costs the employer pays directly (movers, housing)”
  - result rows “Covered by your employer” and “Gap you would pay”, plus a separate cash-buffer display when applicable.
- This confirms a genuine user-facing workflow, not just positioning. It does **not** prove that no competitor offers the same combination.

## 3. Direct competitor check for employer-relocation intent

Opened live search results/pages on 2026-11-01:

- **CARS Relocation — Relocation Package Calculator:** explicitly positions the calculator as a pre-decision estimate for the cost of relocating a potential candidate, with HR/employer-facing counseling, budgeting and cost forecasting. It is a relevant calculator competitor, but its stated use case is employer-side candidate costing, not the same employee-side “my moving budget vs cash/direct-paid employer coverage” comparison currently in our calculator. Source: https://www.corporateamerica.us/resources/relocation-package-calculator/
- **Move.org — What To Know About Your Employer-Paid Move:** explains employer-paid moves and describes lump sum, reimbursement and direct mover payment. It is an informational guide, not a verified interactive employee budget-gap calculator. Source: https://www.move.org/employer-paid-move/
- **USmove — Relocation Assistance and Employer Packages (updated 2026-10-13):** discusses common package components, lump sums and managed relocation. It is an informational guide; the returned page content did not establish an employee-side calculator matching our tool. Source: https://usmove.org/resources/moving-guides/relocation-assistance-and-employer-packages/
- **USmove — Relocating for a Job: What to Negotiate:** covers lump sum, direct payment/reimbursement, temporary housing and other negotiation items. Source: https://usmove.org/resources/city-relocation-guides/relocating-for-a-job-what-to-negotiate/
- **Nelson Westerberg — Relocating for a Job: What Your Employer Covers (2026):** describes managed/direct-billed, reimbursement, lump-sum and mixed arrangements, with examples of package benefits. Source: https://nelsonwesterberg.com/guides/relocating-for-a-job/

**Competitive conclusion:** employer relocation calculators and package explainers already exist. Do not call our feature unique or first. The defensible positioning is narrower: a free employee-side move budget that separates cash paid to the employee from costs the employer pays directly, then shows the remaining estimated gap and optional cash buffer. This is a concrete product distinction, not a proven market moat; continue competitor testing.

## 4. Recommended M1 work after the 2026-11-05 measurement gate

Do not add another page. The homepage already has a paragraph in the hero area, but GSC shows the relevant query cluster lands on the homepage. After the fixed-window GSC read on 2026-11-05, test a concise, answer-first block on the homepage that:
1. directly explains the difference between a lump sum paid to the employee and moving costs paid directly by the employer;
2. tells the visitor what the calculator returns (estimated covered amount and remaining gap);
3. links directly to the employer section of `/calculator/` and the employer guide;
4. makes clear that the calculator does not determine tax treatment and that amounts should be entered as actually received/used.

The calculator section currently has the heading “Employer relocation package”; consider adding a stable anchor ID only as part of that approved M1 change. Keep the current calculator math unchanged. Compare the same GSC query/page pairs after publication; do not infer success from a single day.

## 5. IRS source freshness and tax-accuracy finding — important, not a production edit

Read the complete current IRS Publication 15-B (2026) HTML page, not only the first 100,000 characters. Its “What’s New” section states that P.L. 119-21 permanently eliminates the exclusion for qualified moving expense reimbursements for most employees, while retaining exceptions for:
- qualifying active-duty Armed Forces members moving under military orders for a permanent change of station; and
- qualifying employees/new appointees of the intelligence community moving under a change in assignment that requires relocation.

Primary IRS sources:
- Publication 15-B (2026), “What’s New”: https://www.irs.gov/publications/p15b
- IRS Tax Topic 455 (current page explicitly covers Armed Forces and Intelligence Community, including 2026+ intelligence-community moves): https://www.irs.gov/taxtopics/tc455
- Current 2025 Instructions for Form 3903: https://www.irs.gov/instructions/i3903
- IRS search also returns a **2026 draft** Form 3903 instruction PDF that includes the intelligence-community expansion. It is a draft, not final instructions; do not cite it as final authority or update user-facing copy from it alone.

**Finding:** the existing project correctly mentions the intelligence-community exception in the 2026 Pub 15-B paraphrase, but its paired Form 3903 source is explicitly the 2025 version and its fact paragraph only discusses Armed Forces. That is year-specific, not a fabricated statement, but the two-source presentation can leave the reader with an incomplete impression for tax year 2026. Also, the source check currently lists only “moving expense” and “Armed Forces” patterns and was last manually verified 2026-10-27.

**Recommended safe source update (after the publication gate / editorial review):**
1. Keep Pub 15-B (2026).
2. Add IRS Tax Topic 455 as a current primary source for the two qualifying categories and the 2026+ intelligence-community provision.
3. Keep 2025 Form 3903 only when discussing 2025 tax-year instructions; otherwise replace it with the final 2026 instructions once IRS publishes the final version. Do not treat the 2026 draft as final.
4. Re-read all three official pages in full, refresh the human verification date, and adjust guide copy to distinguish “most employees” from the two narrow statutory exceptions. Do not calculate anyone's tax or imply that every direct-paid item is automatically tax-free.
5. Preserve the explicit “not tax advice / ask payroll or a tax professional” limitation.

## 6. What remains open

- AI answer benchmark: **OPEN / NOT COMPLETE**. The GSC query report is ordinary Google Web search, not an AI citation test. No direct ChatGPT Search, AI Overview/AI Mode or Copilot answer was observed in this work.
- The 30 prompts remain open. Do not infer citation or mention from these GSC rows.
- No production code, published copy, calculator coefficients, indexing requests, sitemap submissions, outreach or embed work changed.
