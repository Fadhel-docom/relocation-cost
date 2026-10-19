// Weekly source check for the "How to read a moving quote" guide (run by .github/workflows/check-sources.yml).
// It downloads each automatically monitored official page (monitor "auto"), confirms the facts the guide relies on are still stated there, and, only when
// everything holds and nothing changed, refreshes data/source-checks.json (the date the page shows as "checked on").
// Pages whose site blocks automated downloads (monitor "manual") are re-read by a person; this tool only reminds.
// It never edits the guide's wording: a change in a source is reported for a person to read, not applied.
//
//   node tools/check-sources.mjs                 report only
//   node tools/check-sources.mjs --write         also refresh data/source-checks.json when verified
//   --report <file>   write a Markdown report (used as the issue text)
// Sets the step outputs `status` (verified | baseline | changed | failed) and `manual_due` (true | false) when GITHUB_OUTPUT is available.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { SOURCES } from "../src/lib/quote-guide.js";
import { ageInDays, decide, extractPageUpdated, htmlToText, manualDue, missingPatterns, uhaulBandPatterns } from "../src/lib/source-freshness.js";

const args = process.argv.slice(2);
const write = args.includes("--write");
const reportPath = args.includes("--report") ? args[args.indexOf("--report") + 1] : null;
const dataFile = path.resolve("data/source-checks.json");
const coefficients = JSON.parse(fs.readFileSync(path.resolve("data/coefficients.json"), "utf8"));
const data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const USER_AGENT = "RelocationCostSourceCheck/1.0 (weekly check of 7 public pages; https://relocation-cost-psi.vercel.app/about/)";

async function download(url) {
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml", "accept-language": "en-US,en;q=0.9" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
      if (response.ok) return { html: await response.text() };
      lastError = `HTTP ${response.status}`;
      if (response.status === 403 || response.status === 404) break;
    } catch (error) {
      lastError = error?.cause?.code ?? error?.message ?? String(error);
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 3000));
  }
  return { error: lastError };
}

// Every entry of data/source-checks.json is checked: the guide's sources (url from the guide) and the
// calculator's data sources (url in the data file).
const items = Object.entries(data.sources).map(([id, config]) => ({ id, config, url: config.url ?? SOURCES.find(source => source.id === id)?.url }));
const results = [];
const texts = new Map();
for (const { id, config, url } of items) {
  if (config.monitor === "manual") continue;
  if (!url) {
    results.push({ id, url, fetched: false, error: "no url for this source", missing: [], hash: null, pageUpdated: null });
    continue;
  }
  const { html, error } = await download(url);
  if (error) {
    results.push({ id, url, fetched: false, error, missing: [], hash: null, pageUpdated: null });
    continue;
  }
  const text = htmlToText(html);
  texts.set(id, text);
  const patterns = config.patternsFrom === "uhaul-bands" ? uhaulBandPatterns(coefficients) : config.patterns;
  results.push({
    id,
    url,
    fetched: true,
    textLength: text.length,
    missing: text.length < 500 ? ["(page text is almost empty: the page may be blocked or has changed layout)"] : missingPatterns(text, patterns),
    // Pages that change for reasons unrelated to our figures (marketing pages) are judged on the expected figures only.
    hash: config.trackHash === false ? null : crypto.createHash("sha256").update(text).digest("hex"),
    pageUpdated: extractPageUpdated(text),
  });
}

const decision = decide(results, data.sources, today);
const dueIds = manualDue(data.sources, today, data.maxAgeDays, data.manualWarnDays);

