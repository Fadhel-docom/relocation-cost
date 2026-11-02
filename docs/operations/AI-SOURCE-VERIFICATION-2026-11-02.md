# AI-answer source and competitor verification — 2026-11-02
**Reviewer:** ChatGPT · **Scope:** read-only source checks; no production edits or publishing.

## 1. U-Haul benchmark source — verified
- Opened the exact source listed in the draft: https://www.uhaul.com/Tips/Loading/How-To-Save-Money-ON-Truck-Rentals-35820/
- The page heading is “How to Save Money on Truck Rentals”; it says **Last Updated: September 10, 2025**.
- It states that one-way prices depend on origin/destination, rental truck size, and rental-truck inventory.
- The page's average one-way price table is estimated for **September 2025** and lists:
  - 0–200 miles: $202
  - 200–500: $444
  - 500–1,000: $995
  - 1,000–1,500: $1,657
  - 1,500–2,000: $2,190
  - 2,000–2,500: $2,694
  - 2,500+: $3,517
- These seven values match the seven values in `data/coefficients.json` exactly. This verifies the source attribution and stated data period for the stored mileage-band benchmark.
- Important boundary: U-Haul itself says the rate varies by origin/destination, truck size and inventory. Do not call these live rates, route-specific quotes, full-service mover prices, or guaranteed prices. Keep the existing model wording: historical mileage-band averages used only as a DIY lower-bound input.
- The separate LA–Phoenix truck-company comparison on the page is based on quotes made three months out in November 2025 and excludes insurance and moving labor; it is not the source of the seven distance-band values.

## 2. IRS primary-source check — verified
- Read the current **Publication 15-B (2026)**: https://www.irs.gov/publications/p15b
- Its “What’s New” section says the exclusion for qualified moving-expense reimbursements is permanently eliminated generally, but retains two relevant exceptions for 2026:
  1. A member of the U.S. Armed Forces on active duty who moves because of a permanent change of station due to military orders.
  2. An employee or new appointee of the intelligence community (other than a member of the Armed Forces) who moves because of a change in assignment requiring relocation.
- Cross-checked the IRS **Tax Topic 455**: https://www.irs.gov/taxtopics/tc455 . It also identifies the Armed Forces and intelligence-community categories, including intelligence-community moves in 2026 or later.
- This is source verification only, not personal tax advice. Any site wording should describe the federal rule at a high level and avoid applying it to an individual's situation.

## 3. Quote-comparison competitors — direct page review
- **MoveDayMap Quote Decoder:** https://movedaymap.com/quote-decoder
  - Displays side-by-side quote fields for transportation, packing, access charges, storage, valuation, other charges and deposits.
  - Tracks unknown/unconfirmed costs, estimate type, mover/broker role, USDOT number, inspection, pickup/delivery, payment terms and exclusions.
  - Generates questions for the mover and expressly says it does not rank or verify providers.
- **Have a Good Move Compare Movers:** https://haveagoodmove.com/compare
  - Compares up to three companies, company identity, federal records and published reviews.
  - Allows comparison of estimated volume and price, and warns when inventories differ.
  - Directs users to a separate Quote Review for inventory, pricing, deposits, exclusions and written terms.
- **CARS Relocation:** the attempted page URL was inaccessible in this review; no claim is made about its current inputs or results.
- Implication: a generic quote-comparison tool is not a proven gap. Existing products already cover substantial comparison workflows. Any future Relocation Cost feature must identify a narrower unmet user need and evidence of demand first.

## 4. Direct AI visibility test and dashboards — not tested
- The direct ChatGPT Search, Google AI Overviews/AI Mode and Microsoft Copilot answer surfaces were not available as directly inspectable interfaces in this session. The web-search results interface is not equivalent to a captured AI answer, so no organic result is labelled an AI citation.
- No direct answer transcript, citation capture, or prompt-level visibility result was produced. The ten-prompt pilot and full 30-prompt benchmark remain **OPEN / NOT TESTED**.
- The connected-tool inventory exposed no Google Search Console Generative AI report or Bing Webmaster AI Performance action. This is an access limitation, not evidence that those reports contain zero data.
- The owner's earlier screenshot of Google’s Generative AI control showed “Include”; that proves the inclusion preference at the time of the screenshot only, not that Google has cited the site.

## 5. Publishing boundary
- These checks do not authorize changing the public AI Answer Pack, calculator, formulas, or production pages. They supply verified source evidence for a later editorial review under the value-before-publishing policy.
