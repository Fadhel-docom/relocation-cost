# Free road-distance and map options for Relocation Cost

**Research date:** 2026-10-25  
**Status:** research and decision record only; no application integration approved or deployed.

## Product requirement

The current calculator defaults to straight-line distance between state reference points. It says so clearly and lets the visitor enter actual driving miles. A road-routing API between state centers would produce a road distance between those reference points, not the visitor's real home-to-home journey. A meaningful route feature eventually needs an origin and destination that identify at least cities or ZIP codes, with manual miles retained as a fallback.

## Options

### 1. OpenRouteService / HeiGIT hosted API — first candidate for a limited free-tier evaluation

- Supports directions and geocoding and requires an account/API key.
- Official pages reviewed: https://openrouteservice.org/services/ ; https://staging.openrouteservice.org/plans/ ; https://openrouteservice.org/faq/.
- The official Services page says “over 7000” requests per day; the official staging Plans page shows different per-endpoint limits, including Directions 2,000/day and 40/minute. Treat these figures as inconsistent until confirmed in the account dashboard and current terms. Do not hard-code a quota or promise a free production tier based on either page alone.
- Before any integration: confirm commercial use is permitted for the intended site, check route and geocoding quotas, storage/display rules, attribution requirements, and whether a key can be safely called server-side.

### 2. OSRM with OpenStreetMap data — open-source engine, not a guaranteed free hosted production API

- OSRM can return route distance, duration, and geometry. See https://project-osrm.org/docs/v26.6.1/http.
- Public demo servers are for reasonable use and have no uptime/latency guarantees; the OSRM demo-server guidance warns against treating them as a commercial production dependency. See https://github-wiki-see.page/m/Project-OSRM/osrm-backend/wiki/Demo-server.
- FOSSGIS routing service guidance states a maximum of one request per second and no heavy use. See https://routing.openstreetmap.de/about.html.
- Self-hosting removes dependence on a public demo endpoint but adds server, data-update, monitoring, and maintenance costs. It is not zero-cost operationally.

### 3. Nominatim public geocoding — only a constrained fallback, not autocomplete

- The official policy sets an absolute maximum of one request per second, requires an identifying Referer/User-Agent and attribution, and requires a deliberate ability to switch service. It forbids client-side autocomplete and discourages bulk use. See https://operations.osmfoundation.org/policies/nominatim/.
- Do not query it on every keystroke. Cache only as permitted, minimize requests, and avoid sending personal/confidential data.

### 4. Google Routes API — technically capable, not the free-first default

- Provides real driving routes but requires an API key and billing configuration. Check current SKUs, quotas, and terms before any use. See https://developers.google.com/maps/documentation/routes/compute_route_directions and https://developers.google.com/maps/documentation/routes/usage-and-billing.

## Recommended staged plan

1. Do not change the live calculator or formula yet. Current straight-line disclosure is accurate.
2. First evaluate OpenRouteService's current free-tier terms in its dashboard before requesting any key from the owner. Do not commit a key to GitHub or expose it in browser JavaScript.
3. Build a small route test matrix for a handful of well-known US city pairs, storing expected route-distance observations with test date and provider. Compare route distance to the current straight-line estimate, but do not assume one fixed conversion ratio.
4. If the free-tier terms are acceptable, prototype origin/destination city or ZIP inputs behind a server-side endpoint, with timeout, rate limiting, error handling, caching only within provider terms, and the current manual-mile input as fallback.
5. Add map display only after route calculation is reliable. Use a tile provider whose terms permit the expected production usage; the Leaflet library itself does not provide map tiles.
6. Keep all pricing coefficients unchanged until the team has independently sourced real mover quotes to calibrate the cost model.
7. If free hosted limits are not commercially suitable, defer the feature or cost a self-hosted routing engine; do not silently rely on a demo server.

## Acceptance checks for a future prototype

- Correctly parses meters and converts to miles (1 mile = 1609.344 meters).
- Validates origin/destination and handles no-route, timeout, 429/quota, and 5xx responses.
- Never leaks an API key into static HTML or browser JavaScript.
- Preserves manual distance entry and calculator availability when routing is unavailable.
- Identifies the route as an estimate between the selected reference locations, not a guaranteed truck route or quote.
- Provides required OpenStreetMap attribution and obeys the selected provider's terms.
- Tests several US city pairs and records observed outputs; do not call unexecuted tests successful.

## Current decision

**No production integration, no API key requested, and no pricing-formula changes.** The next person should verify OpenRouteService's current account-level quota and commercial terms, then decide whether a limited prototype is justified.
