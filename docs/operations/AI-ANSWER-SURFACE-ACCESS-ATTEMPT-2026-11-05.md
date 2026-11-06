# AI answer surface access attempt — 2026-11-05

**Repository:** Fadhel-docom/relocation-cost  
**Purpose:** Attempt the first exact canonical pilot prompt (#3) on connected AI-answer surfaces before proceeding with the ten-prompt pilot.  
**Canonical prompt #3:** “How can I estimate a moving budget before I have a mover quote?”

## Outcome

A single attempt was made for each of four surfaces through the connected OpenWeb Ninja integration. All four calls returned HTTP **403** before an answer was returned:

| Surface | Attempt | Result | Evidence captured |
|---|---|---|---|
| Google AI Mode | Exact prompt #3, US, English | 403 — unable to query Google AI Mode | No answer, citations or screenshot |
| Google AI Overview | Exact prompt #3, US, English | 403 — unable to get the AI Overview | No overview, citations or screenshot |
| Microsoft Copilot | Exact prompt #3 | 403 — unable to send the Copilot message | No answer or citations |
| ChatGPT answer connector | Exact prompt #3 | 403 — unable to send the ChatGPT message | No answer or citations |

## Correct interpretation

- This is an **access failure**, not an AI visibility result.
- Prompt #3 remains **Not tested** on all four surfaces; no brand-mention or citation score is assigned.
- The remaining nine pilot prompts were not submitted after all four initial calls failed with 403. No repeated retries or alternate provider calls were made.
- The error does not establish whether the cause is account permissions, provider policy, region, quota or another service-side restriction.
- The ChatGPT connector call is not proof that the official ChatGPT Search surface was invoked; therefore it cannot satisfy the protocol's Search-enabled requirement even if it had returned a generic answer.
- Ordinary web search and Search Console data remain separate evidence types and are not substituted for AI citations.

## Dashboard availability

The connected Google Search Console actions currently surfaced provide ordinary Search Analytics, URL inspection and sitemap operations; no generative-AI report action was returned. The connected Bing actions surfaced site-level search performance, page performance and query performance; no Bing AI Performance report action was returned. This means dashboard access is not established, not that either platform has zero AI citations.

## Next action

Keep the 30-prompt benchmark **OPEN / NOT COMPLETE**. Do not claim direct AI testing is complete. Resume only when a supported direct surface or dashboard is accessible; preserve the exact canonical wording, locale and evidence schema. No production edits, indexing requests, outreach or site changes were made by this access attempt.
