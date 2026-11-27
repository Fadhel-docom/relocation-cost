# Operations room — GSC 115-URL recheck and internal-link claim
Date: 2026-11-26 11:44 UTC
Project: Relocation Cost
Production/build reference: `ffd907f`
Scope: Google Search Console API inspection of all 115 sitemap URLs, as reported by Claude.

## Direct GSC API result

Claude inspected all 115 sitemap URLs through the GSC API on 2026-11-26:

- **23 indexed**
- **92 reported as “unknown to Google”**

Breakdown of the 92 unknown URLs:
- City route pages: **44/44**
- State route pages: **32/50**
- Other pages: **16**, including both hubs and `/calculator/`.

This is the current URL-level coverage snapshot reported by Claude. It supersedes the earlier approximate 22/94 or 24/94 figures for this 115-URL sitemap scope. Do not mix counts from different report dates or URL scopes.

## Internal-link evidence and interpretation

The current built site at `ffd907f` has already been checked across all 115 sitemap URLs:
- Minimum distinct internal linking pages: **5**
- Median distinct internal linking pages: **13**
- `/calculator/` and both hub pages: **114** linking pages each.

Therefore, low internal linking is not supported as an explanation for the 92 URLs currently reported as unknown to Google. **No internal-link changes are authorized or needed on this evidence.**

The earlier Ahrefs claim that 94 pages had one inlink remains unresolved. The number 94 equals the count of route pages, but that coincidence does not validate the metric or establish that the report measured distinct referring pages. The original Ahrefs export is still required to verify:
- report generation date versus actual crawl date;
- hostname/project and URL scope;
- filters;
- exact Ahrefs metric label and definition;
- whether “one inlink” means a link occurrence, a unique referring page, a dofollow-only link, or something else.

Until the export is inspected, treat the 94-page claim as **unverified**, not as a current site defect.

## Evidence of ongoing discovery/crawling

Claude also reported:
- `/checking-a-mover/` is now indexed.
- `/fl-to-ma/` was crawled on 2026-11-26.

These examples indicate Google discovery/crawling is continuing, albeit slowly. They do not by themselves explain why the remaining 92 URLs are unknown or establish a sitewide crawl-rate cause.

## Decision

1. **No code change.**
2. **No internal-link changes.**
3. Do not mass-submit the 92 URLs or change sitemap/navigation based solely on this snapshot.
4. Keep the Ahrefs discrepancy open only as a report-provenance/metric-definition check, pending the original export.
5. Continue monitoring GSC coverage using consistent 115-URL scope and dated snapshots. Compare the next snapshot URL-by-URL, not just aggregate totals.
6. Keep PR #300 open and unmerged as requested; it is a documentation handoff for the narrowed Ahrefs export verification only.

## Next evidence checkpoint

When the Ahrefs export is available in the existing project materials, verify its crawl date, project scope, filters and metric definition before attempting any URL-level reconciliation with the current build. If the export is not available, explicitly retain the Ahrefs claim as unverified. No request for GSC UI work is part of the revised B26 task.
