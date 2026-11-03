# Road distance builder (R4) — generated dataset reviewed
**Date:** 2026-11-02 · **Review:** ChatGPT · **Status:** data generated on a separate branch; not consumed by the website.

## Verified generated data
- Dataset branch: `data/road-distances`; generated at 2026-11-02T13:08:38Z.
- 1,220 unordered pairs: 1,127 successful state pairs + 44 successful city pairs = 1,171 successes; 49 failures.
- Failure breakdown: 46 state pairs containing AK returned `http_404_2010` (official error code means **point not found**, not proof that no road exists); AK|FL returned `http_400_2004` (parameter exceeds maximum; driving Directions has a 6,000 km route limit); ID|TN and AK|RI returned network errors. The two network errors are transient candidates; the others should not be blindly retried.
- No entries were rejected by the straight-line ratio check; no entries were flagged. This is a first-pass dataset, not yet validated for calculator use.

## API, quota, and licensing
- Requests were made to `https://api.heigit.org/openrouteservice/v2/directions/driving-car/json` (**Directions, not Matrix**). This explains the 1,220 API calls; the earlier Matrix optimisation was not used by this builder.
- Official ORS FAQ documents Standard Directions limits as 2,000 requests/day and 40/minute; the builder's 1.7-second spacing is about 35.3/minute. Dashboard usage is key-specific; a full 2,000/2,000 remaining screenshot was reported before the batch, but it does not prove the remaining quota after the batch.
- HeiGIT staff directly confirmed commercial use under Standard and that API results are licensed **CC-BY-SA 4.0**. Staff also answered a Matrix persistence question allowing stored/reused results subject to the Terms of Service. The full current Terms page was not independently readable in this review; do not overstate the scope of that answer.
- Dataset metadata must not label API results as ODbL-only. Record both: API results CC-BY-SA 4.0; underlying OpenStreetMap data attribution/licence ODbL 1.0. The precise required attribution wording must be checked against current Terms before public adoption.

## Review corrections made in this PR
- Corrected dataset licence metadata to distinguish ORS API results from underlying OSM data.
- Retry mode now targets transient network, 429, and 5xx failures only; it skips permanent point-not-found and route-limit failures.
- Network exceptions receive up to two bounded retries before being stored as failed.
- Added a unit test for the retry filter.

## Remaining validation before adoption
1. Retry only the two transient failures, using the updated workflow after this PR is merged; do not retry the 47 provider/data failures blindly.
2. Review state-point snapping quality and inspect ratios/route plausibility, especially points near borders and remote state centres.
3. Compare 20 representative routes against independent route-distance evidence and measure changes to displayed U-Haul bands/totals.
4. Keep this dataset isolated from production until after the 2026-11-05 GSC gate and a separate adoption PR. Straight-line calculation remains the production fallback; no calculator formula or coefficient changes are authorised here.
