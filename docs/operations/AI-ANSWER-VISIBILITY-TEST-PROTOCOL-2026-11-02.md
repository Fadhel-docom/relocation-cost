# AI Answer Visibility — Operational Test Protocol
**Prepared:** 2026-11-01 20:25 UTC  
**Planned first run:** 2026-11-02  
**Status:** READY FOR REVIEW — NOT A TEST RESULT

## 1. Measurement boundaries
Measure whether Relocation Cost is discovered, mentioned, cited and accurately represented for questions where the product genuinely helps. No placement is guaranteed. Keep four evidence types separate:
1. **Organic web search:** conventional result; never label it an AI citation.
2. **Direct AI answer:** generated answer in ChatGPT Search, Google AI Overviews/AI Mode or Microsoft Copilot, captured directly.
3. **Platform aggregate report:** Bing Webmaster Tools AI Performance or a Google Search Console generative-AI report, only if visible for the verified property. These are not prompt-by-prompt transcripts.
4. **Repository evidence:** proof a page/feature exists, not proof an AI platform surfaced it.
Missing evidence is **Not tested**, not zero.

## 2. Canonical prompt controls
Use exact wording and numbering in `AI-ANSWER-VISIBILITY-BENCHMARK-30-QUESTIONS-2026-11-01.md`.
- Keep wording fixed; record canonical file commit SHA with every batch.
- Language/market: English (United States).
- Start every prompt in a fresh session. Do not feed project background or mention Relocation Cost in the question.
- Do not rerun until a favorable answer appears. One canonical run per surface per cycle; replications are separately labelled.
- Save full answer and every visible citation/link, not an excerpt that omits citations.
- Record ISO timestamp/time zone, platform/surface/mode, signed-in state if known, locale/location setting if visible, device/browser and search indicator.

## 3. Platform-specific procedure
### ChatGPT Search
Use the Search-enabled experience, not ordinary chat. Confirm search was invoked through visible product behavior/citations. Save full answer and all source links. If Search is unavailable or not invoked, mark **Not tested** for this surface.

### Google AI Overviews / AI Mode
Run in Google Search with intended US locale. Record AI Overview and AI Mode separately. If a normal results page was observed without an Overview, record **No AI Overview shown in this run**; this is not proof it never appears. If AI Mode is unavailable, record **Not tested — unavailable in tested account/region/device**. Capture AI citations, not blue-link results.

### Microsoft Copilot
Use the generated-answer/search experience and record exact product surface/mode. Save all citations. If only conventional results appear, do not infer an AI citation.

### Dashboards
- Bing Webmaster Tools: check whether AI Performance is visible for the verified property; capture date range, cited pages, citation counts, grounding queries/topics and limitations.
- Google Search Console: check whether a generative-AI report is visible for this property. If absent, record **Not visible / unavailable**, not zero.
- Do not claim a dashboard metric maps to an individual benchmark prompt unless the report explicitly provides that mapping.

## 4. Ten-prompt pilot
Run these first; they cover core tool intent, route intent, methodology, trust and the employer relocation differentiator. Exact wording is in the canonical prompt file.

| # | Prompt topic | Why selected | Target |
|---:|---|---|---|
| 3 | Estimate budget before a mover quote | Core tool intent | /calculator/; /guides/relocation-budget/ |
| 9 | California to Texas moving cost | High-priority route intent | /moving-cost/ca-to-tx/ |
| 10 | Florida to New Jersey moving budget | Known first-screen gap | /moving-cost/fl-to-nj/ |
| 15 | How a calculator estimates transportation | Methodology credibility | /methodology/ |
| 18 | Straight-line fallback when road-network data is unavailable | Important limitation after road-distance rollout | /methodology/; /calculator/ |
| 23 | Binding vs non-binding estimates | Consumer trust / primary-source accuracy | /guides/reading-a-moving-quote/ |
| 26 | Verify an interstate mover | Practical consumer value | /guides/checking-a-mover/ |
| 27 | Compare employer lump sum with moving budget | Strong differentiated use case | /guides/employer-relocation-package/; /calculator/ |
| 29 | Cash assistance vs direct-paid expenses | Exact match to employer fields | /guides/employer-relocation-package/; /calculator/ |
| 30 | Taxability of employer-paid moving expenses | High-stakes accuracy check | /guides/employer-relocation-package/ |

