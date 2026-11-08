# Employee relocation decision support — competitor gap review and scoped proposal
**Date:** 2026-11-07 UTC  
**Owner:** ChatGPT  
**Status:** Research and product specification only. No calculator code, formula, data, page, or production change in this PR.

## Decision in one sentence
Do not build another generic relocation salary calculator or another quote-comparison tool. Validate a narrower employee-side decision workflow that combines the existing moving-budget and employer-benefit calculator with the user's own current/new monthly take-home pay and recurring costs, then shows whether the move improves monthly surplus and how long any unreimbursed moving cost would take to recover.

## 1. Evidence already owned by this project
The 2026-11-06 GSC gate review records 41 impressions for “relocation package calculator” (average position 35.59), 15 for “relocation expenses calculator” (37.47), 9 for “relocation compensation calculator” (55.89), and 6 for “relocation allowance calculator” (52.00). These are small site-level samples, not search-volume estimates or proof of conversions. The query cluster is still the strongest relevant intent signal in the current sample. Source: [GSC gate review](GSC-GATE-REVIEW-2026-11-06.md).

The current calculator already:
- Estimates a one-time moving budget and shows its assumptions and limitations.
- Accepts an employer lump sum and costs paid directly by the employer, then displays the remaining gap.
- Separates the optional cash buffer from estimated expenses.
- Has an 18-metro BEA 2024 Regional Price Parities comparison, but correctly warns that a broad price index is not a household-specific forecast or a rent quote.
- Links to an employer relocation guide that summarizes the IRS pages it has actually read and explicitly avoids calculating tax.

Relevant implementation: `src/pages/calculator.astro`, `src/lib/calculator.js`, `src/pages/cost-of-living.astro`, `src/lib/cost-of-living.js`, and `src/pages/guides/employer-relocation-package.astro`.

