# Review of the Canada / UK / EU roadmap package (prepared by Claude II, 2026-11-02)
**Date:** 2026-11-03 · **Reviewer:** Claude (first) · **Scope:** documentation only. The package itself (README, Competitors Top 20, Canada, UK, EU merged + 27 country files, PDF copies) lives in the owner's files, not in this repository. Nothing here changes the site, formulas, sitemap or indexing.

## What the package is
Planning documents with an evidence key ([verified], [snippet], [repo], [claim], [to check], [not established]) and the rule "no number without a source and a date". Canada and UK follow the same structure (decision, scope, competitor lessons, layered pricing model, map and distances, tax notes, phases 0–6, risks, research tasks). The EU file adds a common frame, waves and one section per country; the 27 country files are templated (same structure, most lines marked [to check]).

## Good (worth keeping)
- Honest evidence labels; unknowns are written as unknown. Consistent with the project rules (no invented data, no claimed runs).
- Layered pricing without invented prices: official floor (fuel from official price series, labour from official wage tables) + user-entered costs starting at 0 + dated external sanity ranges shown as attributed references only + optional future user-shared quotes. This respects the rule "no coefficient without a source".
- Everything stays behind the 2026-11-05 GSC gate and the "existing pages indexed first" rule; Canada first, then UK, then EU in waves; Quebec 1 July seasonality as an optional input, not an invented percentage.
- Per-country distance seeds are small (about 190 pairs for Canada, about 190 for the UK, about 36 for a country like Germany).

## Problems found
1. **Licence error.** The package says HeiGIT results are "CC-BY 4.0". The HeiGIT Terms of Service text (read 2026-11-03) says **CC-BY-SA 4.0**, with the attribution line `© openrouteservice by HeiGIT | Data from OpenStreetMap`. Every file that repeats "CC-BY 4.0" must be corrected before any use.
2. **Wrong premise about quota.** The hand-off treats HeiGIT's free quota as something to "not use up". The Standard plan limits are per day and renew (Directions 2,000/day and 40/min; Matrix 500/day and 40/min per the plans page read 2026-11-02). 190 pairs is under 10 % of one day's Directions quota; one Matrix request can return all pairs between about 20 cities. The package's own "Matrix 500–2,500 per day, varies by source" is settled by the plans page: 500.
3. **Obsolete step.** "A friend opens a HeiGIT account" is no longer needed: the owner registered and the key is already a repository secret.
4. **Public OSRM/FOSSGIS servers: not accepted.** The hand-off says the full terms allow commercial use if the service is not an "essential part" of the site, and proposes writing to the operator. Claude could not verify this: the German terms page is not readable from this session, and ChatGPT's attempt was blocked by an anti-bot page. The OSRM wiki "Demo server" page says 1 request per second and non-commercial use. The two statements conflict; the operator may withdraw access without notice. A second provider also means a second licence regime and a second quality profile. **No email to FOSSGIS; no use of public OSRM.**
5. **Self-hosted routing on GitHub runners (option B)** is untested for large countries (14 GB disk); keep as a fallback experiment only, not a plan.
6. **Direction asymmetry** (Claude II measured Toronto→Winnipeg 2,089 km vs the reverse 2,226 km on public OSRM): a fair point that also applies to our US table, which stores one direction per pair. Claude's US data has not been checked for this. A cheap check exists (reverse 20 pairs, about 20 requests).
7. **EU per-country files** are a template, not research; treat them as a to-do list, not findings.

## Decisions
- **Provider for every new country: HeiGIT openrouteservice (Standard plan, existing key and builder).** Terms read, attribution defined, quota ample, builder resumable. Per country, one manual workflow run (or a Matrix variant of the builder to cut requests).
- **Order unchanged:** after the 2026-11-05 GSC reading and M1/M3a, Canada first, then the UK, then EU waves. Nothing is built or published before phases 0–1 pass.
- **Open for the US table too (before adoption):** reverse-direction spot check of about 20 pairs; Hawaii and Alaska stay straight-line.
- **Not decided here:** share-alike question for a stored table (open, see HEIGIT-TERMS-READING-2026-11-03.md); owner has asked HeiGIT in writing (email drafted) and chose to proceed in parallel.

## Tasks
- **Claude II (if it continues):** correct "CC-BY 4.0" to "CC-BY-SA 4.0" in all package files; drop the FOSSGIS email and the friend-account step; keep evidence labels. Reply per item: "done + evidence" or "cannot: reason + tell the owner".
- **Claude (first):** after 2026-11-05, GSC reading, M1/M3a; then the US adoption PR (checklist in HEIGIT-TERMS-READING) and the Canada phase-0 data (R-CA-1 is done: terms read; R-CA-4 Job Bank wages and the StatCan fuel series next).
- **ChatGPT:** R-CA-3 (published source for moving labour hours and truck fuel use per home size, or confirm they stay user inputs); R-CA-5 (reuse terms for CMHC and StatCan CPI); R-CA-6 (Quebec language rules, official source).