The pilot does not replace the full 30. Run the remaining 20 in the same batch or record why they could not be run.

## 5. All-30 mapping and priority
Relevance classifications below follow Claude's 2026-11-01 source audit. They are not visibility results.

| # | Class | Target | Priority | Required check/action |
|---:|---|---|---|---|
| 1 | Relevant, underserved | /guides/moving-cost/ | P3 | Do not invent a national average; intentionally avoid unsupported market-wide claims. |
| 2 | Directly served | /guides/moving-cost/ | P3 | Verify factor list matches page and calculator inputs. |
| 3 | Directly served | /calculator/; /guides/relocation-budget/ | P1 | Explain budget use before quote and estimate limits. |
| 4 | Relevant, underserved | Existing route pages | P2 | Never relabel a 2–3 room band as exactly two bedrooms. |
| 5 | Directly served | /guides/diy-vs-movers/; /calculator/ | P3 | Do not imply optional costs are automatically included. |
| 6 | Directly served | /guides/diy-vs-movers/ | P3 | Compare scope and who does the work, not incomparable prices. |
| 7 | Directly served | /guides/moving-cost/; calculator result | P2 | Explain route, inventory, service and model-band differences without unsupported claims. |
| 8 | Directly served | /guides/reading-a-moving-quote/; /methodology/ | P2 | Distinguish planning estimate from mover's written estimate. |
| 9 | Directly served; competitive | /moving-cost/ca-to-tx/ | P1 | Do not copy quote-derived ranges; inspect first-screen answer and model assumptions. |
| 10 | Directly served; competitive | /moving-cost/fl-to-nj/ | P1 | Inspect first-screen answer and clear calculator path. |
| 11 | Directly served | /moving-cost/ny-to-pa/ | P2 | Verify page content, not only route existence. |
| 12 | Directly served | /moving-cost/oh-to-fl/ | P2 | Verify page content, not only route existence. |
| 13 | Directly served with route-data limits | /calculator/; /methodology/ | P2 | Explain representative-point road-distance table, its stored-route limits, and straight-line fallback where no road route exists; do not imply address-level routing. |
| 14 | Directly served | /calculator/ | P3 | Confirm state selectors support estimates without exact addresses. |
| 15 | Directly served | /methodology/ | P2 | Match explanation to current calculation code and data. |
| 16 | Directly served | /methodology/; /guides/diy-vs-movers/ | P2 | Distinguish included, excluded and user-entered costs. |
| 17 | Relevant, underserved | /methodology/ | P2 | ±20% is a fixed display band, not measured accuracy/confidence. |
| 18 | Relevant, underserved | /methodology/; /calculator/ | P2 | Explain state-level inputs do not provide street-address driving mileage. |
| 19 | Directly served | /guides/relocation-budget/; /methodology/ | P3 | Separate internal 10% contingency from FMCSA's 110% rule. |
| 20 | Directly served | /methodology/ | P3 | $0 is omitted, not proof the expense is free. |
| 21 | Directly served with source caveat | /guides/moving-cost/ | P2 | Historical DIY rental benchmark only; never live or universal full-service price. |
| 22 | Relevant, underserved | /guides/reading-a-moving-quote/ | P2 | Do not build a generic tool; existing competitors already compare quotes. |
| 23 | Directly served | /guides/reading-a-moving-quote/ | P2 | Verify binding estimate wording against current FMCSA primary source. |
| 24 | Directly served | /guides/reading-a-moving-quote/ | P2 | Check fees/services against source and visible guide. |
| 25 | Relevant, underserved | /guides/reading-a-moving-quote/ | P2 | Same-scope comparison need; build only if distinct no-upload gap is proven. |
| 26 | Directly served | /guides/checking-a-mover/ | P2 | Verify registration guidance against official source and date. |
| 27 | Directly served; differentiated | /guides/employer-relocation-package/; /calculator/ | P1 | Compare cash paid to employee and direct-paid expenses with calculator estimate. |
| 28 | Directly served | /guides/employer-relocation-package/ | P2 | HR questions are practical suggestions, not universal legal requirements. |
| 29 | Directly served; differentiated | /guides/employer-relocation-package/; /calculator/ | P1 | Match exact employer input fields and result labels. |
| 30 | Directly served; high-stakes | /guides/employer-relocation-package/ | P1 | Recheck current IRS primary sources; no personal tax advice or inaccurate claims. |

