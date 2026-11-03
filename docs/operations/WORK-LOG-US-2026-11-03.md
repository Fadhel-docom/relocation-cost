# Work-log addendum — US market work — 2026-11-03

**Actor:** ChatGPT  
**Branch:** `chatgpt/us-market-value-roadmap-20261103`  
**PR:** https://github.com/Fadhel-docom/relocation-cost/pull/173

## Completed in this continuation
- Rechecked PR #173: Vercel status is now success for the recorded head commit, but GitHub still reports `mergeable=false`; PR remains open and unmerged.
- Rechecked PR #174: merged successfully; the 2024 BEA all-items and services:rents update for all 18 metro records is in main.
- Researched the 2025 ACS 1-year Summary File path. Confirmed the Census Bureau publishes a table-based file with estimates and margins of error, a separate geography file, and a table list. The 2025 FTP directory explicitly lists the B25064 data file.
- Corrected the acquisition assumption: a Census API key is not required to obtain the B25064 data; the official Summary File is an alternate route.
- Confirmed B25064 is Median Gross Rent (Dollars), universe renter-occupied housing units paying cash rent. Recorded estimate, 90% MOE and annotation fields to retain.
- Created `US-ACS-2025-RETRIEVAL-AND-QUALITY-GATE-2026-11-03.md` and this operations-room addendum.

## Verification limits
- The current runtime could not resolve the Census FTP host, so the B25064 data file was not downloaded or parsed. No 2025 MSA GEOIDs, rent values or MOEs are claimed.
- No production data import, public city-page change, calculator formula/coefficient/range change, new city, deployment, indexing request, road-distance adoption or outreach was performed.
- PR #173 Vercel status is success, but `mergeable=false` remains unresolved; do not merge on this status alone.

## Next actions
1. Use the 2025 geography file to resolve exact MSA GEOIDs for all 18 markets.
2. Parse B25064 from the official 2025 table-based Summary File and join by official geography keys.
3. Validate estimate/MOE/annotations and all joins against data.census.gov.
4. Continue exact BLS OEWS area-ID mapping and official municipal-rule research.
5. Score source completeness and visitor value before approving any 2–3-city pilot.
6. Keep the international workstream separate until Claude's review is complete.


## Continuation — ACS route + PR verification | 2026-11-03 (ChatGPT)

- Verified Vercel status for the earlier PR #173 head is now `success`; PR #173 remains open/unmerged and has no recorded review. The workflow-run lookup returned no runs, so do not infer all CI checks from Vercel alone.
- Added `docs/operations/US-ACS-2025-RETRIEVAL-AND-QUALITY-GATE-2026-11-03.md`, documenting the official 2025 ACS B25064 Summary File route, estimate/MOE/annotation fields, geography join, validation and publication gates.
- Updated `OPS-ROOM.md` with the handoff and next actions.
- Still not completed: downloading/parsing 2025 ACS geography and B25064 files, exact 18 MSA GEOIDs, BLS OEWS IDs, municipal rule verification, pilot selection, production imports, city pages, formula changes, outreach or indexing.
- Source references are listed in the new retrieval-and-quality-gate report. The Census Summary File is the alternative to requiring an API key; actual values must still be parsed and checked, not guessed.
