# Road distance data (R4) — first full run and what it means for adoption
**Date:** 2026-11-02 · **Author:** Claude (first) · **Scope:** analysis only. The site does not read the data; no formula, coefficient, page or sitemap changed; no indexing request.

## The run (read from branch `data/road-distances`, generated 2026-11-02T18:33Z)
- 1,220 pairs asked (1,176 state pairs without Hawaii + 44 city pairs). **1,172 ok, 48 failed.** All 48 failures involve Alaska: 47 × `http_404_2010` (no routable point / no route found), 1 × `http_400_2004` (route over the service's distance limit). One transient network error (ID|TN) was retried and is now ok. All 44 city pairs are ok. No pair was rejected by the "shorter than straight line" check and none carries a review flag from the tool.
- Alaska pairs therefore stay straight-line (expected, written in the builder doc).
- Source: openrouteservice (HeiGIT), driving-car, host api.heigit.org. Underlying map data: OpenStreetMap (ODbL). **Licence of the results themselves: ChatGPT (PR #166, merged) reports that a HeiGIT staff reply of 2026-10-12 says API results are CC-BY-SA 4.0 and that commercial use is allowed on Standard; Claude could not open that forum thread or the account Terms, so this is unverified by Claude.** What Claude did read (openrouteservice.org/plans): Standard is free for everyone, commercial use is excluded only on the separate Collaborative plan, Directions quota 2,000/day and 40/min. **Open legal question that blocks adoption:** whether a stored distance table used as a calculator input is "adapted material" under CC-BY-SA share-alike, and what the terms say about storing results. (My earlier line "ODbL only" was wrong and is replaced by this.) Not legal advice.

## Quality of the numbers
- Road ÷ straight-line ratio (1,171 pairs from the first read): min 1.043, 5th percentile 1.127, median 1.215, 95th 1.401, max 2.106. Known pairs look plausible: CA–TX 1,546 road vs 1,317 straight miles (1.17), FL–NJ 1,107 vs 957, IL–NY 890 vs 739, CA–NY 2,863 vs 2,405.
- **Ten pairs have ratio above 1.6** (CA|NV 2.11, MI|WI 1.93, ID|MT 1.92, NH|NY 1.76, ME|VT 1.76, ID|OR 1.68, OR|WA 1.67, CO|WY 1.64, ID|WA 1.64, CA|MT 1.61). Cause (inference, not proven): the state "point" is a centroid that can be far from any road and from where people actually live, and the route is measured from the nearest road to that point; mountain or lake geometry (Sierra, Lake Michigan) then adds distance. **The table measures between model points, not between the user's real addresses**, the same limitation the straight-line figure already has. The tool does not record how far a point moved when snapped to a road, so this cannot be quantified from the stored data.

## What adoption would change (computed with the site's own `calculateBudget`, 2–3 rooms size 1.35, road vs straight-line miles, rounded)
| Move type | Pairs where the U-Haul band changes | Total change, median | Total change, largest |
|---|---|---|---|
| DIY (0.65) | 535 of 1,171 (46 %) | +$38 (+6.9 %) | +$905 |
| Truck + labor (1.0) | 535 | +$91 (+9.5 %) | +$1,107 |
| Full service (1.65) | 535 | +$245 (+13.5 %) | +$1,481 |
The 95th percentile of the DIY change is +69 %. Every figure is a planning total, not a quote; the direction is always up because a road is never shorter than the straight line.

## Decision
- **Do not adopt yet.** Adoption raises half of all state-to-state estimates, some by hundreds of dollars, and 46 % of pairs jump a price band. That is a product change that must be announced on the page and measured, not slipped in. It also falls inside the "no change to the calculator before the 2026-11-05 GSC gate" rule.
- Adoption PR (after the gate, and only if the owner agrees): the calculator reads `data/road-distances.json` (copied into main from the data branch); for a pair without a road entry (Alaska, Hawaii, any city outside the 44 pairs) it keeps the straight-line figure and says so; the note under the state choice, the methodology and the printed summary say "road miles from openrouteservice, © OpenStreetMap contributors, data date"; the ±20 % band and the "not a quote" wording stay; formulas and coefficients unchanged; tests: a table check (every state pair present or Alaska/Hawaii), road ≥ straight line, the 10 high-ratio pairs listed in a test so any change is deliberate.
- Open questions for the owner: (1) is a typical +7 % to +14 % higher estimate acceptable as the new default? (2) obtain a readable copy of the current HeiGIT Terms or a written HeiGIT answer on storing results and CC-BY-SA share-alike for a derived lookup table (the account Terms page is a client-rendered app that neither Claude nor ChatGPT could read: the owner can open https://account.heigit.org/info/tos in his browser and paste the relevant paragraphs).

## Tasks
- **ChatGPT:** quote verbatim the HeiGIT/openrouteservice terms lines on commercial use and on **storing/caching results**; if unreadable, tell the owner. (Open since this morning.)
- **Claude, after 2026-11-05:** GSC reading, M1/M3a as planned; adoption PR only with the owner's answer to question (1).
