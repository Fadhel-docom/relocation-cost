# B15 — source-backed full-service price ranges — 2026-11-15

## Decision

Per the owner's 2026-11-15 instruction, do not use a single cross-publisher arithmetic average as the calculator's market reference. Keep each publisher's observed distribution visible as a range, with its median and cell sample count retained as separate metadata. Do not blend unlike central statistics (median, mean, range midpoint) or unlike service definitions.

## Dataset implemented

data/cmr-full-service-ranges.json stores Consumer Moving Reviews (CMR) middle-half booked-price ranges by road-distance band and approximate shipment-volume group:

| Road miles | Studio / 1BR | About 2BR | About 3BR | 4+BR |
|---|---:|---:|---:|---:|
| 100–499 | $1,780–$2,150 (n=46) | $2,460–$3,420 (n=90) | $4,330–$5,540 (n=33) | $6,390–$8,580 (n=24) |
| 500–999 | $1,920–$2,320 (n=110) | $2,660–$3,590 (n=106) | $4,570–$5,920 (n=50) | $6,770–$10,000 (n=40) |
| 1,000–1,499 | $1,890–$2,420 (n=144) | $2,720–$3,990 (n=121) | $4,620–$6,090 (n=39) | $7,620–$11,020 (n=47) |
| 1,500–1,999 | $2,170–$2,990 (n=55) | $3,160–$4,130 (n=37) | $5,430–$6,700 (n=21) | $8,010–$11,560 (n=35*) |
| 2,000+ | $2,240–$3,000 (n=64) | $3,210–$4,840 (n=50) | $5,350–$7,350 (n=21) | $9,320–$11,180 (n=21) |

The bounds are the 25th and 75th percentiles (middle half), not the lowest/highest quote and not a confidence interval. Median and n are stored per cell. * The 4+BR 1,500–1,999 mile cell uses the longer December 2022–September 2026 period.

## Calculator behavior in this PR

- For full-service moves with a matching CMR distance/size cell, the calculator displays a separate published booked-price range.
- It adds the visitor's entered other costs and the 10% contingency to both ends of that range.
- It does not replace the existing model point estimate or average it with CMR; the model estimate and its fixed ±20% planning band remain separately labeled.
- DIY and rental-truck-with-labor keep the current model because this source table covers full-service bookings only.
- Distances below 100 miles have no CMR reference range; no extrapolation is invented.
- B16 labels use the corresponding bedroom/shipment-volume groups while keeping the existing numeric option values (1, 1.35, 1.8, 2.4) so existing shared URLs continue to parse. The model multipliers themselves are not changed in this PR.

## Why this is not final calibration

CMR reports 2,046 booked moves overall and provides per-cell counts, but it is one mover network, not the whole US market. Some cells are small (n=21–24), and the 4+BR 1,500–1,999 cell uses a longer sample period.

A second publisher, Long Distance Moving, reports 543 booked interstate moves and separate size/weight and distance-band summaries. Its 4+BR / over-9,000-lb median for 600–1,700 miles is $16,790, with a published lower/upper-quarter range of $13,720–$21,590. That differs materially from CMR's 4+BR 1,000–1,499-mile range of $7,620–$11,020. The size groups, distance bands and sampling frames are not identical; the figures must remain separate, not averaged.

The previous route holdouts (moveBuddha and My Good Movers) also show a persistent gap for the largest size group. Therefore:
- Do not change production price coefficients in this PR.
- Do not claim the calculator is nationally calibrated.
- Keep B15 open until another comparable, sufficiently disclosed dataset or independent holdout clarifies the 4+BR discrepancy and ownership/data overlap.
- Use the range as a transparent source reference, not as a promise of what a particular mover will charge.

## Sources

- CMR 2026 booked-price report (updated 2026-10-23): https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/
- CMR 100–499 mile route example and per-cell counts: https://www.consumermovingreviews.com/routes/movers-from-san-jose-ca-95125-to-north-las-vegas-nv-89085/
- CMR 500–999 mile route example: https://www.consumermovingreviews.com/routes/movers-from-bridgeport-ct-06606-to-salisbury-nc-28146/
- CMR 1,000–1,499 mile route example: https://www.consumermovingreviews.com/routes/movers-from-austin-tx-78753-to-salt-lake-city-ut-84116/
- CMR 1,500–1,999 mile route example: https://www.consumermovingreviews.com/routes/movers-from-fort-ashby-wv-26719-to-aransas-pass-tx-78335/
- CMR 2,000+ mile route example: https://www.consumermovingreviews.com/routes/movers-from-austin-tx-78729-to-portland-or-97220/
- Long Distance Moving 2026 report (543 booked interstate moves): https://longdistancemoving.com/national-moving/moving-cost-report-2026
- Existing route holdouts and limitations: docs/operations/B15-UNIFIED-MATRIX-HOLDOUT-2026-11-14.md
