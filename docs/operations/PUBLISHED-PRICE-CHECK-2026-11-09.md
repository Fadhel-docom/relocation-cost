# Published-price check, 2026-11-09 (read-only; no coefficient changed)

Purpose: the owner cannot collect US quotes, so we compare the calculator with route-specific figures that trusted sites have published. Reproduce with `node tools/published-price-check.mjs`.

## Sources read on 2026-11-09 (via WebFetch summaries, not line-by-line)
1. PODS blog, "cost of moving" (https://www.pods.com/en-us/blog/cost-of-moving): posted 2026-07-08, estimates "as of June 2026", USD, excluding insurance and taxes. Worked examples with stated miles for PODS, full-service movers and rental truck (plus fuel). Caveats: written by a container vendor; ranges are wide; the page repeats one family's data in the table and gives different numbers for another family in text (we used the table values for St. Louis to Sarasota; text gives $4,412-$7,359 for full service).
2. This Old House, moving costs (https://www.thisoldhouse.com/moving/moving-costs): updated 2026-06-12, based on its 2025 survey of 1,000 moving customers; averages by home size and distance band. Caveats: the table is not labelled full-service (customers who hired movers are the closest match); averages only, no ranges; some cells look odd (1-bed 1,701+ miles: $2,916 is below the 3-bed average but close to our studio).
3. FreightWaves PODS cost page was read but not used: container prices, no home-size mapping.

## Comparison (our full-service total with its +/-20% band vs published figure)
Home-size mapping is an assumption (studio and 1-bed to 1 or 1.35; 2-bed to 1.35 or 1.8; 3-bed to 1.8 or 2.4).

| Route | Ours (band) | This Old House average | PODS blog range |
|---|---|---|---|
| Studio, Detroit to Los Angeles, 2,252 mi | $4,351 ($3,481-$5,221) | no studio cell | $3,257-$5,658: mostly overlaps |
| 1-bed, Raleigh to Ocala, 562 mi | $1,441-$1,562 (to $1,874) | $1,999: above our band | $2,274-$4,692: entirely above |
| 2-bed, Charleston to New Orleans, 785 mi | $1,747-$1,965 (to $2,358) | $2,087: inside | $2,609-$5,757: entirely above |
| 2-bed, St. Louis to Sarasota, 1,103 mi | $2,740-$3,046 (to $3,655) | $2,668: inside | $3,240-$6,872: lower end inside |
| 3-bed, Oklahoma City to Boston, 1,695 mi | $4,288-$4,915 (to $5,898) | $4,253: inside | $5,370-$8,346: lower end inside for 2.4 only |

DIY check: our DIY totals (including the 10% contingency and the U-Haul floor) sit at or slightly above the published rental-truck ranges (plus fuel), e.g. Raleigh to Ocala $1,095 vs $593-$1,041.

## Reading
- Against customer-paid averages (This Old House), our full-service total is inside the band in 3 of 4 comparable cells and about 7-16% low for the short 1-bed route. Against the PODS ranges we sit at or below the lower end for most routes. The two sources disagree with each other, so this is not enough to change any coefficient.
- Hypothesis only: our full-service figure may run low for shorter routes and small homes. Test by adding more dated route-specific figures from named sources before touching the model.
- Not shown here: any claim that the calculator is accurate. Five cells from two sources, one of them a vendor blog, do not establish that.
- Rule kept: no coefficient change without enough dated observations; no data copied beyond the figures above, each with source and date.
