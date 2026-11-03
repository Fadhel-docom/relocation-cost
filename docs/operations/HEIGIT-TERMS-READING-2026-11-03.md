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


## 2026-11-03 — independent CC BY-SA 4.0 database-rights analysis (ChatGPT)

**Official materials reviewed:** CC BY-SA 4.0 deed and legal code (especially Sections 1, 2, 3 and 4), plus Creative Commons' explanatory database-rights page and FAQ:
- Legal code: https://creativecommons.org/licenses/by-sa/4.0/legalcode
- Deed: https://creativecommons.org/licenses/by-sa/4.0/
- CC explanation of sui generis database rights: https://wiki.creativecommons.org/wiki/4.0/Sui_generis_database_rights
- CC FAQ: https://creativecommons.org/faq/

### What the licence itself establishes
1. CC BY-SA 4.0 permits sharing and adaptation for any purpose, including commercial purposes, subject to attribution and ShareAlike when adapted material is shared. The CC licence itself is not a NonCommercial licence.
2. The licence's definition of Copyright and Similar Rights includes sui generis database rights (SGDRs). Section 4 grants extraction, reuse, reproduction and sharing of all or a substantial portion of database contents where those rights apply.
3. Under Section 4(b), if all or a substantial portion of a licensed database is included in another database in which the reuser has SGDRs, that resulting database (not its individual contents) is Adapted Material. If shared, the applicable ShareAlike condition applies to the rights in that resulting database.
4. Creative Commons' explanatory page says SGDRs depend on the applicable jurisdictions; it describes Adapted Material in this database-rights context as requiring extraction/reuse of all or a substantial portion in another database that itself qualifies for SGDRs. It says other uses of the licensed database do not create Adapted Material. That explanatory page is archived historical guidance (last edited 2013); the current legal code controls.

### Application to our route table — limits, not a legal conclusion
- The project has 1,172 successful route-pair outputs generated through separate API requests. The evidence currently available does **not** establish whether HeiGIT claims SGDRs in the API results or an underlying database, whether our generated result table is legally an extraction of a substantial part of such a database, or whether our own table qualifies for SGDR protection in a relevant jurisdiction.
- A single route-distance fact and a complete precomputed route-pair table are not equivalent. The risk analysis must assess the aggregate dataset, not assume every individual numeric result independently creates an adapted database.
- The licence does **not** automatically place the entire website, calculator code, or all unrelated site content under CC BY-SA merely because a result is displayed. The relevant question under Section 4 is whether the statutory database-rights conditions for an adapted database are actually met. Other copyright/contract rights and the account Terms remain separate.
- Keeping the route table as a separate JSON asset with a clear CC BY-SA 4.0 notice and required attribution is a conservative separation measure. It is not a substitute for checking the applicable contract terms or determining whether SGDRs apply.
- The account Terms text supplied by the owner has no express storage/caching/retention clause. CC BY-SA describes the licence applied to results, but does not by itself settle every API-account contractual question about storage, caching, retention or deletion.

### Updated decision
**Do not describe the ShareAlike question as a blanket blocker on the whole website.** The actual scope is narrower and depends on the database-rights facts above. Keep the route table isolated and do not integrate it into the calculator until the account-terms/storage question and the database-rights scope have been clarified or an informed owner decision has been documented. No production change is authorised by this research.

### Exact written clarification to request from HeiGIT
1. Does HeiGIT claim sui generis database rights in the API results themselves or in a source database from which route results are extracted?
2. Is the CC BY-SA 4.0 licence applied to each returned route result, the aggregate result set, or both?
3. Is a table of independently requested route pairs (not a bulk database export) considered extraction/reuse of all or a substantial part of any HeiGIT database for CC BY-SA Section 4?
4. If the table is distributed as a separate JSON asset under CC BY-SA 4.0, does that satisfy the licence for the results, without extending to separately developed calculator code or unrelated site content?
5. Does the Standard account contract expressly permit storing, caching and serving these precomputed results to website visitors, including for a commercial/affiliate-supported service? What retention/deletion limits apply?
6. Confirm the required attribution text and whether the exact line supplied in the account Terms must appear on the calculator page, methodology page, or both.

**Status:** CC BY-SA legal-code mechanics researched; factual application and API-account storage terms remain open. No legal advice claimed.

## 2026-11-03 — HeiGIT support reply (owner's e-mail, pasted by the owner)

The owner e-mailed HeiGIT (communications address) on 2026-11-03 08:56 with three questions: (1) is storing and reusing the results in a static file allowed on the Standard plan, (2) is the Standard plan allowed for a site that may later earn affiliate revenue, (3) does CC-BY-SA 4.0 apply only to the data file and not to the rest of the site or its source code. The data file was described as miles only, no geometry, no personal data, with the attribution line and a CC-BY-SA 4.0 notice. It was addressed to HeiGIT's communications address; the reply came from HeiGIT's smart-mobility support (signed Jakob Schnell) and was received on 2026-11-03; the pasted text does not show the reply's own time stamp. Paraphrased:

| Owner's question | What the reply says | Status |
|---|---|---|
| 1. Static file with stored results | Only a caution: if the underlying OpenStreetMap data or the openrouteservice service changes, a later response to the same query can differ. No explicit yes or no. | **Implicit at best, not a written confirmation.** The caution matches the Terms line that HeiGIT does not guarantee reproducibility. Record the calculation date in the data file. |
| 2. Commercial use of the Standard plan | The Standard plan may be used for commercial purposes. | **Answered, explicit, in writing.** Keep the e-mail as the proof. |
| 3. ShareAlike scope (data file only?) | Not answered; refers to the Terms of Service for attribution and licence of results. | **Open.** The Terms (read 2026-11-03) give the exact attribution line and say results are licensed CC-BY-SA 4.0; they say nothing about the scope of ShareAlike beyond that. |

What this changes: the "commercial/affiliate use of the Standard plan" part of clarification question 5 is closed by an explicit statement. Clarification questions 1–4 (database rights, scope of the licence, whether a table of separately requested pairs is extraction/reuse, whether a separate JSON asset under CC BY-SA satisfies the licence) and the storage and retention part of question 5 and question 6 (where the attribution must appear) remain without a written answer.
Unchanged decisions: the route table stays isolated on `data/road-distances`; no adoption into the calculator before the 2026-11-05 gate and a separate PR using the checklist above; no formula, page, sitemap or indexing change. The reply is not legal advice and is not a contract amendment; the account Terms (which can change at any time) remain the reference, so re-read them at adoption time. Optional follow-up: a short second e-mail asking only for explicit confirmation of questions 1 and 3 (the owner decides whether to send it).
