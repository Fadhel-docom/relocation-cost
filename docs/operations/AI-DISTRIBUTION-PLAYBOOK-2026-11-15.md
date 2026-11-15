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
- https://support.google.com/webmasters/answer/16984139?hl=en-CM (Generative AI performance report; impressions, pages, countries, devices and dates; it does not provide query or click data)
- https://developers.google.com/search/updates

### Bing / Microsoft Copilot

Bing Webmaster Tools introduced AI Performance in public preview on 2026-02-10. It exposes total citations, average cited pages, grounding queries, page-level citation activity, and trends across supported AI answer surfaces. On 2026-10-13 Bing announced Topics Portfolio beta, grouping grounding queries into topic clusters and surfacing opportunity queries where other sites appear but ours does not.

Official sources:
- https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/
- https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/

## Relocation Cost execution plan

1. Confirm Search Console's Search generative AI control is set to include the site's links/content. The default is Include, but verify the actual property setting before relying on it. The Google AI report only appears when there is enough AI-feature impression data and does not expose queries or clicks.
2. Check whether AI Performance and Topics Portfolio are available for the verified Bing property. If available, save a baseline of citations, cited URLs, grounding queries and topic opportunities. The current connected Composio Bing and Google Search Console APIs expose ordinary search-performance/indexing endpoints only; they do not currently expose these AI-specific reports, so the initial AI report check must be made in the relevant webmaster UI or through a supported browser workflow.
3. Use the site's real strengths as citation assets: route-distance methodology, dated full-service range tables with cell sample counts, transparent limits, employer-package comparison, and route calculators.
4. Make every source-backed data page self-contained: define the metric, date window, sample size, unit, service scope, method, limitations and source link near the numbers.
5. Build a weekly query-to-page map from GSC and Bing grounding queries. Improve the best existing page for each intent; do not create near-duplicate pages for keyword variants.
6. Turn verified data into distribution assets: a concise methodology page, a downloadable table where licensing permits, charts with source notes, and short editorial summaries for relevant relocation/job-resource publishers. Do not invent research, testimonials, expert credentials or customer counts.
7. Measure referrals and qualified calculator use, not just social impressions or backlink counts. Google’s AI report has impressions but no query or click dimensions; Bing AI Performance provides citation/grounding-query data. Keep a source/placement log with URL, publication date, audience fit, referral clicks and any resulting citations.

## Automation boundary

Safe to automate once the relevant account integrations are available:
- Scheduled GSC/Bing data pulls and anomaly detection.
- Weekly AI citation/topic snapshots and query-to-page opportunity lists.
- Drafting source-backed charts, short summaries and outreach drafts.
- Opening GitHub issues/PRs for verified technical fixes and content updates.
- Rechecking published URLs, sitemap status and preview builds.

Do not automatically publish unreviewed AI-generated pages, post from personal accounts, send outreach, buy links, create mass directory entries or make unsupported claims. Public distribution should be tied to a useful, verifiable asset and the destination platform's account permissions. A successful AI citation or search impression is not guaranteed by any tactic.


## 2026-11-15 update — distribution automation that can earn real clicks

### 1. Event-driven discovery, not repeated manual submissions
- Prefer IndexNow for eligible URL additions, material updates and deletions. Bing now explicitly recommends IndexNow as its preferred automated notification path; one submission is shared with participating search engines.
- Integrate only after the production hostname is confirmed, the site ownership/key file is verified, and the key is stored safely. Trigger on the actual production deployment or a reviewed publish event, not every preview build.
- Submit only canonical URLs that genuinely changed. Log URL, deployment commit, timestamp, response code and later crawl/index status. A successful submission means notification accepted, not indexed.
- Do not bulk-resubmit the existing sitemap or repeatedly submit unchanged pages.

### 2. Google indexing: avoid the wrong API
- Google's Indexing API is restricted to pages with JobPosting or BroadcastEvent in VideoObject. Relocation Cost's calculator and guides do not qualify; do not attempt to use it.
- For ordinary pages, maintain a clean XML sitemap, crawlable internal links, correct canonical/robots/status, and use Search Console URL inspection/reporting for diagnosis. Do not automate Google SERP scraping or automated query traffic.

### 3. Automated opportunity-to-click loop
Run a weekly analysis from Search Console and Bing:
1. Find queries/pages with meaningful impressions but weak CTR, and pages ranking roughly positions 8–40 where the landing page satisfies the intent.
2. Map each query cluster to one best existing destination. Flag mismatches such as generic calculator intent landing on the homepage while /calculator/ is not indexed; diagnose index eligibility before changing destinations.
3. Prioritize one page-level experiment at a time: title/snippet clarity, first-screen answer, internal link anchor/context, or calculator entry friction. Never use clickbait or promise a result the page does not deliver.
4. Record baseline, exact change, date, comparison window and result. Keep changes that improve qualified clicks and calculator completion without harming accuracy or user experience.

