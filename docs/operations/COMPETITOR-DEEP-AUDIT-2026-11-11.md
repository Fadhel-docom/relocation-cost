# Competitive product audit — 2026-11-11

Scope: direct review of public calculator/product pages and published methodology. This is not a full browser interaction test, independent audit of competitor datasets, or proof of market accuracy. Findings below distinguish competitor-reported claims from directly visible product behavior.

## 1. What the strongest alternatives actually offer

### moveBuddha — strongest pricing-data and quote-comparison moat
- Page: https://www.movebuddha.com/moving-cost-calculator/ (retrieved 2026-11-11).
- Visible input flow: origin and destination by city/state/ZIP, move date, property type, home size; it reports a five-detail completion state. No email or phone is required to see estimates.
- The page says its data is updated monthly with 1,000+ new data points and elsewhere says 10,000+ monthly; sources described include provider feeds/APIs, direct quote requests, its Better Moves Project and anonymized tool quotes. It claims medians, stratified sampling by service/region/move size, outlier detection and provider verification. These are the company's own claims, not independently audited.
- It exposes confirmed participant quote examples with named companies, route distances and prices. This is a powerful trust device because it shows variation rather than pretending one number is guaranteed.
- Strength: date-aware, route-aware price ranges across full-service, containers, truck rental and labor, with a large evidence pipeline and a next step to compare movers.
- Weakness/opportunity: the visitor still needs a separate plan for travel, temporary housing, deposits, employer reimbursement and cash to have available; the estimate is explicitly rough and final cost can vary with inventory/access/services.
- Implication: do not try to beat moveBuddha by claiming live or more accurate prices. That would be false without a comparable data operation.

### Haulest — strongest transparent user-reported outcomes
- Page: https://haulest.com/calculators/cost?market=us and https://haulest.com/ (retrieved 2026-11-11).
- Visible outputs include median paid, middle-half range (25th–75th percentile), cohort date and sample count. Example on the calculator: 2-bedroom interstate cohort $4,100 median, $3,426–$4,965 middle half, 1,181 priced reviews since 2025-01-01. The page says a cell needs at least 10 priced reviews before displaying a median.
- Route examples on the homepage show lane-specific medians and counts (e.g. California to Texas displayed as $4,500 median across 255 reviewed moves).
- The product distinguishes reviewer-reported prices from its September 2026 research fallback ranges and warns that self-reported reviews are selection-biased and written estimates control.
- Strength: visible sample size, dates, distribution and route segmentation; users can judge evidence rather than only a proprietary estimate.
- Weakness/opportunity: reviewer prices carry each household's own date, access, inventory and services; selection bias means the sample is not a representative quote for the visitor. The tool also offers a quote/call path.
- Implication: this is a direct threat to a generic "moving cost estimate" proposition. We must not copy or re-label its numbers. Our stronger defensible job is to build the visitor's full cash plan around whichever provider price they later obtain.

### RelocateMath — strongest methodology and broader relocation decision coverage
- Page: https://relocatemath.com/methodology/ and https://relocatemath.com/ (retrieved 2026-11-11).
- Its methodology describes 198 published price ranges across 22 interstate routes, checked against 47 additional published prices; it discloses a 1.17 median road/straight-line ratio and details sources for tax, housing, electricity, fuel, insurance, health and child-care inputs.
- It also offers salary/take-home and personal budget comparison. These are competitor-reported methods and counts; not independently recalculated in this audit.
- Strength: unusually explicit source and assumption trail; broader "is this move financially worthwhile?" decision support.
- Weakness/opportunity: a state-level ratio remains an approximation, and its own method states assumptions and exclusions; its breadth also creates a substantial data-maintenance burden.
- Implication: do not duplicate its tax/payback product (already no-build). Strengthen our own cost methodology, source dates and cash-flow distinction without pretending to offer a full cost-of-living or tax model.

