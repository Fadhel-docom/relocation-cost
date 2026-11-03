# HeiGIT Terms of Service — what the text says for R4 (road distances)
**Date:** 2026-11-03 · **Reader:** Claude (first) · **Source:** the full text of account.heigit.org/info/tos, pasted by the owner from his browser (attachment, 107 lines). **Not legal advice.** Claude cannot confirm the page is unchanged: the text itself says HeiGIT may change the terms at any time, effective on posting.

## What the text says (line numbers refer to the pasted text)
- **Attribution (l.49–52):** "make sure to have the proper attribution in your API implementation, site, or other properties". For openrouteservice the text is exactly: `© openrouteservice by HeiGIT | Data from OpenStreetMap`.
- **Licence of results (l.53):** "Results obtained from openrouteservice in any context are licensed under CC-BY-SA 4.0." This confirms what ChatGPT reported from a staff reply. The stored distance table is a set of such results.
- **OpenStreetMap (l.40):** OSM data obtained through the service must also follow the OSM Foundation terms of use.
- **Personal data (l.39):** sending personal data is prohibited. The builder sends only the coordinates of state and city points, no user data.
- **Usage limits (l.78–85):** one account per person; exceeding limits or hammering the API can block the account. The builder runs at 1.7 s per request, under the 40/min limit, in a single manual run.
- **Entity (l.13–14):** a company or entity may enter the agreement; this is the only hint about business use in the text.
- **Liability and accuracy (l.11, 17, 95):** no guarantee of correctness; routing results may contain errors. Consistent with the site's "planning estimate, not a quote" wording.

## What the text does NOT say
- **Commercial use:** neither allowed nor forbidden in this text. Evidence outside it: the plans page (read by Claude on 2026-11-02) excludes commercial use only from the separate Collaborative plan, and a staff reply of 2026-10-12 (reported by ChatGPT, thread not readable by Claude) says commercial use is allowed on Standard.
- **Storing or caching results:** the supplied Terms text contains no explicit storage, caching, retention or deletion clause. The statement that results are CC-BY-SA 4.0 identifies the licence applied to results, but it does not by itself answer every contract question about API storage/caching or retention. Do not infer a separate contractual permission or prohibition from silence; request written clarification from HeiGIT and keep the dataset isolated until the question is resolved.
- **Whether a lookup table used inside a calculator is "adapted material"** under CC-BY-SA share-alike: the terms do not say, and the staff reply declined to interpret. **This stays open.**

## What follows (a careful reading, not a legal conclusion)
1. The table is a result set under CC-BY-SA 4.0. The repository is **public** and has no licence file, so the table on the branch `data/road-distances` is already shared publicly: it must carry the licence and the attribution above. **Its embedded licence said "ODbL" only; that was wrong and is fixed in this change** (field `data_licence`, new fields `attribution`, `licence_url`, `terms`; a test guards the exact attribution string). The workflow was re-run with no pending pair (zero API requests) to rewrite the metadata.
2. If the site ever reads the table, the browser receives it (the calculator runs client-side), which is distribution. A conservative technical separation is to keep the table as its **own file with its own CC-BY-SA 4.0 notice and attribution**, show the attribution on the page, and keep the site code separate from the data. This is a risk-reduction measure, not a legal determination that the calculator/site is outside ShareAlike. Whether ShareAlike could reach more than the table remains unresolved; no owner acceptance of that risk is recorded. Obtain written clarification from HeiGIT or qualified counsel, or record an explicit informed owner decision before adoption.
3. The state-level "points" are centroids; one distance is a number, and a single fact is hard to protect, but a whole table can attract database rights (HeiGIT is German): another reason to follow the licence for the table itself.

## Adoption PR checklist (after the 2026-11-05 gate and the owner's answer)
- Data file copied to `data/road-distances.json` on main with its metadata intact; separate `data/LICENSE-road-distances.md` stating CC-BY-SA 4.0, the attribution line, link to the terms and to openstreetmap.org/copyright.
- Visible attribution `© openrouteservice by HeiGIT | Data from OpenStreetMap` next to the road-miles note on /calculator/ and in the methodology; wording: road miles between model points, not between addresses, with the data date (2026-11-02).
- Straight-line fallback (Alaska, Hawaii, city pairs outside the 44) said on the page; formulas and coefficients unchanged; ±20 % band and "not a quote" unchanged.
- Tests: every state pair present or Alaska/Hawaii; road ≥ straight line; the 10 pairs with ratio above 1.6 listed so a change is deliberate; attribution present on the built page (verify-seo).
- Owner decision still needed: is a typical +7 % to +14 % higher estimate acceptable as the new default (46 % of pairs change U-Haul band)?