### 4. Turn verified product evidence into distribution assets
- Repackage only already verified, licensable project data into a source-labelled chart/table, a short explainer, and a publisher-ready research note. Each asset must include methodology, date, sample size, definitions and limitations.
- Do not release route-distance extracts or third-party datasets until the open licensing question B8 is resolved. Do not promote the CMR range as a national market average; B15's 4+BR discrepancy remains open.
- Research relevant relocation, HR, employer mobility and housing resource pages. Prepare individual, evidence-led partnership pitches only where the asset solves a reader problem. Keep outreach drafts for human review; no bulk unsolicited sending or automated account posting.

### 5. Measurement and automation architecture
- Use a first-party event funnel only if the analytics integration supports it and privacy requirements are met: landing page → calculator start → estimate shown → optional comparison/print/share action. Do not collect names, emails, addresses or move details unless genuinely necessary and explicitly consented.
- Track qualified organic clicks, referral sessions, calculator starts/completions, and partner referrals. Treat impressions, AI citations and social reach as discovery signals, not business outcomes.
- Automate data extraction, anomaly flags, weekly opportunity lists, draft assets, PR creation and URL rechecks. Require human approval for public publishing, external outreach, account posting, licensing decisions and any price/model change.

### 6. Explicit no-go tactics
No scaled near-duplicate city/route pages, mass AI articles, automated link creation, paid links for ranking, mass directory submissions, scraped SERP rank checks, fake community participation, or llms.txt/Indexing-API shortcuts. Google's spam policies explicitly prohibit scaled low-value content, automated link schemes and machine-generated search queries.

## Official automation references
- IndexNow FAQ and submission protocol: https://www.indexnow.org/faq.html
- Bing URL submission guidance (IndexNow recommended): https://www.bing.com/webmasters/help/?topicid=62f2860b
- Google Indexing API eligibility: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Google spam policies (scaled content, link spam, machine-generated traffic): https://developers.google.com/search/docs/essentials/spam-policies
- Google Search Essentials (helpful content, crawlable links, tell people about your site): https://developers.google.com/search/docs/essentials


## 2026-11-15 implementation — crawler eligibility and citation-readiness

### Verified project facts
- Vercel lists `relocation-cost-psi.vercel.app` as the project's only attached production domain (verified). The Astro `site` setting and sitemap host use the same domain. Do not test or configure `relocation-cost.com`; it is not the project's domain.
- Before this change, `public/robots.txt` used `User-agent: * / Allow: /`, which already permitted OAI-SearchBot by inheritance. It did not explicitly name it.
- Updated `public/robots.txt` to add a dedicated `OAI-SearchBot` allow group. The wildcard rule remains for other crawlers.
- GPTBot remains allowed under the existing wildcard rule. This change does not opt the site in or out of training differently from before; any GPTBot policy change requires a separate owner decision.
- Vercel reports no custom firewall configuration for this project; the default firewall applies. This is not proof that all OpenAI crawler IPs can fetch the site. No live external fetch was possible from the current execution environment, so production delivery remains unverified until deployment and a real HTTP/log check.

### OpenAI crawler controls — do not conflate
- `OAI-SearchBot`: controls automatic discovery for ChatGPT Search. Keep allowed if the goal is eligibility for ChatGPT search answers.
- `GPTBot`: used to crawl content that may be used to train OpenAI foundation models. Its robots policy is independent of OAI-SearchBot. Current wildcard behavior allows it; do not silently change that policy.
- `ChatGPT-User`: used for certain user-initiated fetches; it is not the automatic Search crawler and does not determine Search inclusion.
- OpenAI also recommends allowing OAI-SearchBot's published IP ranges through host/CDN controls. Verify this separately; robots.txt alone is insufficient.
- OpenAI says its Search systems may take about 24 hours to reflect a robots.txt change. This is not a promise of a crawl, citation or ranking.

Official source: https://developers.openai.com/api/docs/bots
Publisher FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

### Required citation-readiness audit for important landing pages
Score each existing page against evidence, not a generic word-count recipe:
1. **Intent match:** identify the real query/task and make the page answer it directly near the top.
2. **Quote-worthiness:** include a concise, self-contained answer that remains accurate when quoted without surrounding marketing copy.
3. **Evidence adjacent to claims:** show source, date, metric definition, units, sample size and service scope beside numbers; disclose limitations and avoid national-market claims from one provider.
4. **Distinctive utility:** provide an original calculation, comparison, route/methodology detail or practical decision aid that competitors' generic summaries do not provide.
5. **Structure:** use descriptive question-led headings when they match actual user questions; add FAQs only when they answer real unresolved questions. There is no verified universal 40–60-word answer-length rule.
6. **Crawl and trust:** confirm indexability, canonical, status, internal links, visible text and source links; ensure structured data matches visible content.
7. **Outcome:** define the baseline and measure qualified organic/referral visits and calculator use; impressions and AI citations are intermediate signals.

Do not rewrite every page at once. Audit the highest-value existing destinations first, record page-level evidence and one change at a time, then measure.
