# AI search visibility and distribution playbook — 2026-11-15

## Current platform guidance

### Google Search / AI Overviews / AI Mode

Google's current guidance says generative Search features draw from the normal Search index and ranking/quality systems. Pages need to be indexed and eligible for snippets; there is no separate GEO markup or guaranteed inclusion. Google's official guidance prioritizes:
- Original, useful, non-commodity information that answers real user questions.
- Crawlable, technically clear pages with useful internal links and strong page experience.
- Accurate, dated source disclosures and first-hand or original data.
- Measuring AI-feature visibility in the Search Console Generative AI performance report.

Do not spend time on unsupported GEO hacks: Google says it does not use llms.txt for Search, does not require content chunking, and warns against inauthentic mentions or scaled pages made only to influence rankings.

Official sources:
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://support.google.com/webmasters/answer/16908024?hl=en (Search generative AI control; global rollout announced Aug 31, 2026)
- https://developers.google.com/search/updates

### Bing / Microsoft Copilot

Bing Webmaster Tools introduced AI Performance in public preview on 2026-02-10. It exposes total citations, average cited pages, grounding queries, page-level citation activity, and trends across supported AI answer surfaces. On 2026-10-13 Bing announced Topics Portfolio beta, grouping grounding queries into topic clusters and surfacing opportunity queries where other sites appear but ours does not.

Official sources:
- https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/
- https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/

## Relocation Cost execution plan

1. Confirm Search Console's Search generative AI control is set to include the site's links/content. Do not change it without checking the property's current setting.
2. Check whether AI Performance and Topics Portfolio are available for the verified Bing property. If available, save a baseline of citations, cited URLs, grounding queries and topic opportunities.
3. Use the site's real strengths as citation assets: route-distance methodology, dated full-service range tables with cell sample counts, transparent limits, employer-package comparison, and route calculators.
4. Make every source-backed data page self-contained: define the metric, date window, sample size, unit, service scope, method, limitations and source link near the numbers.
5. Build a weekly query-to-page map from GSC and Bing grounding queries. Improve the best existing page for each intent; do not create near-duplicate pages for keyword variants.
6. Turn verified data into distribution assets: a concise methodology page, a downloadable table where licensing permits, charts with source notes, and short editorial summaries for relevant relocation/job-resource publishers. Do not invent research, testimonials, expert credentials or customer counts.
7. Measure referrals and qualified calculator use, not just social impressions or backlink counts. Keep a source/placement log with URL, publication date, audience fit, referral clicks and any resulting citations.

## Automation boundary

Safe to automate once the relevant account integrations are available:
- Scheduled GSC/Bing data pulls and anomaly detection.
- Weekly AI citation/topic snapshots and query-to-page opportunity lists.
- Drafting source-backed charts, short summaries and outreach drafts.
- Opening GitHub issues/PRs for verified technical fixes and content updates.
- Rechecking published URLs, sitemap status and preview builds.

Do not automatically publish unreviewed AI-generated pages, post from personal accounts, send outreach, buy links, create mass directory entries or make unsupported claims. Public distribution should be tied to a useful, verifiable asset and the destination platform's account permissions. A successful AI citation or search impression is not guaranteed by any tactic.
