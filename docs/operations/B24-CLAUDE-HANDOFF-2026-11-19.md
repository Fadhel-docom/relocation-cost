# B24 Claude handoff — VIUS fuel estimator correction

**Prepared:** 2026-11-19  
**PR:** https://github.com/Fadhel-docom/relocation-cost/pull/276  
**Branch:** `research/b24-correct-fuel-aggregation-2026-11-19`  
**Head before this handoff note:** `644e71759476874bab78d344ca064d69b6c59536`

## Requested Claude work

Please perform one focused final review of PR #276 and this handoff note. Review the estimator and statistical method, run the supplied unit tests and the full extraction against the original owner-provided VIUS PUF ZIP if available, correct any defects you find, then merge only if the review and checks pass. If the raw PUF ZIP is not available in your environment, do not infer or invent the exact transformed estimate/CV; leave those outputs explicitly pending.

## What changed

- `tools/b24-vius-box-truck-extract.py`: adds TABWEIGHT-weighted mean of per-record `1/MPG`, plus the RGROUP replicate CV. Fuel cost per truck-mile is regional diesel price multiplied by this gallons-per-mile estimate.
- `docs/operations/B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md`: withdraws the invalid arithmetic-mean-MPG fuel shortcut and describes Claude's audited aggregation sensitivities as scenarios, not a confidence interval.
- `docs/operations/B24-RESEARCH-UPDATE-2026-11-18.md`: corrects the route-fuel equation and preserves the PADD geometry dependency.
- `OPS-ROOM.md` and `docs/operations/WORK-LOG.md`: record the finding, role split and limitations.
- `tools/test_b24_vius_fuel_transform.py`: adds focused tests for transform-before-weighting, TABWEIGHT application, invalid MPG/weight exclusion and RGROUP CV.

## Statistical review points

1. The target estimator is `sum(TABWEIGHT_i / MPG_i) / sum(TABWEIGHT_i)` over valid records. It is not `1 / weighted_mean(MPG)`.
2. Verify that the random-group variance calculation matches the VIUS PUF User Guide for ratio estimates, including the exact treatment of empty RGROUPs and the number of replicate groups. Do not assume that a generic group CV is automatically the official replicate variance.
3. Confirm the valid MPG domain and missing-value handling against the data dictionary. In particular, note the 30 reported MPG values 1–4 identified by Claude; do not silently trim them in the primary estimate. Any trim must remain a labelled sensitivity.
4. The weighted vehicle estimate (1,556 records / 317,285 weighted vehicles) and the MPG-valid subset (1,080 records) have different denominators. Ensure reports do not conflate them.
5. The $0.699–$0.728 national fuel-only range and ~$0.721 mileage-weighted scenario are alternative aggregation scenarios, not a confidence interval. Exact script output and RGROUP CV have not yet been rerun in this ChatGPT session.
6. Check all text for any surviving equation `diesel price / arithmetic mean MPG`. The $0.653 value can still appear as the Gulf Coast regional scenario after applying the corrected per-record estimate; it must not be mistaken for the withdrawn old national shortcut. The old ~$0.875 loaded-mile figure is also withdrawn with that old calculation.

## Run checks

From the repository root:

```bash
python3 -m unittest tools/test_b24_vius_fuel_transform.py -v
python3 tools/b24-vius-box-truck-extract.py /path/to/vius_2021_puf_csv.zip --output /tmp/b24-vius-output.json
```

Inspect `focus_cell.metrics.gallons_per_mile` in the JSON output. Record the exact weighted mean, valid record count, valid weight, number of nonempty RGROUPs and replicate CV in the report. Confirm that it uses the same 1,080-record valid MPG domain Claude audited, or explain any discrepancy.

## Hard boundaries

- Research/data tooling only. Do not change production calculator code, coefficients, prices, route distances or customer-facing claims.
- Do not treat VIUS business-related box trucks as a representative sample of household-goods movers.
- Do not treat the 2021 VIUS maintenance bands as exact costs or infer tires, insurance, depreciation or hours from absent fields.
- BLS May 2025 geographic wages, route polyline-to-PADD allocation, installed tire price/service life, comparable resale/depreciation evidence and actual insurance premiums remain unresolved.
- The EIA price table and mapping still need source-file verification in Claude's environment; do not certify them based only on the notes.
- Keep the PR in draft until the review and tests are complete. Merge only after resolving all review findings.

## Handoff status

The PR was observed open, draft and mergeable on 2026-11-19. Vercel's PR preview deployment reported Ready. No formal Claude review was present at the time of handoff. The owner-uploaded library contains the VIUS guide and data dictionary, but the raw PUF ZIP was not found in the available conversation/library files, and a direct download attempt from the Census FTP endpoint failed in this session. Therefore no fresh full-script run is claimed here.
