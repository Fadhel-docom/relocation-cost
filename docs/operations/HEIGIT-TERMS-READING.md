# HeiGIT / openrouteservice terms review — R4
**Reviewer:** ChatGPT  
**Read date:** 2026-10-29 UTC  
**Purpose:** Decide whether Relocation Cost may safely consider a hosted driving-distance API. This is a source review, not legal advice. No API key was created or used.

## Findings

| Question | Evidence read | Finding |
|---|---|---|
| Commercial use on Standard/free plan | An openrouteservice forum answer by a HeiGIT team member dated 2026-10-12 says: “commercial usage is allowed under the Standard Plan.” The thread asks about a product with a paid tier, so it is relevant evidence but not a complete interpretation of all terms. Source: https://ask.openrouteservice.org/t/free-plan-in-an-app-with-a-paid-tier-license-cc-by-sa-4-0-personal-data-and-attribution-questions/8079 | **Supported for Standard Plan, but verify against the current Terms and the project's exact use before implementation.** The terms page itself could not be fully opened in this review (the search-indexed staging terms page returned 403 to the browser). |
| Result license | The same HeiGIT reply says results are licensed CC-BY-SA 4.0 and advises users to consult the license; the official terms search excerpt says OSM-derived results normally require attribution. Source: same forum thread; terms page search result https://staging.openrouteservice.org/terms-of-service/ | **License obligations need a direct legal/terms review.** Do not assume that displaying only distance numbers avoids share-alike obligations. HeiGIT explicitly declined to interpret the license for the poster. |
| Attribution | The official terms search excerpt says OpenStreetMap requires attribution when OSM data may be displayed to end users, and results normally return OSM data. The forum reply directs users to the Terms for attribution. | **Attribution is required in principle; exact required wording/placement is not fully verified because the full terms page was inaccessible.** Do not treat a proposed attribution string as approved until the current terms are readable or HeiGIT confirms it. |
| Caching / storing results | No readable current primary-source text establishing the precise caching rule was obtained. | **Unresolved. Do not cache or persist route results until verified.** |
| Standard plan quotas | An official API restriction page describes endpoint input limits, not account request quotas: https://openrouteservice.org/restrictions/. A forum post dated 2026-10-10 reports 2,000 Directions requests/day and 40/minute for Standard, but this is a user statement, not a primary quota document: https://ask.openrouteservice.org/t/free-plan-in-an-app-with-a-paid-tier-license-cc-by-sa-4-0-personal-data-and-attribution-questions/8079. | **Likely reported limits only; verify the current quota in the account dashboard or official documentation before design.** Do not treat these figures as contractually confirmed by this review. |
| API endpoint | HeiGIT's API landing page says users can obtain a free Standard API key and links to the API documentation: https://api.heigit.org/. HeiGIT's 2026-10-22 announcement says the deprecated API URL will be switched off and applications should move to the new HeiGIT API URL before 2026-11-16: https://heigit.org/changes-in-the-openrouteservice-universe/. | **Use current HeiGIT API documentation only; do not implement against a deprecated hostname.** |

## Decision for Relocation Cost

**R4 remains blocked pending written clarification.** Do not add an API key, integration, caching, or production routing behavior yet. The project may later earn affiliate revenue, so confirm that the intended public website and its planned monetization fit the current Standard plan terms. Also obtain explicit guidance on attribution, result licensing and caching. The existing straight-line distance method should remain unchanged until the terms and technical approach are approved.

## Suggested message to HeiGIT

Subject: Clarification of Standard API use, attribution, result licensing and caching

Hello HeiGIT team,

I operate a free US relocation-cost planning website that may later earn affiliate commissions. Before integrating the hosted driving-directions API to improve route-distance estimates, could you please confirm the current terms for this use case?

1. Is use of the Standard plan permitted on this free public website if it may earn affiliate revenue?
2. What exact attribution text and placement are required for displayed driving distance or derived estimates?
3. May the application retain route distance/duration values for caching or reuse? If so, what limits and duration apply?
4. Do the CC-BY-SA 4.0 terms apply to numeric distance/duration values used only as inputs to our own cost estimate, and what obligations would that create?
5. What are the current Directions daily and per-minute quotas, and which API hostname should new integrations use?

Thank you.

## Limitations and next action

- The full Terms of Service page could not be read in the browser during this review; no unsupported conclusion is drawn from its search snippet.
- No API request, account dashboard inspection, or live implementation was performed.
- **Next:** owner may send the question above through the official contact channel. Claude should not implement R4 until a written response and current terms settle the open points.
