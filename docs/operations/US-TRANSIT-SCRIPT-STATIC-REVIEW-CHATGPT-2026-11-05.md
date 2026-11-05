# Static review of US transit check script — ChatGPT — 2026-11-05

Repository: Fadhel-docom/relocation-cost  
Reviewed branch: exp/us-transit-check  
File: tools/expansion/ors-us-transit.mjs  
Related record: PR #186, docs/operations/EXPANSION-QUOTA-AND-US-TRANSIT-CLAUDE2-2026-11-05.md  
Scope: static code review only. The script was not run; no API key was read or copied; no HeiGIT request was sent.

## Verdict

The script has a useful structure: it reads the production state-pair set, checks routes using ORS countryinfo and Natural Earth polygons, saves progress periodically, and has a self-imposed request cap. It is not ready for a live run yet because several details affect quota safety, crossing detection, reproducibility, and preservation of progress.

## Required corrections before execution

1. **The per-run cap is not the remaining account quota.** MAX_REQUESTS=190 limits attempts in one execution only. The script does not verify the current remaining balance or account for prior usage in the active quota window. The operator must record a fresh account balance and set a lower run cap with a safety margin. Do not run without that measurement.
2. **The polygon check is not a complete segment-intersection test.** crossings() checks whether route vertices are inside the polygon and sums distances only when consecutive vertices are both inside. It does not directly intersect each route segment with polygon boundaries. A segment could theoretically cross a narrow polygon between two outside vertices, and entry/exit coordinates are approximate. Add a test for this case or explicitly label the polygon method as approximate corroboration, not independent proof.
3. **The Natural Earth source is not version-pinned.** The URL points to master. Pin a release/commit or record a checksum for the GeoJSON and include it in run metadata.
4. **GeoJSON loading lacks response validation.** loadCountry() does not check res.ok or verify that CAN and MEX geometries exist before indexing. Add explicit checks and fail safely.
5. **Network/JSON exceptions can lose recent progress.** A fetch exception or invalid JSON may terminate the process before the next periodic save. Catch these failures, preserve the current output before exiting, and do not classify them as “no crossing.”
6. **Separate crossing status from rerun-distance quality.** A rerun_diff_pct warning or failed rerun must not alter the border-crossing classification. Failed routes remain unresolved, not “no crossing.”
7. **Expand geometry tests.** Existing point tests are a useful start but do not cover a narrow crossing between outside vertices, complex boundaries/holes, or sub-2-km crossings. Add such tests or document the precision limits.

## Good design choices to preserve

- Inputs use state-centre coordinates and radiuses=[-1,-1], matching the production builder described in the report.
- ORS countryinfo and a geographic polygon check provide two distinct evidence methods.
- The script checks Mexico as well as Canada.
- It can resume by skipping records with status === 'ok'.
- Periodic saves and a self-imposed request cap are good safeguards, but need the improvements above.

## Operational decision

- No HeiGIT execution until the owner records the actual remaining balance from the account dashboard and explicitly authorizes the specific run.
- Do not adopt the Canada/Mexico results, merge data/expansion-us/, or change production data before reviewing the complete report and all disagreements between methods.
- The final report must show checked/unresolved route counts, crossings by each method, disagreements, US-only alternatives, rerun differences, and the pinned boundary-data source.

Status: static review complete. Script corrections, live execution, and actual results remain outstanding.
