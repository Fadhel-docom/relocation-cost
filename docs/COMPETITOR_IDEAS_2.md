# Competitor study, round 2 (moving-cost calculators)

Date: 2026-10-17. Read-only study of public pages. Nothing here changes the calculator.

## How to read this file

- **Observed** = visible on the fetched page text on 2026-10-17.
- **Claimed** = the competitor's own statement (traffic, data size, accuracy). Not verified by us.
- **Assumption** = our reading. Needs checking before it drives a decision.
- Interactive calculators did not render in the fetched text for most sites. Where the form or result was not visible, the table says so. We did not see their real outputs.
- Not studied: Moving.com (the fetch was blocked, we did not work around it).
- Round 1 (relocation-company sites) was delivered as a separate file (`relocation-competitors-strengths.md`) and is not part of this repository.

## Observed features and our status

| Site | Observed useful feature | Problem it solves | Already in Relocation Cost? | Gap / opportunity | Effort | Source |
|---|---|---|---|---|---|---|
| moveBuddha | Calculator links to a truck size calculator, a packing/box calculator and a car shipping calculator; says no email is needed; links methodology and advertising disclosure; "Better Moves" table of participant quotes (claimed) | One place to plan the whole move | Methodology and disclosure yes; extra tools no | Truck size guide, packing estimate | M | https://www.movebuddha.com/moving-cost-calculator/ |
| moveBuddha (home) | Five-step plan (estimate, choose move type, find mover, plan logistics, real stories); city/state/route directory | Guides a beginner in order | Partly (Next steps card, guides) | A visible step-by-step path across our pages | S | https://www.movebuddha.com/ |
| Move.org | Mover-type comparison table (full service, container, hybrid, hourly labor, truck rental) on loading, driving, storage; median cost by distance for a 3-bedroom (claimed, 2024, from their own quotes) | Explains what each service includes | We compare 3 move types by price; no inclusions table | "What is included" table per move type, no prices needed | S | https://www.move.org/moving-costs/ |
| HireAHelper | Tables per option (labor + truck, labor + container, full service) plus a labor-only add-on; hidden fees list (long carry, stairs, tolls, last-minute booking, tipping); 10% buffer advice | Shows what drives the final bill | Buffer yes (10%); hidden fees partly | Hidden-fee explainer and optional fields for them | S | https://www.hireahelper.com/moving-cost-calculator/ |
| U-Haul | Supply calculator link, storage size guide, moving help quote form, price lock banner | Planning supplies and space | Supplies and size tools no | Packing and truck-size tools | M | https://www.uhaul.com/ |
| U-Pack | States what the rate includes and what it excludes (packing supplies, personal travel, reserve, optional add-ons); change shipment size on the quote screen to see the price move | Clear scope of a quote | Exclusions yes (methodology, "How to read") | Already close; keep the explicit "not included" list | S | https://www.upack.com/articles/moving-cost-calculator |
| 101 Planners | Described inputs: move date (peak, month-end, weekend), specialty items, access (stairs, long carry, elevator), add-ons incl. crew tips, insurance, cleaning; all methods side by side; PDF/print/copy; says it runs in the browser with no email | Fuller cost picture; privacy | Print yes; side by side yes (types, sizes); date, access, specialty no | Optional user-entered access/specialty/tips fields; timing needs a source | S for fields, M for timing | https://www.101planners.com/moving-cost-calculator/ |
| Smooth Move | Methodology page in numbered steps; says range is not a confidence interval; lists what the estimate cannot know; says partner prices are not an input; states how driving distance is approximated (straight line plus 25%); caps on adjustments | Trust | Mostly yes (methodology page, margin note, sources) | Add an independence statement; consider a driving-distance factor only with a defensible source | S / M | https://www.smoothmove.io/estimate-methodology |
| Extra Space Storage | Four tools: truck size calculator, box calculator, moving cost calculator, cost of living calculator; derivation of results not explained | Planning beyond price | Cost of living and size tools no | Truck size, box estimate, city comparison (all need sources) | M to L | https://www.extraspace.com/moving/tools/ |
| Allied | Packing calculator (room or whole house); long-distance, interstate, cross-country calculators; claims forms; checklists only in the menu | Packing planning | no | Packing estimate | M | https://www.allied.com/moving-resources/tools-forms |
| FreightWaves Checkpoint | Local hourly vs long-distance by weight and mileage, worked examples, timing factors, access factors; regulatory notes (released-value and full-value protection, 110% cap on non-binding interstate estimates, tax-deduction note); route pages with comparisons | Explains how a quote is built | Partly | A "reading a quote" guide with regulator-sourced rules | M | https://www.freightwaves.com/checkpoint/moving-cost-calculator |
| MoveAdvisor | Lists add-ons and fees (packing, disassembly, crating, storage, long carry, elevator, bulky item, extra stop), estimate types (binding, non-binding, binding not-to-exceed) | Understand quote types | Partly | Estimate-types explainer | S | https://moveadvisor.com/moving-cost-estimator.php |
| Bankrate | Byline, editor, published and modified dates, cited sources with access dates, "was this helpful" feedback, cost of living calculator link | Editorial trust | Review date and sources yes; no byline or feedback | Helpfulness feedback widget (free) | S | https://www.bankrate.com/mortgages/how-much-does-it-cost-to-move/ |
| North American / NAVL (corporate) | Gross-up and lump-sum calculators written for employers; inputs and outputs not visible | Employers sizing relocation benefits | no | Employee-side tool: compare an employer offer to a realistic budget | M | https://www.northamerican.com/corporate-relocation/resources/calculator-tools |