## 2. Competitor check (2026-11-07; public search results/page excerpts, not full interactive testing)
| Alternative | What its public page says it does | Implication |
|---|---|---|
| [North American — Lump Sum Calculator](https://www.northamerican.com/corporate-relocation/resources/calculator-tools/lump-sum-calculator) | Employer-side allowance sizing from status, family size and distance. | A generic lump-sum amount calculator is not our gap. |
| [Mercer — Employee Relocation Calculator](https://www.imercer.com/products/employee-relocation-calculator) | Employer mobility data, category differentials and lump-sum benefit calculations. | Do not pretend to offer employer-grade proprietary benchmarks. |
| [moveBuddha — Corporate Relocation Packages](https://www.movebuddha.com/blog/corporate-relocation-packages/) | Explains lump sum, reimbursement, managed and direct-billing structures, with its own benchmark claims. | Our opportunity is a personalized worksheet using the employee's actual offer, not unsupported package averages. |
| [SalaryEquate — Relocation Budget Comparison](https://salaryequate.com/tools/relocation-budget/) | User-entered current/new take-home pay and monthly costs, plus one-time moving costs and a savings comparison. | A generic pay-and-spending comparison already exists; copying it would not differentiate us. |
| [Wage101 — Relocation Salary Equivalent](https://wage101.com/tools/relocation-salary-equivalent/) and [Moving Cost Payback](https://wage101.com/tools/relocation-moving-cost-payback/) | Current/new compensation and recurring costs, with relocation cost payback. | Generic salary-equivalent or payback calculators are also occupied. |
| [Tixpapa — Job Relocation Cost Comparator](https://tixpapa.com/tools/career/relocation-cost-comparator) | Current-vs-new salary and recurring costs, one-time costs, employer support and a break-even horizon. | The overlap is substantial; an independent generic comparator is not justified. |

**Evidence limits:** this was a focused search and review of publicly surfaced descriptions/excerpts. I did not complete competitors' interactive flows, verify their formulas independently, or measure traffic/conversions. Their feature descriptions are provider claims. Do not describe this as a full usability or market-share audit.

## 3. Narrow gap hypothesis
The candidate value is not any single field or formula. It is the integration of:
1. A transparent move-cost estimate with line items and uncertainty.
2. The actual employer support the employee expects to receive/use (cash and direct-paid services).
3. The employee's own current and proposed monthly take-home pay and recurring spending.
4. A clear distinction between (a) one-time cash needed, (b) recurring monthly surplus change, and (c) the conditional number of months to recover an uncovered move cost.

This answers a practical question the current calculator does not answer end-to-end: **“After my employer's actual support and my own monthly costs, does this job move leave me better off financially, and when would the remaining moving cost be recovered?”**

It is a hypothesis, not a proven unique selling point. The overlap with SalaryEquate, Wage101 and Tixpapa means the only defensible differentiation is the integrated workflow with Relocation Cost's transparent moving-budget estimate and actual employer coverage—not a claim that no competitor does payback calculations.

## 4. Proposed smallest useful MVP (not approved for implementation yet)
Add an optional, clearly separated “Compare your monthly position” section to the existing calculator, only after the current moving-budget and employer-support inputs:
- Current monthly take-home pay (user-entered).
- New-job monthly take-home pay (user-entered).
- Current monthly recurring costs (user-entered total).
- New-location monthly recurring costs (user-entered total).

Derived outputs:
- Current monthly surplus = current take-home pay − current recurring costs.
- New monthly surplus = new take-home pay − new recurring costs.
- Monthly surplus change = new surplus − current surplus.
- Uncovered one-time move cost = max(0, existing central moving-budget estimate − employer support entered).
- Recovery period = uncovered one-time move cost ÷ monthly surplus change, **only when** the change is positive. If it is zero or negative, state that the moving cost is not recovered through an improvement in monthly surplus under the entered assumptions; do not show a misleading number of months.

The MVP must not:
- Ask for gross salary or calculate taxes, withholding, tax gross-up, or take-home pay.
- Infer rent, taxes, salaries, or personal expenses from BEA RPP or any city average.
- Present the result as financial, tax, career, or job-acceptance advice.
- Treat refundable deposits as permanent expenses if a future version itemizes them; the MVP's user-entered recurring-cost totals must exclude one-time move costs to avoid double counting.
- Store or transmit the entered financial inputs; keep calculation local in the browser and do not add sensitive values to analytics, URLs, or share links.
- Add new route pages or unsupported market-price benchmarks.

## 5. Quality and measurement gates before any code
- Product owner review of this proposal and a Claude independent review of the overlap, formulas, labels and edge cases.
- Define explicit empty-state behavior: no output until all four monthly inputs are valid; zero is a valid entered amount, blank is not silently converted to zero.
- Unit tests for positive/zero/negative monthly surplus change, no employer support, support exceeding the estimate, zero uncovered cost, invalid/negative/non-finite inputs, and recovery-period rounding.
- Browser checks at 375px and desktop: labels, keyboard flow, validation, result readability, print behavior, and no horizontal overflow.
- Verify the existing calculator, employer-gap calculation, share/print output and analytics remain unchanged; do not send any user-entered values to analytics.
- Keep it optional/collapsed or clearly secondary so the core moving calculator is not made longer or harder to complete.
- Measure only aggregate events such as section opened/completed and completion rate; never capture salary, spending or result amounts. Compare after deployment only when a sufficient baseline exists.
- Re-run the value-before-publishing gate. If the integrated version is not materially easier/useful than the separate tools already available, do not build it.

## 6. Recommendation and handoff
**Recommendation:** keep this as a candidate P1 discovery task, not an approved build. First ask Claude to challenge the proposed scope against the existing calculator and the competitor evidence, especially whether the combined move-budget + employer-coverage + monthly-surplus flow is sufficiently distinct from Tixpapa/SalaryEquate/Wage101. Claude should return one of: approve the smallest MVP, narrow it further, or reject it, with reasons and edge cases. No production changes until that review and the gates above are satisfied.

## Sources
- Project GSC evidence: [GSC-GATE-REVIEW-2026-11-06.md](GSC-GATE-REVIEW-2026-11-06.md)
- Existing competitor review: [CHATGPT-COMPETITOR-GAP-REVIEW-2026-11-01.md](CHATGPT-COMPETITOR-GAP-REVIEW-2026-11-01.md)
- [North American lump sum calculator](https://www.northamerican.com/corporate-relocation/resources/calculator-tools/lump-sum-calculator)
- [Mercer employee relocation calculator](https://www.imercer.com/products/employee-relocation-calculator)
- [moveBuddha corporate relocation packages](https://www.movebuddha.com/blog/corporate-relocation-packages/)
- [SalaryEquate relocation budget comparison](https://salaryequate.com/tools/relocation-budget/)
- [Wage101 relocation salary equivalent](https://wage101.com/tools/relocation-salary-equivalent/)
- [Wage101 relocation moving-cost payback](https://wage101.com/tools/relocation-moving-cost-payback/)
- [Tixpapa job relocation cost comparator](https://tixpapa.com/tools/career/relocation-cost-comparator)
