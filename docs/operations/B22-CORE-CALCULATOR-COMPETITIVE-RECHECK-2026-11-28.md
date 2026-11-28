# B22 — Core calculator competitive recheck
**Date:** 2026-11-28  
**Scope:** research and source review only. No production change, pricing, coefficient, or calculator-formula change.

## Why this review
B22 is the active audit of the homepage, calculator, and methodology for direct answers, trust, and quoteability. B24/B15 is explicitly parked until comparable real shipment records or quotes exist; this review does not reopen it.

## Primary-source competitor evidence

### moveBuddha — current moving-cost calculator
Official page: https://www.movebuddha.com/moving-cost-calculator/ (read 2026-11-28).

The current page exposes origin and destination, move date, property type, and home size before calculating. It says no email or phone number is required and presents a price range as a rough estimate, warning that shipment size, additional services, access/parking, and availability can change the result.

Its own methodology claims a dataset refreshed monthly with 1,000+ new US data points, drawing on provider feeds/APIs, direct quote requests, and anonymized user quotes. It describes median lane summaries, stratification by service type/region/move size, and outlier detection. The page also displays participant quote examples with company, distance, and quoted price.

**Evidence caution:** these are publisher claims, not independently audited dataset facts. A June 12, 2026 moveBuddha press release says 10,000+ new data points monthly, while the current calculator page says 1,000+; this is an internal public-claim discrepancy. Do not repeat either count as independently verified. Source: https://www.movebuddha.com/blog/press-release-movebuddha-refreshes-moving-cost-calculator-with-updated-pricing-data/

### U-Pack — current pricing explanation
Official pages:
- https://www.upack.com/articles/understanding-upack-pricing (published 2026-10-28; read 2026-11-28)
- https://www.upack.com/articles/moving-cost-calculator (published 2026-04-29; read 2026-11-28)

U-Pack is a service-specific quote, not an independent market-wide calculator. Its pricing explanation identifies equipment type and space used (number of ReloCubes or trailer linear footage), available capacity for the dates/locations, distance/fuel, and move date as price drivers. It says the customer can adjust space/container count and dates to see the effect. Its quote article describes included equipment, delivery, transportation and standard liability, and recommends separately budgeting personal travel, meals, hotels and packing supplies.

This is useful evidence for how a space-based provider prices its own service, but it is not a transferable consumer moving-price coefficient and is not directly comparable to a full-service market estimate.

## What the current Relocation Cost source already does
Reviewed current `main` source:
- `src/pages/calculator.astro`
- `src/pages/methodology.astro`

The calculator currently offers:
- State-to-state origin/destination with an approximate central-point road distance and a manual mileage override; it explicitly says this is not address-to-address mileage.
- Four home-size bands expressed as approximate cubic-foot ranges, three move types (DIY, rental truck + labor, full service).
- Optional travel, temporary housing, deposits/setup, packing/extras, and itemized expense fields.
- Optional employer lump-sum cash after withholding, employer-paid expenses, and a separate cash buffer until first income.
- A methodology page that exposes the formula and labels the base rate, per-mile rate, multipliers, contingency, and range as planning assumptions rather than published market prices. It distinguishes the CMR middle-half reference from the model estimate and does not call it a national-market average.

## Competitive assessment and decision
1. **Do not imitate moveBuddha's live market-data claim.** Relocation Cost does not have a matched, continuously refreshed, independently validated quote dataset. A date field without a defensible date/capacity model would create false precision. No date-based price adjustment is authorized.
2. **Do not copy U-Pack's space-price logic into the full-service model.** U-Pack prices its own equipment/space product. Its linear-foot and container controls are not a general household-mover cost formula.
3. **The defensible distinction to make clearer is product scope:** Relocation Cost is a whole-relocation budget planner, not a mover quote engine. Its useful difference is combining a transparent transport planning range with user-entered relocation expenses, employer cash/direct-paid benefits, and a separate pre-income cash buffer.
4. **No code change is justified by this review alone.** The calculator and methodology already disclose important limits. The next B22 check should inspect the homepage's current first-screen promise against the calculator's actual broader budget capability, then verify the rendered experience on a working browser. Do not add fields, prices, or claims until that check demonstrates a specific visitor problem.

## Evidence limits
- Competitor pages were read as public page text; no quote form was submitted and no personal information was entered.
- No competitor calculator was tested end-to-end, no speed/accessibility measurements were made, and no market dataset was independently audited.
- Relocation Cost source was reviewed in GitHub; the live Vercel pages could not be fetched by the available web reader (cache miss), so no claim is made about current rendered appearance.
- No production code, formulas, prices, coefficients, route distances, API calls, or deployment changed.

## Sources
- moveBuddha calculator: https://www.movebuddha.com/moving-cost-calculator/
- moveBuddha data-refresh announcement: https://www.movebuddha.com/blog/press-release-movebuddha-refreshes-moving-cost-calculator-with-updated-pricing-data/
- U-Pack pricing factors: https://www.upack.com/articles/understanding-upack-pricing
- U-Pack calculator explainer: https://www.upack.com/articles/moving-cost-calculator