## Patterns worth keeping

1. Consumer calculators sell leads. We do not collect contact data. Keep "no email, runs in the browser" as a stated promise once we confirm it is literally true for the calculator inputs (assumption: inputs are not sent anywhere; the analytics events carry no amounts. Verify before publishing the claim).
2. Competitors with the most public methodology (Smooth Move) say the range is not a confidence interval. We already say this.
3. Only corporate sites offer relocation-package calculators, and they are for the employer. An employee-side "does my package cover my move" tool looks like open space (assumption, based on the pages above and one search).

## Classification

- **P0 (low risk, no new coefficients)**
  1. Optional user-entered fields for items competitors list: storage, crew tips, specialty items, stairs/long-carry/elevator fees. Same rule as today: default 0, left out of the total until entered.
  2. Hidden-fee and estimate-types explainer (binding, non-binding, not-to-exceed), sourced to FMCSA or the official regulator page before publishing.
  3. Independence statement on the methodology page: affiliate links never change an estimate.
- **P1**
  4. Employer package mode (employee-side gap tool). Keep taxes out of the numbers; link to official tax guidance.
  5. Moving checklist: dated timeline, saved in the browser, printable. No prices involved.
  6. "What is included" table per move type (no prices).
  7. Truck size guide, only with capacities taken from a published truck spec page.
- **P2**
  8. Packing supplies estimate (needs a sourced ratio).
  9. Driving-distance factor on top of straight-line distance (needs a defensible source; it changes the model).
  10. Move-date adjustment (peak, month-end): only with sourced data.
  11. City cost-of-living comparison (already on the roadmap; needs public data).
  12. Helpfulness feedback widget.
- **Reject for now**
  - Container pricing (no sourced data; U-Pack shows no comparison data on the page we saw).
  - Any rate or multiplier that has no public source of our own.
  - Lead-gen forms or quote requests.
  - Local hourly moves (outside our state-to-state scope).

## Proposed order (for the daily plan)

Day 5: P0 item 1 and 3 together (small, safe). Day 6: employer package mode. Day 7: moving checklist. Items 2 and 6 fit between them. P2 items wait for sources.

## Problems seen in this market and how Relocation Cost answers them

Written without naming sites. Each row is a pattern we saw across several tools, and what we do instead.

| Common problem | Our answer | Status |
|---|---|---|
| Numbers on a page that do not agree with each other (a table row repeated for different routes, text that contradicts a table) | One calculation source for every page; tests check the whole size / service / distance grid for ordering and the benchmark floor | Tested (Day 6) |
| Results hidden behind contact details or phone calls | No contact details asked; the estimate shows immediately | In place |
| Rates and multipliers stated without a source | Sourced benchmark shown with its date; assumptions labelled as assumptions on the methodology page | In place |
| Figures that look exact but are only a fixed band | Margin of error stated in plain words, not presented as a statistical interval | In place (Day 4) |
| Employer relocation tools only exist for the employer | Employee-side package gap, with the range and the cash buffer; no tax guesses | Built (Day 6) |
| A zero left in a form that quietly reads as "free" | Zero means "left out of the total", said next to the fields and in the print summary | In place |
| Commercial links mixed into the estimate | Independence statement; the formula ignores partners | In place (Day 5) |

Ideas still to build from these answers: a "reading a quote" guide (needs official sources). Built: the dated checklist (Day 8) and the "what is included" table per move type (Day 10).
