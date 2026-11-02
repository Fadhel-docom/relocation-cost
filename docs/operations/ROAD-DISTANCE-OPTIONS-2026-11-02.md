# Road distance (R4) — options that do not depend on a reply
**Date:** 2026-11-02 · **Author:** Claude (first) · **Scope:** documentation only. No code, no tool, no API call, no site change.

## Why this note exists
The owner's openrouteservice forum account was put on hold (automated message, 2026-11-02), so the written commercial-use answer from HeiGIT cannot be obtained there. He asked for a route that does not wait for any provider to reply. Only the forum account is affected; the API is a separate service.

## Correction of an earlier statement (same day)
Earlier today Claude said the OSRM public demo server allows public, attributed commercial use. That came from the older "Api usage policy" wiki page. The newer "Demo server" wiki page limits the demo to 1 request/second and says it is for **non-commercial** use, with no uptime guarantees. The two pages disagree, and the site plans affiliate revenue, so **the OSRM/FOSSGIS demo is not an acceptable source**. The FOSSGIS terms (German) were not readable from Claude's session (URL off the allowlist), so the conflict is unresolved.

## Options, with what is and is not verified
| Option | Needs a reply? | Verified | Problem |
|---|---|---|---|
| OSRM / FOSSGIS public demo | No | 1 req/s limit; newer page says non-commercial | Site is commercial in intent; do not use |
| OpenRouteService Standard plan (precompute once, ~1,300 requests, under 2,000/day) | Existing written team answer of 2026-10-12 reportedly allows commercial use on Standard (read by ChatGPT, not by Claude; full terms unread) | Quotas only | Terms unconfirmed; old host being retired (window 2–6 Nov) |
| Google Routes | No | Free tier exists (10,000 events/month per SKU) | Needs a billing account (owner rule: no spending before revenue); Google's terms restrict storing results (not read) |
| Own routing engine on a free GitHub runner | No | Nothing | Whole-US graph is likely too large for a free runner (not verified) |
| Keep straight-line distance (today) | No | Already disclosed on the page and in the methodology; ±20 % band | Not road mileage |

## Decision for the owner (licence risk is his to accept)
No option is both free of cost and verified free of licence doubt. Claude's recommendation: **keep straight-line distance for now**, because the bottleneck is visibility (158 impressions, 0 clicks), not distance precision, and changing the distance input moves U-Haul bands and totals (+463 to +823 USD jumps). Revisit R4 only after a provider's terms are read in full and allow commercial use and storing results.

## Tasks (answer per item: "done + evidence" or "cannot: reason + tell the owner")
1. **ChatGPT:** read the full FOSSGIS usage terms (https://www.fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen/) and say whether a one-time batch of ~1,300 requests at 1/s for a commercial-intent site is allowed.
2. **ChatGPT:** read the current HeiGIT/openrouteservice terms and quote the exact lines on commercial use and on storing results; state the new API host and the account type needed.
3. **Claude, after the 2026-11-05 gate and only if 1 or 2 is clear:** provider-agnostic builder tool plus a 20-route test comparing band and total changes; straight-line stays as fallback.
