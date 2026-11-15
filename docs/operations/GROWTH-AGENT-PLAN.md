# Relocation Cost Growth Agent — product plan (owner-approved direction, 2026-11-15)

## Mission

Build a project-owned growth agent that independently discovers legitimate distribution opportunities, turns verified Relocation Cost evidence into useful shareable assets, identifies relevant publishers/communities/partners, and learns which channels generate qualified visits and product use.

This is a product capability, not a generic link poster or an SEO-metrics dashboard. Its job is to find the right audience and deliver something genuinely useful to them.

## Intended operating loop

1. **Discover** — monitor relevant, permitted public sources and approved feeds for relocation questions, moving-season topics, employer mobility resources, housing/job transition resources, publisher requests, and partnership opportunities.
2. **Qualify** — score each opportunity for audience fit, real user need, topical relevance, evidence availability, effort, policy/platform fit, and expected value. Reject low-quality, repetitive, irrelevant, or unverifiable opportunities.
3. **Create** — use only approved project data and sources to produce a tailored asset: a chart, route-cost explainer, comparison table, mini-calculator, embeddable tool, short research note, or a publisher-specific pitch. Include dates, definitions, sample sizes, methodology, limitations and source links where applicable.
4. **Match** — identify the exact page, publisher, resource page, community or partner that would benefit. Explain why the asset helps that audience. Keep a source URL and contact/publishing route for each opportunity.
5. **Distribute** — publish or submit only through approved channels and within explicit permissions. The long-term target is autonomous publication to a pre-approved allowlist of owned channels and partner endpoints with strict rate limits and content checks. New external accounts, unsolicited outreach, community posts, guest posts, paid placements, and partner commitments remain approval-gated until the owner explicitly enables each channel.
6. **Measure** — track published asset ID, destination, timestamp, referral source, UTM campaign, qualified sessions, calculator starts/completions, partner referrals, and verifiable citations where supported. Do not treat impressions or raw link count as success.
7. **Learn** — compare outcomes by audience/channel/asset, stop repeating weak tactics, and propose the next highest-value experiment.

## Autonomy levels

- **Level 0 — Research only:** discover and rank opportunities; no external actions.
- **Level 1 — Draft:** create assets, pitch drafts and publishing packages; owner reviews.
- **Level 2 — Approved-channel autopublish:** autonomous publication only to explicitly allowlisted owned channels or endpoints, after automated quality/policy checks and successful dry runs. Rate limits, duplicate detection, rollback/removal path and audit log required.
- **Level 3 — Partner distribution:** only individually approved partner routes; never infer permission to contact or publish from a discovered email/address. No bulk unsolicited messages.

Start at Level 0/1. Do not jump to autonomous public posting until the channel permissions, platform terms, credentials, safety checks, monitoring and rollback are implemented and tested. Owner's goal is increasing autonomy over time, not permanent manual drafting.

## First MVP — Opportunity Scout

Build the smallest useful version before a full autonomous publisher:

- Run on a schedule (target every 1–2 days when sources and quotas permit).
- Pull from approved sources/connectors/feeds; prefer official APIs, RSS, publisher resource pages and explicit calls for contributions. Respect robots, terms, rate limits and privacy.
- Generate a ranked shortlist with: opportunity, audience, evidence/asset needed, destination, reason for fit, suggested action, risk/permission state, estimated effort and confidence.
- Produce one strongest ready-to-use asset or pitch draft from verified project data per run, not a flood of generic content.
- Save results to a versioned Growth Agent log in the repository; deduplicate previously seen opportunities.
- Keep outbound actions disabled in MVP. Notify/report the owner with concise results.

## Proposed technical shape

- A separate agent service integrated with the existing Astro site/repository, not code that blocks the calculator's runtime.
- Evaluate Vercel's durable agent framework **eve** as the default agent runtime; verify current package documentation before implementation. Use Vercel AI Gateway or an explicitly approved model provider; never commit API keys.
- Typed tools for: source discovery, evidence retrieval, asset generation, opportunity scoring, GitHub draft creation, approved-channel publishing, analytics retrieval, and audit logging. Each tool gets least-privilege credentials.
- Durable scheduled runs, per-source budgets, retries, deduplication, structured outputs, and human-approval gates.
- Store only opportunity metadata and public source excerpts/links needed for the task; avoid personal data and do not collect people's moving details.
- Keep secrets in managed environment variables/secret storage. Separate read-only research credentials from publishing credentials.
- Add evals for factual accuracy, source traceability, audience relevance, duplication, spam risk, policy compliance, and action authorization before enabling publishing.

## Initial source and channel candidates

Research candidates, not approved integrations:
- Search Console and Bing Webmaster data for understanding page/referral outcomes (not as a proxy for product quality).
- Public RSS feeds and official publisher/editor request pages.
- Relevant employer mobility, HR, relocation, housing, renter/homebuyer and moving-resource publishers.
- Approved owned channels once owner selects and connects them.
- Relevant community spaces only where rules explicitly permit resource contributions and the asset directly answers a live question.

No scraping behind logins, no automated SERP queries, no fake community identities, no mass directory submissions, no link exchanges, no paid links intended to manipulate rankings, no bulk unsolicited outreach, and no repetitive posting.

## Success criteria

- Opportunities are genuinely relevant and deduplicated.
- Every factual claim in an asset traces to an approved source with date/scope/limitations.
- The agent saves owner time and produces assets that a real audience can use independently.
- Distribution produces qualified referral visits and meaningful calculator use, not just posted URLs.
- Zero unauthorized posts/messages, privacy incidents, fabricated claims, or policy violations.
- The agent can explain why it selected an opportunity and provide an audit trail of every action.

## Build gates and sequence

1. **Design/permission gate:** inventory available integrations, source rights, target channels, credentials and costs. Confirm production deployment model and owner-controlled channel allowlist.
2. **MVP research prototype:** one scheduled scout; read-only source discovery; ranked opportunities; one evidence-backed asset/pitch draft; deduplication and audit log.
3. **Evaluation:** run against historical/manual examples; owner reviews relevance and evidence; fix false positives and generic output.
4. **Owned-channel automation:** add one approved owned channel at a time, dry-run first, then low-volume autopublish with rollback.
5. **Partner workflow:** build tailored partner proposals; keep sending approval-gated until each partner route is explicitly authorized.
6. **Optimization:** use referral and calculator funnel outcomes to improve source selection, asset formats and timing.

## Current constraints and dependencies

- Do not describe CMR's current sample as a nationally representative moving-price dataset. B15 remains open due to sample limitations and the 4+BR discrepancy with Long Distance Moving.
- Do not publish route-distance data or extracts until B8 licensing is resolved.
- No price-model coefficients or calculator formulas are changed by the Growth Agent.
- The agent must not use GSC impressions/clicks as a substitute for product competitiveness.
- No new public posting or external outreach is authorized merely by this plan. The owner has approved developing the capability and progressively increasing autonomy subject to the gates above.

## First implementation task

Inventory the currently connected/available integrations and identify the lowest-cost permitted sources and one owned destination suitable for a dry-run. Then implement **one read-only Opportunity Scout run** that produces a ranked, deduplicated report and one asset draft with full source traceability. Do not build the publisher before the scout proves useful.