## 6. Observation record — one row per prompt × platform × run
Required fields:
`run_id`, `prompt_id`, `prompt_version/commit`, `tested_at`, `platform/surface`, `availability`, `brand_mentioned`, `domain_cited`, `relevant_project_url_cited`, `citation_context`, `answer_accuracy`, `material_error`, `competitor_domains`, `answer_excerpt`, `evidence_link/screenshot`, `test_conditions`, `reviewer`, `next_action`.

Allowed values:
- Brand mention: Yes / No / Unclear / Not tested.
- Domain citation: Yes / No / Unclear / Not tested.
- Relevant URL citation: exact URL / No / Unclear / Not tested. Verify it opens and supports the claim.
- Accuracy: Accurate / Partly accurate / Inaccurate / Not assessable.
- Availability: Tested / Not tested / No AI Overview shown in observed SERP / dashboard not visible.

Keep dimensions separate. Report denominators and Not-tested counts. Do not collapse visibility into a vanity score. List only competitors actually cited by the platform, never competitors merely seen in organic results.

## 7. Escalation and closure
Immediately flag any answer that:
- calls the calculator a binding quote or guaranteed price;
- describes state-centroid straight-line distance as driving mileage;
- describes ±20% as measured accuracy or confidence;
- confuses the internal 10% buffer with FMCSA's 110% rule;
- describes a historical truck-rental benchmark as live, current or full-service pricing;
- misstates FMCSA estimate rules or mover verification;
- gives an incorrect/outdated tax statement for prompt 30.

Disposition:
- **Served / monitor:** target page answers intent; no material gap identified. Keep open for visibility observation.
- **Improve:** exact content/product/source gap documented with owner; only then propose scoped work under approval gate.
- **Intentionally not competing:** relevant query requires unsupported market-wide data or out-of-scope feature; explain why.
- **Out of scope:** only genuinely unrelated questions, with reason.
- No prompt closes after one appearance. For a visibility outcome, require accurate, relevant mention/citation in at least two separate dated runs. This is a monitoring rule, not a ranking guarantee.
- No citation does not automatically justify rewriting. First check user value, evidence quality and competitor advantage.

## 8. Ownership and next actions
**ChatGPT:** run the ten-prompt pilot on surfaces actually accessible; save evidence; review factual accuracy; convert repeatable gaps into one prioritized recommendation.  
**Claude:** review this runbook and verify mappings, UI labels and prompt 30 sources. If direct AI surfaces/dashboard are available, run the same pilot and attach evidence. Otherwise state unavailable. Do not repeat the full 30-row audit, change production, submit URLs or send outreach.  
**Owner:** only if a platform/dashboard is accessible solely to the owner, add a screenshot/export; do not repeat repository research.

## 9. Status
- PR #156 merged on 2026-11-01; documentation-only, no production/indexing changes.
- The benchmark remains **OPEN / NOT COMPLETE**.
- This runbook is a protocol, not a test result. No new direct AI-platform observations are claimed here.
- No production edits, indexing requests or outreach are authorized. The 2026-11-05 measurement gate remains in force.
