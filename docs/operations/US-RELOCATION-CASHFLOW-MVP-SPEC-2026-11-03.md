# Relocation cash-flow plan — product specification draft — 2026-11-03

**Status:** discovery/specification only. Not implementation approval.  
**Scope:** US relocation planning; preserve the existing calculator and browser-only privacy posture.

## Visitor problem to solve

A household can know the estimated total move cost and still be short of cash on a specific date. Employer lump sums, direct-paid services and reimbursements behave differently: a reimbursement expected after the move does not pay a deposit due before the move. A weekly living-cost reserve also does not show the timing of invoices, deposits or the first paycheck.

The proposed feature is a date-aware cash-flow view that answers:
1. How much will I need to pay myself, and on which dates?
2. Which employer support is cash already received, direct payment, or reimbursement still pending?
3. What is the largest cash shortfall before my first paycheck?
4. What living-cost reserve is needed after arrival, without double-counting moving costs?

## Minimum data model

### A. Cost item
- Stable local ID.
- Category and plain-language label.
- Amount and currency (USD for the first US release).
- Type: one-time move/arrival cost or recurring living cost.
- Due date (optional) and paid date (optional).
- Status: planned, due, paid, partially paid, cancelled.
- Funding method: self-paid, employer direct-pay, or potentially reimbursable.
- Optional user note; no document upload.

### B. Employer support
- Support type: lump sum, direct pay, reimbursement.
- Amount or cap (user-entered).
- Eligible categories / specific linked cost items (user-entered).
- Claim status: not submitted, submitted, approved, denied, paid.
- Submission date, expected payment date, actual payment date.
- For reimbursements, amount claimed, approved amount and received amount remain distinct.
- Do not infer eligibility, taxability or payment dates. The user supplies these from their employer policy.

### C. Household cash events
- Starting available cash (optional, user-entered).
- Lump-sum receipt date and amount.
- Paycheck date and amount (optional; user-entered).
- Reimbursement actual receipt date and amount.
- Cost-item payment dates and amounts.
- Direct employer payments reduce the employee-paid outflow for that item; they are **not** counted as cash received by the employee.

## Core calculation rules

1. **Estimated total move cost** remains the existing calculator output; do not alter its coefficients, contingency or range in this experiment.
2. **Employee responsibility by item** = item cost minus confirmed direct employer payment minus reimbursement actually received for that item. Pending/expected reimbursements are not cash in hand.
3. **Cash balance by date** = starting cash + cash receipts actually scheduled/received by that date − employee-paid outflows by that date. Direct-pay items are excluded from employee outflows only to the extent the employer pays them directly.
4. **Peak pre-paycheck cash need** = the largest cumulative cash deficit in the timeline before the first paycheck date. If no paycheck date is supplied, label the result “cash needed over selected planning period,” not “pre-paycheck”.
5. **Post-arrival runway** uses recurring living-cost items only. Keep it separate from one-time moving costs and show the selected number of weeks/months explicitly.
6. A pending reimbursement may be shown as “expected later” in a separate forecast, but must never reduce the “cash needed now” or “cash needed before receipt” figure.
7. Avoid double counting: each cost item has one primary payment event; employer direct pay and reimbursement allocations cannot exceed the item cost unless an explicit refund/credit is represented.

## Required scenarios for acceptance tests

- Lump-sum-only package received before move.
- Employer pays mover directly; employee pays deposits and travel.
- Reimbursement submitted before move but paid after arrival.
- Partial reimbursement with a cap and some ineligible items.
- First paycheck delayed beyond the selected runway.
- Reimbursement denied or paid later than expected.
- Cost item paid in installments.
- No employer support and no paycheck date supplied.

Each scenario must assert the timeline and employee cash balance, not only a final total.

## Privacy and UX boundaries

- Keep data in browser local storage by default, matching the current tracker; do not transmit household finances or employer-policy details.
- No account, bank connection, employer document upload, payroll integration or server-side persistence in the MVP.
- Provide a clear reset/export option and explain that dates/amounts are user-entered estimates.
- Make date inputs optional and show “not provided” rather than inventing dates.
- Support keyboard navigation, accessible labels, mobile layout and currency formatting.
- Never ask for SSN, bank credentials, employer identity or other unnecessary sensitive details.

## Evidence gate before implementation

1. Validate the problem against at least 5 distinct realistic user scenarios (synthetic scenarios may test logic but do not prove market demand).
2. Review whether current calculator and tracker can share a minimal local-only data contract.
3. Produce a clickable low-fidelity flow or screen sketch and test task completion with representative users.
4. Define expected outcomes and edge cases before coding.
5. Implement separately with unit tests for event ordering, direct-pay allocation, delayed/partial/denied reimbursements and no-paycheck-date handling.
6. Compare the result against the current tools and only ship if the new workflow materially reduces planning errors or time.

## Explicit non-goals

- No tax calculation or tax advice.
- No employer-policy scraping or eligibility inference.
- No prediction of reimbursement dates.
- No bank-account or payroll access.
- No formula recalibration or changes to existing moving-cost estimates.
- No public launch until the value-before-publishing checks pass.
