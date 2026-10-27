// Pure logic for the post-deploy check of the published site (run by tools/verify-live.mjs and
// .github/workflows/verify-live.yml). It tells four different things apart, because "the build passed"
// is not the same as "visitors see the change":
//   http_error     the page answered with a status other than 200
//   unreachable    the request itself failed (network, DNS, timeout)
//   stale_deploy   the page is served, but from an older commit than the one we expect (deploy not finished, or cache)
//   unknown_commit the page has no readable build-commit marker, or Vercel reported "unknown"
//   text_missing   the page is served from the expected commit but a phrase it must contain is absent
// A page served from a NEWER commit than expected is fine ("superseded"): a later push already replaced it.
import { FLOOR_NOTE, BAND_NOTE, SEASON_NOTE, EMPLOYER_TAX_NOTE, TAX_SOURCES } from "./trust.js";
import { TITLE as QUOTE_GUIDE_TITLE } from "./quote-guide.js";
import { TITLE as ADDRESS_CHANGE_TITLE } from "./address-change.js";

// Phrases that sit in the page source itself (not in a shared constant). A unit test reads each page file and fails
// if the phrase is no longer there, so this list cannot drift away from what the pages render.
export const ROUTE_INDEX_NOTE = "These pages are planning aids, not quotes.";
export const TRUCK_GUIDE_LEAD = "The right truck is the smallest one your belongings fit in";

// What every deployed page must show. Phrases come from the same constants the pages render.
export const LIVE_PAGES = Object.freeze([
  { path: "/", kind: "html", texts: [] },
  { path: "/calculator/", kind: "html", texts: [FLOOR_NOTE, BAND_NOTE, SEASON_NOTE, EMPLOYER_TAX_NOTE], links: TAX_SOURCES.map(source => source.url) },
  { path: "/methodology/", kind: "html", texts: [SEASON_NOTE] },
  { path: "/moving-cost/", kind: "html", texts: [ROUTE_INDEX_NOTE] },
  { path: "/guides/reading-a-moving-quote/", kind: "html", texts: [QUOTE_GUIDE_TITLE] },
  { path: "/guides/truck-size/", kind: "html", texts: [TRUCK_GUIDE_LEAD] },
  { path: "/guides/address-change/", kind: "html", texts: [ADDRESS_CHANGE_TITLE] },
  { path: "/robots.txt", kind: "text", texts: [] },
]);

// Problems that can fix themselves, so the tool waits and tries again instead of reporting at once.
export const RETRYABLE = Object.freeze(["http_error", "unreachable", "stale_deploy", "unknown_commit"]);

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// Readable text of a page. Unlike the source-check helper it keeps forms and footers, because the
// phrases we look for may sit inside the result card.
export function pageText(html) {
  let text = String(html ?? "");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
  text = text.replace(/&([a-z]+);/gi, (whole, name) => NAMED[name.toLowerCase()] ?? whole);
  return text.replace(/\s+/g, " ").trim();
}

// Every build-commit marker found in the page, in order.
export function extractBuildCommits(html) {
  const commits = [];
  for (const tag of String(html ?? "").matchAll(/<meta\b[^>]*>/gi)) {
    if (!/\bname=["']build-commit["']/i.test(tag[0])) continue;
    const content = tag[0].match(/\bcontent=["']([^"']*)["']/i);
    commits.push(content ? content[1] : "");
  }
  return commits;
}

const normalize = value => String(value ?? "").replace(/\s+/g, " ").trim();

// Classifies one fetched page.
// input: { page, status, error, body, expectedSha, isNewerCommit(sha) }
// isNewerCommit(sha) is true when `sha` is a descendant of the expected commit (a later push already deployed).
export function classifyPage({ page, status, error, body, expectedSha, isNewerCommit = () => false }) {
  const base = { path: page.path };
  if (error) return { ...base, result: "unreachable", detail: `The request failed: ${error}` };
  if (status !== 200) return { ...base, result: "http_error", detail: `HTTP ${status}` };
  if (page.kind === "text") return { ...base, result: "ok", detail: "HTTP 200" };

  const commits = extractBuildCommits(body);
  if (commits.length !== 1) {
    return { ...base, result: "unknown_commit", detail: `Expected exactly one build-commit marker, found ${commits.length}.` };
  }
  const served = commits[0];
  if (!/^[0-9a-f]{40}$/.test(served)) {
    return { ...base, result: "unknown_commit", detail: `build-commit is "${served}", not a full commit id.` };
  }
  if (served !== expectedSha) {
    if (isNewerCommit(served)) {
      return { ...base, result: "superseded", detail: `Serving ${served.slice(0, 7)}, a newer commit than ${expectedSha.slice(0, 7)}.` };
    }
    return { ...base, result: "stale_deploy", detail: `Serving ${served.slice(0, 7)} but expected ${expectedSha.slice(0, 7)}.` };
  }
  const text = normalize(pageText(body));
  const missing = page.texts.filter(phrase => !text.includes(normalize(phrase)));
  const missingLinks = (page.links ?? []).filter(url => !String(body ?? "").includes(url));
  if (missing.length || missingLinks.length) {
    const parts = [...missing.map(phrase => `"${normalize(phrase).slice(0, 60)}…"`), ...missingLinks.map(url => `link ${url}`)];
    return { ...base, result: "text_missing", detail: `Served from the expected commit, but missing: ${parts.join(", ")}` };
  }
  return { ...base, result: "ok", detail: `Commit ${served.slice(0, 7)} and ${page.texts.length} required phrase(s) present.` };
}

export const isGood = result => result === "ok" || result === "superseded";
export const isRetryable = result => RETRYABLE.includes(result);

const MEANING = {
  http_error: "The page answered, but not with HTTP 200.",
  unreachable: "The request did not complete. This says nothing about the site being down.",
  stale_deploy: "The site serves an older commit. The deploy may still be running, or a cache holds the old page.",
  unknown_commit: "The page has no usable build-commit marker, so what is deployed cannot be told.",
  text_missing: "The expected commit is deployed but a required phrase is not in the page. This is a real defect, not a delay.",
};

// Overall verdict and a Markdown report (used as the issue body).
export function summarize(results, { expectedSha, siteUrl, attempts }) {
  const problems = results.filter(entry => !isGood(entry.result));
  const status = problems.length === 0 ? "ok" : "problem";
  const lines = [
    `# Live site check: ${status}`,
    "",
    `- Expected commit: \`${expectedSha}\``,
    `- Site: ${siteUrl}`,
    `- Attempts: ${attempts}`,
    "- A passing build is not proof that visitors see the change; this check reads the published pages.",
    "",
    "| Page | Result | Detail |",
    "|---|---|---|",
    ...results.map(entry => `| \`${entry.path}\` | ${entry.result} | ${String(entry.detail).replace(/\|/g, "\\|")} |`),
  ];
  const kinds = [...new Set(problems.map(entry => entry.result))];
  if (kinds.length) {
    lines.push("", "## What each problem means", "", ...kinds.map(kind => `- **${kind}**: ${MEANING[kind]}`));
    lines.push("", "Nothing was changed. The issue closes by itself when a later run passes.");
  }
  return { status, problems, report: lines.join("\n") };
}
