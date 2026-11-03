# Work-log addendum — US market work — 2026-11-03

**Actor:** ChatGPT  
**Branch:** `chatgpt/us-market-value-roadmap-20261103`  
**PR:** https://github.com/Fadhel-docom/relocation-cost/pull/173

## Completed in this continuation
- Rechecked PR #173 and PR #174. PR #174 is merged; PR #173 remains open and unmerged.
- Compared the PR branch with main: 14 commits ahead and 2 behind; histories diverged after PR #174 merged. GitHub reports `mergeable=false`.
- The latest Vercel status for the latest documentation head is pending. An earlier head had success, but that does not establish success for the current head.
- Researched the 2025 ACS 1-year Summary File path. Confirmed the Census Bureau publishes a table-based file with estimates and margins of error, a separate geography file, and a table list. The 2025 FTP directory explicitly lists the B25064 data file.
- Corrected the acquisition assumption: a Census API key is not required to obtain the B25064 data; the official Summary File is an alternate route.
- Confirmed B25064 is Median Gross Rent (Dollars), universe renter-occupied housing units paying cash rent. Recorded estimate, 90% MOE and annotation fields to retain.
- Created `US-ACS-2025-RETRIEVAL-AND-QUALITY-GATE-2026-11-03.md`.
- Created `US-RELOCATION-CASHFLOW-MVP-SPEC-2026-11-03.md`, a non-binding product specification for a local-only, date-aware cash-flow workflow. It separates employer lump sums, direct payments and reimbursements, and defines tests for delayed/partial/denied reimbursements and first-pay timing.
- Created/updated `US-OPS-ROOM-ADDENDUM-2026-11-03.md` with findings, limits and Claude handoff.

## Verification limits
- The current runtime could not resolve the Census FTP host, so the B25064 data file was not downloaded or parsed. No 2025 MSA GEOIDs, rent values or MOEs are claimed.
- The cash-flow work is specification only; no implementation or user validation was performed.
- No production data import, public city-page change, calculator formula/coefficient/range change, new city, deployment, indexing request, road-distance adoption or outreach was performed.
- PR #173 must not be merged while it is diverged/behind main, mergeability is false, and the latest Vercel status is pending.

## Next actions
1. Reconcile the PR branch with main without losing the PR #174 merge or any existing changes.
2. Use the 2025 geography file to resolve exact MSA GEOIDs for all 18 markets.
3. Parse B25064 from the official 2025 table-based Summary File and join by official geography keys.
4. Validate estimate/MOE/annotations and all joins against data.census.gov.
5. Independently review the cash-flow specification; test the calculations and validate user value before implementation.
6. Continue exact BLS OEWS area-ID mapping and official municipal-rule research.
7. Score source completeness and visitor value before approving any 2–3-city pilot.
8. Keep the international workstream separate until Claude's review is complete.


## BLS geography-source follow-up — 2026-11-03 (ChatGPT)

- Confirmed the BLS May 2025 OEWS metro-area page and documentation identify the official May 2025 MSA definitions XLSX; technical notes say OEWS uses OMB Bulletin 23-01 definitions.
- Source links and the precise limitation are recorded in `OPS-ROOM.md`. The XLSX could not be downloaded in this runtime, so exact BLS area IDs and county membership remain open. No area IDs were guessed, and no wages were imported or used as moving-price evidence.
