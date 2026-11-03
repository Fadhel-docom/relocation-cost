# Whole-move budget feature audit — 2026-11-03

**Scope:** audit of the current calculator, employer package comparison, cash buffer and budget tracker. Documentation only; no formula or production change.

## What already exists

### Main calculator
- State-to-state estimate with a user-editable distance. The default distance is a great-circle line between state centroids, not road mileage.
- Home-size and move-type selectors (DIY, rental truck + labor, full service).
- User-entered additional expenses: travel, temporary housing, deposits/setup, packing/extras, fuel, insurance, packing materials, equipment, utilities, storage, crew tips, specialty items and access fees.
- A 10% contingency and a fixed ±20% planning band. The band is explicitly not a statistical confidence interval.
- Cost breakdown, comparison cards, share/print/email-draft functions, and links to route guidance.
- U-Haul published one-way rental averages are used as a distance-band minimum for the DIY base, not as route-specific or full-service mover quotes. Other coefficients remain a planning model, not a calibrated market-price model.

### Employer package
- Two inputs only: lump sum paid to the employee and value of costs the employer pays directly.
- The tool compares their sum with the estimated total and reports the employee gap/surplus, including a range and optional cash buffer.
- It warns that lump sums may be taxable and explicitly does not calculate tax.

### Cash buffer
- User chooses 0/2/4/6/8/12 weeks and enters one weekly living-cost total.
- The reserve is kept outside the moving expense total, contingency and estimate range; it is added to “cash to have ready”.

### Planned-versus-actual tracker
- User can enter line-by-line planned and actual amounts, import selected user-entered extra costs from the calculator, and print/save a PDF.
- Values are saved in the browser; the page says nothing is transmitted.
- The tracker compares actual spending only against the planned amount for those same lines, avoiding the misleading appearance that not-yet-spent items are savings.

## Gaps against the owner's four-stage product direction

| Area | Current limitation | Why it matters | Evidence needed before changing |
|---|---|---|---|
| Employer reimbursement | No separate reimbursement amount, eligible expense categories, caps, claim status or expected payment date | A reimbursement that arrives after the move cannot be treated as cash available on move day | Real employer policy examples, entered by user; no scraping or tax assumptions |
| Employer direct pay vs reimbursement | Direct payment and lump sum are the only coverage inputs; no allocation to the exact cost lines | Can overstate coverage if the same expense is counted inconsistently or if support is restricted | Define a transparent mapping to eligible expense lines |
| Tax treatment | Tax note only; no gross/net toggle or user-specific tax calculation | User may mistake gross allowance for spendable cash | Keep taxes out unless authoritative, case-specific rules and safe scope are established |
| Cash runway | One weekly total × weeks; no monthly category breakdown, first-pay date or different income timing | Does not help identify what drives the post-arrival runway | User research and a clear, optional expense model |
| One-time vs recurring costs | Temporary housing and setup are manual one-time fields; recurring rent/utilities/transport/food are not separated from moving expenses | Arrival cash and total move spend can be mixed or double-counted | A clear timeline and separate one-time/recurring categories |
| Quote calibration | User can replace assumptions with quotes, but there is no structured quote capture/normalization | Model accuracy cannot be learned from comparable quotes yet | Consented, rights-cleared, dated observations with scope and exclusions |
| Planned-vs-actual integration | Tracker imports selected extra expenses; it does not import the modeled move total, employer coverage, reimbursements or reserve plan as distinct tracked lines | The suite's tools are useful but remain partially disconnected | Decide a minimal handoff contract; preserve browser-only privacy |
| Timing / cash flow | No move date, deposit due dates, invoice due dates, reimbursement date or first-pay date in one timeline | Total amount alone does not reveal when cash is needed | User need evidence; no assumptions about employer timing |

## Product conclusion

The site already has substantial pieces of a whole-move budget. It is inaccurate to say the feature does not exist. The honest gap is **integration and timing**: the current calculator gives an estimate plus optional employer cash/direct pay and a simple reserve, while the tracker compares user-entered planned and actual expenses. It does not yet model employer reimbursement rules or when cash leaves and returns.

The strongest next product experiment is a **Relocation cash-flow plan** that separates:
1. estimated moving costs and dated provider quotes;
2. employer lump sum, direct-pay items, and reimbursement claims as separate categories;
3. eligible expense, cap, claim status, submission date and expected reimbursement date (all user-entered, with no tax calculation);
4. one-time arrival costs from recurring living costs;
5. first-pay date and user-selected cash runway;
6. planned, paid, reimbursed and still-outstanding amounts.

This is a proposal, not a build authorization. Before implementation, validate the problem with a small number of real user scenarios and ensure the flow does not ask for employer documents or sensitive personal details. Keep all data local unless the owner separately approves a privacy-reviewed storage design.

## No formula changes

No evidence in this code audit justifies changing the moving-cost formula, coefficients, 10% contingency or ±20% band. Keep those unchanged until comparable dated quote observations pass the calibration gate in the US roadmap.

## Suggested next sequence

1. Design a one-page cash-flow data model and a few synthetic examples clearly labelled as examples—not market data.
2. Check whether the current browser-only architecture can support the workflow without sending user data to a server.
3. Validate the design against scenarios such as lump-sum-only, direct-paid mover, reimbursement after move, partial eligibility and delayed first paycheck.
4. Only then open a separate implementation PR with tests and accessibility review.

## Sources inspected

- Repository: `src/pages/calculator.astro`, `src/scripts/calculator.js`, `src/lib/calculator.js`, `src/pages/budget-tracker.astro`, `src/lib/tracker.js`.
- No external moving-price source was used to calibrate or alter the formula in this audit.
