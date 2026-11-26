# B26 handoff — verify the Ahrefs one-inlink claim against the current build
Date: 2026-11-26
Priority: HIGH — evidence validation only
Scope: documentation / report reconciliation. No production link changes.

## New verified evidence — supersedes the premise of the earlier B26 task

Claude reports that it inspected build `ffd907f` and counted internal links for all 115 sitemap URLs:
- 0 pages have 0, 1, or 2 distinct linking pages.
- Minimum: 5 linking pages.
- Median: 13 linking pages.
- `/calculator/` and `/methodology/`: 114 linking pages each.

This directly conflicts with the earlier interpretation that an Ahrefs audit found 94 pages with only one internal inlink. **Do not change internal links, navigation, hubs, templates, or production code on the basis of the old Ahrefs claim.** The claim is not established against the current build.

## Objective

Determine whether the “94 pages with one inlink” result is:
1. from an older crawl/build, before the current internal-link structure existed;
2. scoped to a different hostname, URL set, crawl mode, or filtered subset;
3. using a metric different from “number of distinct internal source pages” (for example, link occurrences/inlinks rather than unique referring pages, or a dofollow-only subset);
4. based on a stale, incomplete, or otherwise mismatched export; or
5. still a genuine discrepancy that remains unexplained after like-for-like comparison.

Start with the Ahrefs report's date and exact metric definition, and verify both against the underlying export. Do not begin by proposing link changes.

## Required work

### 1. Establish the provenance of the Ahrefs finding first

Use only the Ahrefs report/export already available to you or already present in the project/work materials. Do not spend time trying to access an Ahrefs account or UI that is not connected/available, and do not ask the owner for screenshots or exports as the first step.

Record:
- report name/type and the exact finding label;
- report generation date/time and crawl date/time (distinguish report date from crawl date);
- project/property and exact hostname(s), protocol, and URL scope;
- filters applied, including page status, indexability, link attribute (follow/nofollow), and URL type;
- exact metric label and its definition as shown by Ahrefs;
- whether “1 inlink” means one link occurrence, one referring page, one dofollow link, or another measure;
- whether the export includes source/referring URLs and whether its rows represent target pages, link instances, or referring domains/pages;
- export filename, worksheet/tab, row count, column names, and any summary/total rows.

Inspect the actual export rather than relying on a dashboard screenshot, remembered number, or paraphrased finding. Preserve the export's original date and metadata. If the export is unavailable in the existing materials, state that precise limitation and stop short of treating “94” as a verified fact.

### 2. Compare dates and scope with Claude's current-build evidence

Use build/commit `ffd907f` as the reference point for the reported 115-URL link-count audit.

Establish, if evidence allows:
- whether the Ahrefs crawl happened before or after `ffd907f` was deployed;
- whether it crawled the same production hostname and the same 115 canonical sitemap URLs;
- whether the Ahrefs export's target set actually contains the 94 URLs being discussed;
- whether the Ahrefs metric can be compared directly with Claude's count of distinct internal linking pages.

Do not assume the Ahrefs crawl date equals the report export date. If deployment timing or crawl timing cannot be established from available records, mark it unknown.

### 3. Reconcile only if the export supports a valid comparison

If the raw export is available and its fields permit it, produce a compact URL-level comparison:
- normalized target URL;
- Ahrefs metric value and exact metric meaning;
- number of distinct source pages derivable from the export;
- Claude current-build distinct-source count, where the same URL can be matched;
- whether the difference is explained by crawl date, scope, filters, metric semantics, or remains unexplained.

Do not manufacture a 94-vs-115 intersection from aggregate totals. Do not claim URL-level reconciliation unless the actual rows support it.

If the export does not contain source URLs or distinct referring-page data, explicitly say that it cannot establish the number of distinct source pages. Identify the minimum missing evidence without asking for unavailable access.

### 4. Decide whether any action is justified

- If the Ahrefs finding is stale, differently scoped, or measuring a different quantity, document the correction and close the internal-link-defect hypothesis for this evidence set.
- If a like-for-like comparison confirms a real discrepancy, explain exactly which URLs and counts differ and why the two crawls may see different link graphs. Re-check only the affected URLs against the current build evidence.
- If the export is unavailable or insufficient, label the claim unverified; do not change links.
- Do not edit production code, internal links, page content, calculator formulas, prices, route distances, sitemap, or indexing settings as part of this task.
- Do not attempt GSC UI navigation, GSC exports, Crawl Stats, Manual Actions, Security Issues, or URL Inspection. Those were not available through the access path used for the prior task and are outside this revised scope.

## Required operations-room entry

Log:
1. Ahrefs report/export identity, dates, scope, and exact metric definition.
2. What the export actually contains (including row count and relevant columns).
3. Whether the report crawl predates or postdates build `ffd907f`, with evidence or an explicit unknown.
4. Whether the 94-page claim is comparable to Claude's current-build count of distinct source pages.
5. URL-level reconciliation only if supported by raw rows; otherwise state why it is impossible.
6. Final decision: corrected/stale/mismatched/unverified/confirmed discrepancy.
7. Explicit confirmation: no internal-link or production changes were made.

## Communication rule

Return evidence and conclusions, not a generic SEO checklist. Do not ask the owner to perform steps that are within your available repository/material access. If the export or report is not available, say exactly what you inspected and what was unavailable. The current verified build counts take precedence over an older unverified summary; do not preserve the “94 pages with one inlink” claim as fact without validating its date, scope, and metric definition.
