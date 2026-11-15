# Work-log addendum — 2026-11-14 — ChatGPT

Repository: Fadhel-docom/relocation-cost  
Related task: B15 unified price matrix and holdout route checks  
Branch: `docs/b15-unified-matrix-holdout-20261114`

- Read the current OPS-ROOM, BACKLOG, multi-source benchmark plan, competitor audit, and current calculator implementation.
- Refreshed public sources for the 2026 Long Distance Moving report, CMR's size/distance cell counts, This Old House 2025/2026 disclosures, moveBuddha's published 1,000-mile size ranges, and two route-level pages.
- Built a four-source candidate matrix for Studio/1BR, 2BR, 3BR and 4+BR using the owner-approved unweighted arithmetic mean. Means: $2,481; $3,975; $4,783; $9,487 respectively. The report explicitly flags combined 2–3BR proxies, 4BR vs 4+BR mismatch, undisclosed cell counts, and the LDM low-count largest-shipment row.
- Ran two route-level checks against the current calculator move component: Boston→Miami (1,501 mi, outside the target band) and Nashville→Burlington (1,089 mi, inside the band). All six current model comparisons were below moveBuddha's published range midpoint; the report labels this publisher-level evidence, not independent validation.
- Decision: B15 remains active; no pricing coefficient, formula, UI, or production value changed. B16's semantic design may advance, but no legacy multiplier mapping is approved.
- Tests: documentation-only changes; no application tests or build claimed. PR checks will be evaluated separately.
- Not done: no independent second-publisher route holdout; no verified underlying sample overlap; no per-cell n for LDM, moveBuddha or TOH; no B16 implementation.
- Next: obtain stronger independent full-service cell/route observations and provenance; then implement B16 with backward-compatible share-link handling and tests, without altering pricing coefficients.

This addendum is a dated companion to the cumulative `docs/operations/WORK-LOG.md`; it does not claim that the oversized cumulative file itself was rewritten.


## Independent-source follow-up — 2026-11-14

- Searched for a second publisher's route-level price observations and checked ownership before counting sources.
- Found that GoodMigrations was acquired by moveBuddha in May 2023. Its 1,500+ monthly live-quote statement therefore does not make it an independent publisher from moveBuddha; excluded as a second independent source unless separate data lineage is proven.
- Extra Space Storage publishes Boston→Miami estimates by bedroom, but no route-cell n or sufficiently transparent pricing method was found. Candidate-only.
- MoveAdvisor publishes Boston→Miami historical-review ranges and says it derived them from route moving reviews. It lists 107 movers for the route, but that is a directory count, not a price sample count. No price-cell n is disclosed. Candidate-only.
- Move.org offers a 2,500-response 2025 survey and 2024 quote-derived 3BR distance-band medians; neither gives the exact matched full-service route/size cell counts needed for this gate. Use only as broad directional evidence pending clarification.
- MyFastMovers discloses 27,854 model-priced routes and 224 measured corridors, but prices are model estimates rather than observed customer prices; not an empirical holdout.
- Updated the PR #246 discussion with these findings. B15 remains open; no production changes or calibration.
