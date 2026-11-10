# Published-price check 2, 2026-11-10 (B2; read-only, no coefficient changed)

Continues `PUBLISHED-PRICE-CHECK-2026-11-09.md`. Purpose: test the hypothesis that our full-service total runs low, using more dated figures from named sources. Reproduce with `node tools/published-price-check.mjs` (the second block of output).

## Sources read on 2026-11-10 (WebFetch summaries, not line-by-line)
1. **HireAHelper, moving costs** (https://www.hireahelper.com/advice/moving-costs/): "Last updated Jul 13, 2026" (metadata says 2026-07-23). Own marketplace data, "a study of 300,000 local moves between 2018 and 2024, refreshed annually", 50,000+ moves in the latest year. Gives local full-service by home size (studio/1BR $791-$1,099; 2BR, 20 miles, $1,038-$1,441), a long-distance table with no distance stated (2-3 BR $2,910-$4,569), and one route: New York to Miami, 1,280 miles, 2-3 BR, full service $5,359-$8,226. Caveat on the page: companies usually have minimums (two movers, at least two hours). Its own text cites both 2024 and 2025 as the data year.
2. **Opendoor article** (https://www.opendoor.com/articles/how-much-it-costs-to-move-everything-you-need-to-consider): updated 2026-04-20, "AI-powered research" with editorial review. A compilation of Forbes Home, HomeAdvisor, AMSA, MoveBuddha, North American Van Lines, Move.org and PODS. Full-service by home size at 1,000 miles, plus a table credited to North American Van Lines at 500, 1,000 and 2,000+ miles. It says prices "reflect the time of writing" and packing/insurance are extra. **Not independent of the other sources it compiles.**
3. **Angi, 3-bedroom house long distance** (https://angi.com/articles/cost-to-move-3-bedroom-house.htm): "[2025 Data]" in the title, no page date. 1,000+ miles $3,100-$6,000; 2,500+ miles $4,200-$8,600; says a long-distance flat rate "takes into account mileage, tolls, gas, and labor". Method not described on the page.
4. **ConsumerAffairs** (updated 2026-05-27): long distance ("more than 1,000 miles") "typically around $5,000", up to $10,000; no home size; method for the mover prices not described. Not counted in the table.
5. **MoveBuddha** (last modified 2026-11-04): no size or distance table, only 19 participant quotes at 2,036-3,134 miles (median $4,500, range $2,469-$15,000), no home size, services not stated, mixes container, truck-rental and mover firms. Not counted in the table.

## Result (18 comparable cells; our full-service total vs the published range)
The verdict uses the home size most favourable to us, so the bedroom-to-size mapping cannot be what produces a "below" result. Our total includes the 10% contingency, which also favours us against move-only prices.

| Distance | Cells | Inside the published range | Our total below it, band reaches it | Published range entirely above our band |
|---|---|---|---|---|
| 20 miles (HireAHelper local) | 2 | 0 | 0 | 2 |
| 500 to 1,280 miles | 12 | 1 | 3 | 8 |
| 2,000 to 2,500 miles | 4 | 3 | 1 | 0 |

Examples (published range vs our total at the best-case size): 2-3 BR New York to Miami 1,280 mi $5,359-$8,226 vs $2,887-$3,715 (band top $4,458); 3 BR at 1,000 mi $4,500-$7,500 (NAVL) vs $2,215-$2,824; 1 BR at 500 mi $1,500-$2,800 vs $893-$1,071; 1 BR at 20 miles $791-$1,099 vs $405-$412; 2 BR at 2,000+ mi $4,000-$7,000 vs $4,072-$4,627 (inside).

## Reading
- The earlier hypothesis ("low on short routes and small homes") is refined: the gap depends on distance. Published full-service ranges rise slowly with distance (North American Van Lines, 1 BR: $1,500-$2,800 at 500 mi, $2,000-$3,500 at 1,000, $2,500-$4,500 at 2,000+). Our full-service total rises much faster (1 room: $893, $1,711, $3,641 at the same miles). So we look low up to roughly 1,300 miles and in line from about 2,000 miles.
- The 20-mile result matters on its own: $405-$434 is below what a two-mover, two-hour minimum implies, so the calculator should not be read as a quote for very short moves.
- The customer-paid average used on 2026-11-09 (This Old House) is lower than these published ranges and sat inside our band, so the two kinds of source disagree: vendor and compilation ranges against what customers say they paid. This check does not say which is closer to reality.

## What this does not show
- Not a measure of accuracy and not a quote. Ranges from vendors and compilations are not paid prices.
- Sources are not independent (Opendoor repeats the North American Van Lines and Forbes/Move.org tables; 13 of the 18 cells come from that one page).
- The bedroom-to-size mapping is an assumption (calculator sizes are labelled by rooms).
- What is included differs: Angi's flat rate includes mileage, tolls, gas and labor; the Opendoor table excludes packing and insurance; HireAHelper local figures are hourly with minimums.
- Angi's page has no date; "2,000+" and "2,500+" bands are compared at their lower bound.
- Page text came through WebFetch summaries; the HireAHelper table and the Opendoor tables should be re-read in full before any figure is published on the site.

## Decision left open (B13)
No coefficient is changed: backlog rule X7 asks for 3-5 dated figures for the same route and size from named sources, and these are ranges from partly overlapping sources. B13 records what a change would need (a distance-slope model tested on cells not used to fit it, and the owner informed).


## Full-page source re-read — 2026-11-10 (ChatGPT; exact tables)

The two pages named in Claude's Day 82 handoff were opened and read in full on 2026-11-10. This replaces the earlier limitation that their tables had only been read through WebFetch summaries.

### HireAHelper — updated July 13, 2026
Source: https://www.hireahelper.com/advice/moving-costs/ (page lines 69–101, 143–205, 179–190).

- The page states $100–$150/hour for a two-person full-service team and says local movers commonly impose a two-mover, two-hour minimum (lines 102–125).
- Exact 20-mile, 2-bedroom local full-service total: **$1,038–$1,441** (lines 143–155).
- Exact New York City–Miami example: 1,280 miles, 2–3 bedrooms, full-service **$5,359–$8,226** (lines 179–190).
- Its generic 2–3-bedroom long-distance full-service table is **$2,910–$4,569**, but no distance is supplied, so it is not a route-distance comparison (lines 160–178).
- Long-distance table by home-size band (distance is not supplied): studio/1BR **$2,339–$3,249**; 1,500 sq ft **$3,034–$4,214**; 2,000 sq ft **$3,367–$4,676**; 3,000 sq ft **$3,949–$5,484**; 4BR+/4,000 sq ft **$4,478–$6,219** (lines 193–205). These figures are not used in the route-distance table.
- **Source-period inconsistency:** the introduction says over 50,000 local moves in 2025 (line 74), while the methodology paragraph says over 50,000 moves analyzed in 2024 (lines 100–101). We do not publish a sample denominator from this page.
- HireAHelper describes these as proprietary marketplace data, not an independently audited or random national sample. The source itself notes that scope and minimums matter.

### Opendoor — updated April 20, 2026
Source: https://www.opendoor.com/articles/how-much-it-costs-to-move-everything-you-need-to-consider (page lines 8–9, 43–52, 79–92, 93–104).

**Quick summary table (full-service; local under 50 miles / long-distance at 1,000 miles):**

| Home size | Local | 1,000 miles |
|---|---:|---:|
| Studio / 1 bedroom | $400–$1,200 | $1,500–$3,500 |
| 2 bedrooms | $800–$2,200 | $2,500–$5,500 |
| 3 bedrooms | $1,200–$3,200 | $3,500–$7,500 |
| 4 bedrooms | $1,800–$4,500 | $5,000–$10,000 |
| 5+ bedrooms | $2,500–$6,000+ | $7,000–$14,000+ |

The page says packing, specialty items and insurance add to these ranges (line 52); it attributes this summary to Forbes Home and HomeAdvisor.

**Long-distance table explicitly attributed by Opendoor to North American Van Lines:**

| Home size | 500 miles | 1,000 miles | 2,000+ miles |
|---|---:|---:|---:|
| 1 bedroom (2,000–3,000 lbs) | $1,500–$2,800 | $2,000–$3,500 | $2,500–$4,500 |
| 2 bedrooms (5,000–6,000 lbs) | $2,500–$4,200 | $3,200–$5,500 | $4,000–$7,000 |
| 3 bedrooms (8,000–10,000 lbs) | $3,500–$5,800 | $4,500–$7,500 | $5,500–$9,500 |
| 4 bedrooms (12,000–15,000 lbs) | $5,000–$8,000 | $6,500–$10,000 | $8,000–$14,000 |

- Opendoor says long-distance prices are based on shipment weight and distance, and notes fuel surcharges, shuttle fees and long-carry fees can apply (lines 79–92).
- The direct North American Van Lines URL linked by Opendoor was not independently retrieved in this review (cache miss). Therefore the table is described on the public page as **Opendoor's table attributed to NAVL**, not as a directly verified NAVL rate sheet.
- The Opendoor page is one secondary source. Its tables and other summary figures should not be counted as independent datasets or independent observations.

### Calculation reproduction for the five examples shown on /methodology/

The table is calculated from the live calculateBudget() function, with type: 1.65 (full-service), no user-entered add-ons, and the largest tested room multiplier chosen for each bedroom category. The model's fixed 80%–120% band is shown as a planning band, not a confidence interval.

| Case | Multiplier | Published range | Model point | Model band |
|---|---:|---:|---:|---:|
| HireAHelper, local 20 mi, 2BR | 1.8 | $1,038–$1,441 | $422 | $337–$506 |
| Opendoor/NAVL-attributed, 500 mi, 1BR | 1.35 | $1,500–$2,800 | $1,071 | $857–$1,285 |
| Opendoor/NAVL-attributed, 1,000 mi, 2BR | 1.8 | $3,200–$5,500 | $2,215 | $1,772–$2,657 |
| HireAHelper, NYC–Miami 1,280 mi, 2–3BR | 2.4 | $5,359–$8,226 | $3,715 | $2,972–$4,458 |
| Opendoor/NAVL-attributed, 2,000+ mi, 2BR (evaluated at 2,000) | 1.8 | $4,000–$7,000 | $4,627 | $3,701–$5,552 |

This confirms the source tables and the exact values used by the site section. It does not resolve the calibration gap. B13 remains blocked under rule X7 until we have 3–5 independent dated observations matched by route, home size and service scope, plus a holdout test for any candidate model. No coefficients or formulas changed.
