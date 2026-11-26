# B26 handoff — exact Ahrefs ↔ GSC internal-link and crawl diagnosis
Date: 2026-11-26
Priority: URGENT — indexing investigation
Owner direction: Take direct ownership. Do not return a general explanation or ask the owner for screenshots/data that connected services can provide. Retrieve the actual URL-level evidence, reconcile it, and make an evidence-based recommendation.

## Why this task exists
The site has roughly 90+ URLs reported as not indexed by Google. A prior Ahrefs audit reportedly showed 94 affected pages with only one dofollow internal inlink each. This may indicate weak internal link distribution, but the count alone does NOT prove pages are orphaned or that this caused Google's lack of crawling. We need the underlying URL and source-link data.

Previous Claude GSC reading (PR #299, 2026-11-26) found:
- Sitemap child: 115 submitted, 0 errors/warnings, downloaded 2026-11-24.
- The then-inspected /calculator/, /methodology/ and /moving-cost/cities/chicago-to-atlanta/ were “URL unknown to Google”, with no crawl date.
- 93 URLs in “Detected, currently not indexed” were reported by owner; examples showed “Latest exploration: Not applicable”.
- Claude could not retrieve the complete GSC URL list or Crawl Stats through its then-used API path. This task requires trying all available connected UI/export/browser routes, not assuming the API limitation means the data cannot be obtained.
- Source review previously claimed hubs link route pages, but this must now be validated against the live rendered production site and Ahrefs URL-level report. Do not repeat the source-only audit as a substitute for live evidence.

## Required work — do every section

### A. Retrieve the complete Ahrefs evidence
1. Check whether Ahrefs is connected/available in your environment. If connected, open the exact Site Audit project for https://relocation-cost-psi.vercel.app/ (or the configured project hostname) and retrieve/export the full list behind the reported 94-page “one dofollow internal inlink” finding.
2. Capture for EVERY affected URL:
   - exact URL and HTTP/final URL;
   - internal inlinks count and the exact metric definition used by Ahrefs;
   - unique referring internal page count, if separately available;
   - all referring/source URLs (not just a count);
   - anchor text and link attributes (follow/nofollow);
   - whether links are template/global navigation, hub links, contextual links, pagination, or other;
   - crawl status, indexability, canonical, depth, and page type if available.
3. Export the raw CSV/XLSX or equivalent report and preserve its date, project scope, crawl date, and filters.
4. If Ahrefs is NOT connected or the project/report is unavailable, state the precise limitation and continue with a full first-party crawl/link graph of the production site. Do not pretend Ahrefs evidence was retrieved.

### B. Retrieve and reconcile Google Search Console evidence
1. Use the live verified property https://relocation-cost-psi.vercel.app/.
2. Retrieve the full current Page indexing reason groups and totals, not just a screenshot count.
3. Retrieve the complete URL list/export for “Detected, currently not indexed” (reported as 93) using available GSC UI/export routes. If truly unavailable, record the exact interface/API limitation and capture every available example.
4. For each URL in the GSC list, join it to the Ahrefs report using normalized final/canonical URL. Report exact intersection, GSC-only and Ahrefs-only counts and URL lists.
5. For representative URLs from every page type and every important status, record URL Inspection fields: verdict, indexing state, last crawl (or none), crawl allowed, fetch result, indexing allowed, user canonical, Google canonical, referring/discovery source, sitemap membership.
6. Open Crawl Stats in GSC UI and record host status, total requests, response codes, response time, Googlebot type, crawl purpose and date range. Check Search Console messages, Manual Actions and Security Issues. Do not leave these as “not available” without trying the direct UI.
7. Record exact sitemap processing and URL coverage, and compare submitted canonical URLs to the GSC/Ahrefs lists.

### C. Independently crawl the live production site
1. Crawl the production hostname with a reliable crawler (and a second method if blocked).
2. Build a complete internal link graph for all canonical indexable HTML pages. Extract links from rendered HTML and distinguish links in server HTML from client-only links.
3. For every canonical page calculate:
   - number of distinct internal source pages linking to it;
   - total internal link occurrences;
   - crawl depth from homepage;
   - whether it is reachable from homepage through crawlable links;
   - source URL(s), anchor text, and link location/type.
4. Identify truly orphaned pages (zero internal source pages), weakly linked pages (one source), and adequately linked pages. Do NOT label a page orphaned merely because Ahrefs shows one inlink.
5. Inspect navigation, hub pages, route directories, breadcrumbs, related-route modules, pagination and contextual links. Check whether links are actual crawlable anchors and whether they render in initial HTML.
6. Compare deployed production commit/alias with main. Verify HTTP status, redirects, canonical, robots directives/headers and sitemap membership for representative and anomalous URLs.

### D. Diagnose the real pattern
1. Segment results by page type: state route, city route, guide, calculator, methodology, hub, other.
2. Determine whether the 94-page metric represents 94 distinct targets with exactly one source, whether the source is the same page/template, and whether the 93 GSC URLs substantially overlap.
3. Test plausible explanations separately: low internal link count, excessive crawl depth, sitemap-only discovery, weak/duplicate/thin page value, canonical/redirect mismatch, crawl/fetch/host issue, or crawl prioritization.
4. Distinguish correlation from causation. “One inlink” by itself is not proof Google refuses to crawl a URL.
5. Provide a short prioritized diagnosis supported by URL-level evidence and quantify each pattern.

### E. Propose and, if justified, implement the smallest useful fix
1. If the evidence proves a real internal-link architecture defect, propose a targeted, meaningful linking plan that helps visitors navigate and understand related routes. Avoid generic sitewide link spam or repeating hundreds of boilerplate links.
2. If a code change is justified, implement it on a branch/PR, run build and relevant rendered-page/link checks, and report the diff. Do not merge or deploy without review.
3. If no technical defect is established, explicitly recommend no code change and identify the next evidence needed.
4. Do not change calculator formulas, prices, route distances, or unrelated content.
5. Do not mass-submit URLs to Google. Request indexing only for a few high-value URLs after verifying a real correction and if quota permits.

## Required deliverables in the operations room
- Timestamp and exact project/property/crawl scopes.
- Ahrefs raw export or exact access limitation.
- Complete GSC URL list or exact access limitation.
- A reconciled CSV/table covering every URL in both sets, including source pages and GSC status.
- Complete live crawl link graph or downloadable artifact, with per-page source counts and depth.
- Counts of orphaned (0), one-source (1), and multi-source (2+) pages by page type.
- Exact overlap between the Ahrefs 94 and GSC 93 (do not infer from similar totals).
- Evidence-based root-cause ranking, clearly separating facts and hypotheses.
- Smallest justified fix as PR, or a reasoned no-code decision.
- Production verification and next measurable checkpoint.

## Communication rule
Do not ask the owner to provide screenshots or exports before exhausting connected GSC/Ahrefs access and available direct UI routes. Do not return another generic checklist. If a source is inaccessible, prove the access limitation, proceed with the other evidence, and state exactly what remains unknown. This work is specifically about resolving the indexing problem and must be logged in the shared operations room.
