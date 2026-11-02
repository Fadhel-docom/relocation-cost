# Road distance builder (R4) — tool ready, not run, not used by the site
**Date:** 2026-11-02 · **Author:** Claude (first) · **Status:** files only. No key was used, no request was sent, the site does not read the result.

## What exists
- `src/lib/road-distance.js` + tests: which pairs to ask (1,176 state pairs, 44 city pairs; Hawaii has no road link), request/response handling, sanity check (road must not be shorter than the straight line; ratio above 2.2 is flagged).
- `tools/road-distances-build.mjs`: resumable, 1.7 s between requests (under 40/min), stops on 401/403, on three 429s in a row, or when fewer than 30 requests remain. Never prints or stores the key.
- `.github/workflows/road-distances.yml`: manual. Publishes `data/road-distances.json` to the branch `data/road-distances` only; main is untouched.
- Tested against a local fake server (success, resume, HTTP 400, wrong key, missing key). **Never run against the real service.**

## Source and rights
- Host: `https://api.heigit.org/openrouteservice` (the old host is being retired, shutdown window 2–6 Nov 2026; a trailing slash on the base URL causes 405).
- The owner registered at account.heigit.org (screenshot of the key page, key hidden) and states that the account gives the right to commercial use. **Claude did not read the terms text**: the screenshot shows the key and the host-change notice, not the terms. Not verified by Claude: the exact terms on **storing results** and the quotas of this key (the screenshot ends before the quota table).
- Data is OpenStreetMap, ODbL: publish "© OpenStreetMap contributors" on the methodology page when the table is adopted; a published distance table is probably a derivative database (inference, not legal advice).

## What the owner must do (only he can)
1. Repository Settings > Secrets and variables > Actions > New secret: name `ORS_API_KEY`, value = the key. **Never paste the key in chat, code, issues or logs.**
2. Actions > "Road distances" > Run workflow with `limit = 3` (smoke test), then tell Claude. Then `limit = 2000` (≈1,220 requests, about 35 minutes, under the 2,000/day Directions quota; check the quota on his dashboard).

## Expected, not yet known
- State points are centers of states, often off any road; the request asks to snap at any distance (`radiuses: -1`). The server may refuse that setting: the smoke test shows it, and the result is a recorded `failed` entry, not a crash.
- Alaska pairs exceed the 6,000 km route limit: expected `http_400_2004` failures; they stay straight-line.
- The tool cannot see how far a point moved when snapped; the ratio check is the only guard.

## Adoption (separate PR, after the 2026-11-05 GSC gate, not before)
Road distance shifts U-Haul bands and totals (jumps of +463 to +823 USD measured on 25 Oct). Before the calculator reads the table: a 20-route test comparing band and total changes, a visible note "road miles from openrouteservice, © OpenStreetMap contributors, date", straight-line kept as fallback and for pairs without a road entry, formulas and coefficients unchanged.
