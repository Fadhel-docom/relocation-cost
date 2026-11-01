# Competitor gap review — route costs and quote comparison
**Date:** 2026-11-01 | **Owner:** ChatGPT | **Status:** research completed; no product or production change.

## Scope and evidence boundary
Opened the following live competitor pages on 2026-11-01. Statements about their datasets, users or service are the providers' own published claims; this review did not independently audit their underlying records or commercial performance.

## What the competitors actually provide

### Route cost pages
- **moveBuddha — California to Texas:** publishes a full-service range and says it is based on 942 user-provided quotes over the preceding 90 days; it also gives a route distance and identifies home size, mover type, timing and access as cost factors. Source: https://www.movebuddha.com/popular-routes/CA/TX/
- **moveBuddha — California to Arizona:** says its route range is based on 1,126 user quotes over 90 days. The page goes further than a single range: it separates full-service, container and rental-truck options by home-size band, then lists packing, materials, specialty-item, stairs/elevator, storage, shuttle, auto-transport and valuation add-ons. Source: https://www.movebuddha.com/popular-routes/ca/AZ/
- **GoodMigrations — Florida to New Jersey:** says it reviewed 235 Florida mover records, updated October 2026, and displays a route range, option averages and recent partner-network quote examples. It separates full-service, rental truck and container options. Source: https://goodmigrations.com/popular-routes/florida/new-jersey/

**Competitor advantage:** route-specific quote datasets and service-type breakdowns. We must not imitate their price ranges or imply our model has equivalent quote evidence. Relocation Cost's credible difference is transparent assumptions and a user-controlled planning estimate, not a competing market-average claim.

### Quote comparison and quote review
- **MoveDayMap Quote Decoder:** manual side-by-side entry of charges and terms, with categories for transportation, packing/materials, stairs/shuttle/long carry, storage, valuation, other charges and deposits. It captures mover/broker role, estimate type, USDOT number, inventory inspection, written estimate, delivery window, payment terms and exclusions. It explicitly treats blank/unknown as not confirmed free, warns against double counting, and generates questions for the mover. Source: https://movedaymap.com/quote-decoder
- **Have a Good Move — Compare Movers:** lets a user compare up to three companies against a user-entered inventory volume, prices and add-ons; it highlights volume differences and says it does not choose a winner. Source: https://haveagoodmove.com/compare
- **Have a Good Move — Quote Review:** separately offers human review of up to three written estimates and inventories, including pricing, deposits, exclusions and terms; the page lists a $59 comparison service. Source: https://haveagoodmove.com/quote-review
- **Have a Good Move — Check My Quote:** separates a free company-identity check from paid review of the estimate itself. Source: https://haveagoodmove.com/check-my-quote

**Competitor advantage:** this is not an empty niche. MoveDayMap already provides a detailed self-service scope normalizer; Have a Good Move offers both a self-service comparison and human review.

## Implications for Relocation Cost

1. **Do not build a generic quote-comparison tool now.** The current Quote Scope Checker concept overlaps directly with existing tools. A narrower differentiator would need evidence that users still struggle with a specific task those tools do not solve. No such evidence is recorded yet.
2. **Do not compete on unsupported route averages.** moveBuddha and GoodMigrations publicly claim quote/record datasets. We do not have a comparable independent quote sample. Keep our estimates labelled as planning estimates and keep model assumptions visible.
3. **Prioritize the existing employer relocation workflow.** The calculator's cash-versus-direct-paid employer inputs plus the employer relocation guide are a more distinctive combination than another general moving calculator. GSC's 2026-10-01 to 2026-10-29 query report returned 20 impressions for “relocation package calculator” (average position 46.15), 6 for “relocation expenses calculator” (47.33), and 4 for “relocation allowance calculator” (57). Small samples: directional evidence only, not proof of demand or conversion.
4. **Route pages remain a measured opportunity, not a new-page opportunity.** In the same GSC window: California→Texas had 10 page impressions (average position 93.1), Florida→New Jersey 6 (52.67), California→Arizona 6 (79.67), while New York→Pennsylvania had 2 (3.5). The last figure is too small to infer a stable ranking. The next approved route improvement remains the shared-template first-screen answer (M3a), after the 2026-11-05 measurement gate.
5. **Do not claim the 2-bedroom question is fully answered** unless the displayed home-size scenario is explicitly a two-bedroom scenario. Preserve the existing category wording; do not relabel “2–3 rooms” as “2 bedrooms” without checking the actual model and UI.
6. **Keep the straight-line distance boundary.** Do not add road-mile comparisons or a route API until R4 licensing and source conditions are resolved in writing.