### GoodMigrations — simple cost bands and practical cost drivers
- Page: https://goodmigrations.com/moving-cost-calculator/ (retrieved 2026-11-11).
- Displays broad cost bands by distance and home size before the quote CTA. Explains date/season, packing, extra services, supplies, storage, valuation and travel costs.
- Strength: visitors can get a quick market orientation and immediately see common add-ons.
- Weakness/opportunity: bands are ballpark/historical and not personalized to an exact route/date; the subsequent quote CTA is a different journey.
- Implication: keep extra-cost guidance visible, but do not copy its ranges or present generic bands as current route prices.

### Moving.com — quote funnel, not a neutral full-budget planner
- Public calculator review (prior audit 2026-11-09): asks route, size, packing and date, then offers matching with up to four movers.
- Strength: clear transition from cost intent to service-provider leads.
- Weakness/opportunity: lead matching does not itself give the visitor a complete independent relocation cash budget.
- Implication: retain our independent, no-contact budget path; do not turn the core tool into a lead form.

## 2. Honest competitive position of Relocation Cost today

Verified from current production page and source:
- No email, account or mover-quote request is required to see the estimate.
- The visitor can add travel, temporary housing, deposits/setup, packing/extras, itemized costs, employer lump sum, employer-paid direct costs and a separate living cash reserve.
- The calculator compares DIY, rental truck + labor and full-service scenarios, and compares home-size scenarios.
- The route default is an approximate route between state reference points, not the visitor's addresses; the visitor can enter their own miles.
- It does not use move date, does not calculate taxes, does not use live mover prices. The U-Haul published one-way average by mileage band is a floor in the DIY model; the service premiums, contingency and planning band are assumptions. The model is not calibrated to route-specific quotes.

Conclusion: the defensible product promise is **an editable, all-in relocation cash budget before contacting movers**, not "the most accurate moving quote" or "live market prices". The value is helping the visitor understand total cash exposure and employer coverage, then compare actual quotes against a complete plan.

## 3. Product action opened in this PR — B14

The homepage previously offered a generic headline and sent visitors to a separate calculator page. The competitor pages put their first useful inputs directly in the first screen. A low-risk way to reduce friction without duplicating the calculator or inventing prices is a route-first quick-start form in the homepage hero.

Implementation:
- Ask for origin state, destination state, home size and move type.
- Submit by GET to the existing calculator using its existing field names.
- Send an empty distance parameter so the calculator recomputes the selected state-pair distance instead of accidentally retaining the default CA–TX distance.
- Keep all pricing calculations, caveats, extra-cost fields, employer fields and cash-reserve logic in the existing calculator.
- No new API, analytics, personal-data collection, coefficients, route data or quote form.

## 4. What would actually close the market-data gap

Do not tune coefficients from these competitor pages. The next credible pricing work requires a permitted, privacy-minimal evidence protocol:
1. Define comparable observations: route, move date, home-size/volume band, service mode, included services, access conditions, quote vs paid amount, source and capture date.
2. Distinguish provider-published quotes, written estimates, paid invoices and user-reported reviews; never combine them without labeling.
3. Require a minimum sample per comparable segment, publish count and distribution, disclose self-selection and missingness, and suppress sparse cells.
4. Confirm consent, retention, license and rights to republish before collecting anything.
5. Hold out observations for validation before changing any model coefficient.

No user-price collection, upload flow or model recalibration is authorized by this audit.

## Sources
- moveBuddha calculator: https://www.movebuddha.com/moving-cost-calculator/
- moveBuddha pricing methodology (updated Nov 4, 2026): https://www.movebuddha.com/blog/moving-pricing-methodology/
- Haulest cost calculator: https://haulest.com/calculators/cost?market=us
- Haulest homepage and lane examples: https://haulest.com/
- RelocateMath methodology: https://relocatemath.com/methodology/
- GoodMigrations calculator: https://goodmigrations.com/moving-cost-calculator/
- Moving.com calculator: https://www.moving.com/movers/moving-cost-calculator.asp
- Relocation Cost live homepage: https://relocation-cost-psi.vercel.app/
- Relocation Cost live calculator: https://relocation-cost-psi.vercel.app/calculator/
- Relocation Cost live methodology: https://relocation-cost-psi.vercel.app/methodology/