const lines = [];
lines.push(`# Source check ${today}: ${decision.status}`, "");
lines.push("| Source | Downloaded | Facts found | Page changed | Page says updated |", "|---|---|---|---|---|");
for (const item of results) {
  const stored = data.sources[item.id];
  const changed = !item.fetched ? "?" : item.hash === null ? "figures only" : !stored?.contentHash ? "first check" : stored.contentHash !== item.hash ? "YES" : "no";
  lines.push(`| ${item.id} | ${item.fetched ? "yes" : "NO: " + item.error} | ${item.fetched ? (item.missing.length ? "MISSING " + item.missing.length : "yes") : "?"} | ${changed} | ${item.pageUpdated ?? "not stated"} |`);
}
for (const [id, source] of Object.entries(data.sources).filter(([, entry]) => entry.monitor === "manual")) {
  const age = ageInDays(source.lastVerified, today);
  lines.push(`| ${id} | by hand (site blocks automated downloads) | last read ${source.lastVerified}, ${Number.isFinite(age) ? age + " days ago" : "date invalid"} | ${dueIds.includes(id) ? "REVIEW DUE" : "ok"} | ${source.pageUpdated ?? "not stated"} |`);
}
if (dueIds.length) {
  lines.push("", "## Manual review due", ...dueIds.map(id => `- ${id}: re-read ${items.find(item => item.id === id)?.url} and confirm the guide still matches, then set \`lastVerified\` for it in data/source-checks.json (or ask Claude to "review the sources").`));
}
if (decision.reasons.length) {
  lines.push("", "## What needs a person", ...decision.reasons.map(reason => `- ${reason}`));
}
if (decision.status === "changed") {
  lines.push("", "## What the page now says (sentences added or removed)");
  for (const item of results.filter(entry => entry.fetched && data.sources[entry.id]?.contentHash && data.sources[entry.id].contentHash !== entry.hash)) {
    lines.push(`### ${item.id}`, item.url, "", "The earlier text is not stored, only its fingerprint, so this lists the sentences that mention the numbers the guide uses:");
    const text = texts.get(item.id) ?? "";
    const relevant = text.split(/(?<=[.!?])\s+/).filter(sentence => /\d+\s*(percent|%|days?|hours?)|binding|estimate/i.test(sentence)).slice(0, 12);
    lines.push(...relevant.map(sentence => `> ${sentence.slice(0, 300)}`), "");
  }
  lines.push("To fix: read the pages above, update `src/lib/quote-guide.js` (rules, figures, sources) if the rules changed, then run `node tools/check-sources.mjs --write --accept` locally or ask Claude to \"review the sources\".");
}
if (decision.status === "failed") {
  lines.push("", "Nothing was refreshed. The next weekly run tries again; the page keeps showing its last verified date and warns readers once that date is more than " + data.maxAgeDays + " days old.");
}
const report = lines.join("\n") + "\n";
// Also publish a short version as workflow annotations, which stay readable through the GitHub API.
if (process.env.GITHUB_ACTIONS) {
  const clean = text => String(text).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  console.log(`::notice title=source-check status::${clean(decision.status)} manual_due=${dueIds.join(",") || "none"}`);
  for (const item of results) {
    const stored = data.sources[item.id];
    console.log(`::notice title=source ${item.id}::${clean(JSON.stringify({ fetched: item.fetched, error: item.error ?? null, textLength: item.textLength ?? null, missing: item.missing, pageUpdated: item.pageUpdated, hash: item.hash?.slice(0, 12) ?? null, storedHash: stored?.contentHash?.slice(0, 12) ?? null }))}`);
  }
  for (const reason of decision.reasons) console.log(`::warning title=source-check::${clean(reason)}`);
}
console.log(report);
if (reportPath) fs.writeFileSync(reportPath, report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);

// --accept: a person has read the change and the guide is correct, so record the new fingerprints.
if (args.includes("--accept") && (decision.status === "changed")) {
  const accepted = decide(results.map(item => ({ ...item, missing: [] })), Object.fromEntries(Object.entries(data.sources).map(([id, value]) => [id, { ...value, contentHash: null }])), today);
  if (results.every(item => item.fetched) && accepted.updates) {
    for (const [id, update] of Object.entries(accepted.updates.sources)) Object.assign(data.sources[id], update);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
    console.log("Accepted: data/source-checks.json updated by hand.");
  }
} else if (write && decision.updates) {
  for (const [id, update] of Object.entries(decision.updates.sources)) Object.assign(data.sources[id], update);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
  console.log("data/source-checks.json refreshed.");
}

if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `status=${decision.status}\nmanual_due=${dueIds.length > 0}\n`);
// Always exit 0: the workflow reads `status` and decides what to do, so a failed check never turns the build red.
