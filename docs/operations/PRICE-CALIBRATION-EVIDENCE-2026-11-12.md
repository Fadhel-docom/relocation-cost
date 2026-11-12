# Price calibration evidence — 2026-11-12 (B13; cross-check only)

## New source reviewed

**This Old House, “How Much Does Moving Cost in 2026?”** — updated 2026-06-12; reports a 2025 survey of 1,000 moving customers. The page provides average costs by distance band and bedroom count. It says the distance figures are averages across different home sizes; the page also explains that household weight and service type affect cost. Methodology section says the editorial team surveyed 1,000 customers and gathered five quotes per mover for a two-bedroom move between 500 and 800 miles. Source: https://www.thisoldhouse.com/moving/moving-costs (reviewed 2026-11-12; sections “Moving Cost by Distance”, “Moving Cost by Home Size”, “Our Rating Methodology”).

### Published customer-survey averages (USD)

| Distance band | 1 bedroom | 2 bedrooms | 3 bedrooms | 4 bedrooms |
|---|---:|---:|---:|---:|
| 501–800 mi | 1,999 | 2,087 | 3,249 | 7,016 |
| 801–1,100 mi | 2,424 | 2,450 | 3,704 | 6,348 |
| 1,101–1,400 mi | 2,485 | 2,668 | 3,913 | 6,207 |
| 1,401–1,700 mi | 2,434 | 2,981 | 4,253 | 8,513 |
| 1,701+ mi | 2,916 | 3,351 | 5,064 | 9,228 |

The source's 2025 survey also reports overall average-by-distance values: $2,786 for 501–800 miles, $3,201 for 801–1,000, $3,260 for 1,001–1,400, $3,453 for 1,401–1,700 and $3,945 for 1,701+.

## Comparison boundary

This is a useful additional customer-survey cross-check, but **not a calibration-ready matched dataset**: the public page does not expose route-level observations, per-cell sample sizes, sampling method, or a clean split between full-service, self-service and other move types for the bedroom table. Its averages are not directly interchangeable with a model output labelled full-service. The calculator's current size controls are room bands, not bedroom/weight bands, so no exact size crosswalk is justified.

No coefficient, formula, label or published page changed. Do not fit the model to these averages. B13 remains blocked pending at least 3–5 independent, dated, comparable observations with route/distance, shipment size/weight and service scope, plus a holdout test. The source does strengthen the case for keeping the limitation visible and for eventually testing a weight-based size input rather than implying that room count equals bedrooms.

## Calculator reference outputs (current model, no add-ons, full-service, incl. 10% contingency)

For context only, at representative distances the current model produces these totals and its fixed 80%–120% planning bands:

| Miles | Size multiplier 1.0 | 1.35 | 1.8 | 2.4 |
|---:|---:|---:|---:|---:|
| 650 | $1,495 ($1,196–$1,794) | $1,635 ($1,308–$1,962) | $1,815 ($1,452–$2,178) | $2,055 ($1,644–$2,467) |
| 950 | $1,680 ($1,344–$2,016) | $1,885 ($1,508–$2,261) | $2,148 ($1,718–$2,577) | $2,702 ($2,162–$3,243) |
| 1,550 | $3,364 ($2,691–$4,037) | $3,698 ($2,958–$4,438) | $4,128 ($3,302–$4,953) | $4,701 ($3,760–$5,641) |

These outputs are **not a direct row-by-row accuracy comparison** with the survey table because the distance bands and home-size definitions differ. The band is a planning range, not a statistical confidence interval.
