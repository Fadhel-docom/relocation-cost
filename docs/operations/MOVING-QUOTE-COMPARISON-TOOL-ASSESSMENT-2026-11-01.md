# Moving Quote Comparison Tool — Opportunity assessment
**Date:** 2026-11-01 | **Status:** discovery only; no build decision.

## User problem
Several moving estimates may differ because shipment inventory, weight/volume, service scope, valuation/coverage, access charges, dates and estimate type differ. Comparing headline totals alone can mislead.

## Evidence
- FMCSA Moving Checklist recommends obtaining estimates from at least three movers/brokers and comparing cost and other services.
- FMCSA says written interstate estimates include transportation, accessorial and advance charges; a rate quote is not an estimate. Binding and non-binding estimates have different implications.
- Existing comparison articles show the topic exists, but do not prove demand for another standalone tool.
Sources:
- https://www.fmcsa.dot.gov/protect-your-move/moving-checklist
- https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/what-binding-move-estimate
- https://www.fmcsa.dot.gov/protect-your-move/select-mover

## Differentiation hypothesis
A neutral side-by-side normalizer that exposes missing or non-equivalent quote items, rather than ranking providers by lowest price.

## MVP workflow
1. User manually enters 2–3 estimates; no document upload in first release.
2. For each: optional provider label, estimate type (binding / non-binding / binding not-to-exceed / unclear), date, shipment basis, and written total.
3. Add line items: transportation, packing, materials, fuel, stairs/long carry/shuttle, storage, extra stops, specialty items, valuation/coverage, taxes/other, discounts and additional services.
4. Mark each item included, separately priced, excluded, unknown, or not applicable. Unknown must never be treated as $0.
5. Show normalized totals only when enough comparable information exists; otherwise show “not directly comparable” and explain why.
6. Provide questions to ask about missing scope, inventory, delivery window, payment terms and written estimate.
7. Link to FMCSA mover/broker guidance; do not claim to verify a provider unless an official check is actually performed.

## Accuracy and trust rules
- Never label an estimate “best” or “safest” based on price alone.
- Do not interpret contracts or calculate a legally payable final amount.
- Distinguish written estimate from rate quote; label binding and non-binding amounts separately.
- The 110% delivery rule is specific to certain non-binding interstate estimates; do not apply it to every quote or move.
- No ratings or provider risk scores without a defensible, current method.
- No storing addresses, phone numbers, household inventories or uploaded contracts in MVP.

## Demand validation before development
- Review search queries and site feedback for comparison intent.
- Test a prototype with 5–8 voluntary users who have compared interstate mover estimates.
- Use clearly labelled synthetic examples and ask whether the tool reveals useful scope differences beyond an FMCSA checklist or spreadsheet.
- Study existing comparison tools and document the exact unmet need.
- Proceed only if testing demonstrates a meaningful decision improvement.

## Independence
Keep comparison independent of provider payments. Any future referral relationship must be disclosed and must not affect normalization or ranking.

## Recommendation
**Do not build yet.** The strongest concept is a “Quote Scope Checker” that exposes missing items and non-equivalent service scope, not another price-prediction engine. A spreadsheet prototype is sufficient for initial validation.