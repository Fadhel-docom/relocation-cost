# Routing provider review — Relocation Cost
**Reviewer:** ChatGPT  
**Reviewed:** 2026-10-31 UTC  
**Status:** Research only. No API key, billing, API requests, code changes, or production changes.

## Product need
The current decision is not whether to add a map UI. The calculator only needs two values between origin and destination: driving distance and a clearly labelled estimated driving duration. A visible map/route is not required. The duration must not be presented as live traffic or a guaranteed arrival time.

## Findings from current primary/provider sources

| Option | What it can provide | Cost / access finding | Main constraint | Current assessment |
|---|---|---|---|---|
| HeiGIT / openrouteservice hosted Standard | Driving directions return route distance and duration; matrix also exists | HeiGIT staff answered on 2026-10-12 that commercial use is allowed under the Standard plan. The published Standard plan lists 2,000 Directions/day and 40/min; confirm the current account quota in the HeiGIT dashboard before relying on it. | Results are CC-BY-SA 4.0 according to HeiGIT's reply; attribution and license interpretation still matter. Persistent storage was answered broadly as permissible subject to Terms, but the license implications still need review. | Best low-cost hosted candidate to test first, but do not integrate until the site's exact use, attribution, result-license and cache approach are approved. |
| Google Routes API Essentials | Driving distance and duration; traffic-aware options exist but are a higher SKU | Current global price list shows 10,000 free Essentials billable events per month per SKU, then $5 per 1,000 events in the first paid tier. Billing must be enabled and each request needs an API key or OAuth token. | Pay-as-you-go and billable use can exceed the free cap; use quotas/budget alerts. Google terms and storage restrictions need review for any cached results. | Best managed fallback / benchmark if ORS licensing is unsuitable. Not “free forever”; configure a hard daily quota before testing. |
| GraphHopper hosted API | Routing API provides distance and time; API is credit-based | Free plan: 500 credits/day, explicitly non-commercial only. Basic is €69/month for 5,000 credits/day; paid plans list commercial use. | Free tier does not fit a commercial/affiliate-funded site. Self-hosting is a separate operational and licensing assessment. | Do not choose the hosted Free tier for this project. Revisit paid/self-hosted only if value and volume justify it. |
| Valhalla self-hosted | Open-source route service; route API returns distance and estimated time; matrix support exists | No per-request hosted API charge when self-hosted, but infrastructure, data updates, monitoring and maintenance are real costs. | Uses OpenStreetMap and other open datasets; attribution is required and OSM data is ODbL. | Strong long-term independence option if usage grows enough to justify operating it. Not “zero cost”. |
| OSRM self-hosted | Open-source engine; Route returns distance and duration; Table returns distance/time matrices | No per-request hosted API charge when self-hosted; infrastructure and map-data refresh are still required. | Public demo server is for trying the software, not a dependable production service. OSM-derived data requires appropriate attribution/licence handling. | Viable self-hosted alternative; no reason to operate it at current scale without measured demand. |

## Important openrouteservice migration and quota findings
- HeiGIT announced on 2026-04-28 that \`api.openrouteservice.org\` was deprecated in favour of \`api.heigit.org\`; the route path changes to \`api.heigit.org/openrouteservice/v2/...\`.
- A later HeiGIT announcement dated 2026-08-27 says the old hostname receives only 10% of the plan quota from that date and is scheduled for shutdown during 2026-11-02 to 2026-11-06. Therefore, any future integration must use the new hostname from day one. Do not copy an old endpoint from older examples.
- The official restrictions page lists a 6,000 km maximum for driving directions. The account plan limits are separate from per-request distance/waypoint restrictions.
- HeiGIT staff answered on 2026-10-12 that commercial use is allowed under the Standard plan. The same answer says results are CC-BY-SA 4.0 and declines to interpret the legal consequences of that licence.
- In a separate 2026-08-27 forum answer about persistent storage of Matrix duration values, HeiGIT staff said results may be used as desired as long as the Terms of Service are followed. This is useful provider guidance, but it does not settle the CC-BY-SA obligations for our derived display/calculation. Keep the legal/licence review open.

## Recommendation
1. **Short term:** keep the current straight-line calculation unchanged. ORS Standard is the first hosted candidate for a controlled technical test because the provider explicitly confirmed Standard-plan commercial use and the quota is likely adequate for an early-stage site. Before production use, obtain a written answer on how CC-BY-SA 4.0 applies to displayed numeric distance/duration and derived moving-cost estimates, confirm the required attribution text/placement, and confirm caching/reuse for this exact use case. Confirm the actual quota in the account dashboard.
2. **Fallback:** Google Routes Essentials is the simplest managed comparison if ORS licensing is not acceptable. Its 10,000 monthly free Essentials events are a usage cap, not an assurance of permanently free operation; billing is required. Set strict quota and budget controls before any test.
3. **Long term:** consider Valhalla or OSRM self-hosting only after measured request volume and reliability needs justify the infrastructure and maintenance. Do not treat self-hosting as cost-free.
4. **Reject for now:** GraphHopper hosted Free plan because its own pricing page says it is non-commercial only.

## Proposed controlled 20-route test (not yet run)
- Compare ORS and Google on the same 20 US origin/destination coordinate pairs: short, medium and cross-country routes; urban, rural and mountain/coastal examples; include the project's priority routes (CA→TX, CA→AZ and FL→NJ).
- Request only route distance and estimated duration; omit geometry/maps and live traffic for a like-for-like baseline.
- Record origin/destination coordinates and their source, provider/API version, distance in miles, duration, response time, success/failure, retry count, and estimated billable usage.
- Compare relative distance and duration differences; investigate large outliers rather than averaging them away. A routing API's duration is an estimate, not a promise of real-world travel time.
- Run only after provider accounts/keys and licensing are approved. No credentials or billing have been created in this review.

## Sources checked (2026-10-31)
- HeiGIT migration announcement: https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912
- HeiGIT deprecated-host quota announcement: https://ask.openrouteservice.org/t/reducing-the-quota-of-deprecated-api-api-openrouteservice-org/8013
- openrouteservice restrictions: https://openrouteservice.org/restrictions/
- HeiGIT Standard-plan commercial-use and CC-BY-SA answer (2026-10-12): https://ask.openrouteservice.org/t/free-plan-in-an-app-with-a-paid-tier-license-cc-by-sa-4-0-personal-data-and-attribution-questions/8079
- HeiGIT persistent-storage answer (2026-08-27): https://ask.openrouteservice.org/t/persistent-storage-and-reuse-of-matrix-api-duration-results/8010
- Google Routes billing and usage: https://developers.google.com/maps/documentation/routes/usage-and-billing
- Google global pricing list: https://developers.google.com/maps/billing-and-pricing/pricing
- GraphHopper pricing and commercial-use note: https://www.graphhopper.com/pricing/
- Valhalla route API: https://valhalla.github.io/valhalla/api/route/api-reference/
- Valhalla data sources / ODbL: https://valhalla.github.io/valhalla/contributing/data/data-sources/
- Valhalla attribution: https://valhalla.github.io/valhalla/mjolnir/attribution/
- OSRM API: https://project-osrm.org/docs/v5.24.0/api/
- OSRM backend licence: https://github.com/Project-OSRM/osrm-backend

## Limitations
This is a desk review of public documentation and provider forum answers. I did not inspect the user's provider dashboard, create credentials, send API requests, test US route outputs, or obtain legal advice. The current R4 gate is not fully cleared.