## Current read-only search diagnostics
- GSC property confirmed: `https://relocation-cost-psi.vercel.app/`, owner permission. Web search performance for 2026-10-01 through 2026-10-29: 158 page impressions, 0 clicks in the page aggregate returned. Homepage: 124 impressions; California→Texas: 10; Florida→New Jersey: 6; California→Arizona: 6; New York→Pennsylvania: 2. Query-level rows include “relocation package calculator” at 20 impressions.
- GSC sitemap endpoint returned 115 submitted and 0 indexed for each of the sitemap and sitemap-index records. This is a sitemap-report field, not a site-wide index count; do not override the owner's separate report of indexed URLs or infer that the whole site has zero indexed pages from this field alone.
- Bing lists the sitemap index as Success, last crawled 2026-10-18, with one URL reported; `/sitemap.xml` as Success, last crawled 2026-10-03, with five URLs reported. Several older individually submitted page feeds say “The feed was empty.” Bing URL inspection returned no usable HTTP status/document size for the homepage (last crawl 2026-10-03) and no crawl record for the two tested route pages. This does **not** establish that the routes are not indexed; it establishes that this connected API response did not provide usable page-level crawl data.
- No URLs were submitted. No sitemap was resubmitted. No production files, calculator formulas or published content were changed.

## Prioritized work

| Priority | Work | Why | Gate |
|---|---|---|---|
| P1 | Employer relocation answer/value path: validate and sharpen the existing calculator + guide around cash vs direct-paid costs and budgeting comparison | Existing product capability plus the strongest relevant GSC query cluster in this sample | Review existing content and evidence; no tax advice; publish only after quality review |
| P1 | Re-test route first-screen answer proposal (M3a) on existing route template | GSC shows some route impressions but weak positions on CA→TX and FL→NJ; no need for more route pages | Wait for 2026-11-05 GSC baseline gate |
| P2 | Add one concise methodology explanation for why state-centre straight-line distance is used when exact addresses are not collected | Explains a real product trade-off without inventing road-mile data | Check consistency with current calculator/methodology; do not change distance source |
| P2 | Keep quote comparison as discovery only; seek evidence of a distinct unmet task before prototyping | Strong direct competitor overlap | No build until user/problem evidence exists |
| P3 | Calibration study for estimate accuracy | No measured error against real quotes exists | Requires comparable, dated, voluntary quote evidence; do not alter coefficients meanwhile |

## AI visibility status
This review is not an AI-answer test. ChatGPT Search, Google AI Overviews/AI Mode and Copilot have not been directly tested here. The 30-question benchmark remains **OPEN / NOT COMPLETE**. Each relevant prompt needs dated direct-surface evidence (brand mention, domain/page citation, accuracy, competitors and screenshot/reference), or a documented gap and next improvement/re-test. Unavailable surfaces remain “Not tested”; ordinary web results are not AI citations. Out-of-scope prompts must be justified rather than forced to mention the brand.

## Next partner task — Claude
Independently review this competitor comparison and the priority order against the current product/source code. In one cohesive response in WORK-LOG:
- challenge any inaccurate competitor feature or dataset description;
- verify that the employer relocation workflow is genuinely differentiated in our current UI, not just in our positioning;
- inspect the actual home-size labels before deciding how to handle prompt #4;
- recommend one highest-value product/content improvement that respects the 2026-11-05 GSC gate;
- state explicitly whether any Bing/GSC AI-specific reporting surface is actually available to your connected account.
Do not edit production, submit URLs, build the quote tool/embed, or contact publishers. Keep the 30-prompt task open until the row-level completion gate is met.
