// Pure helpers for keeping the quote guide's sources fresh. The weekly check (tools/check-sources.mjs)
// downloads each official page, confirms the facts the guide relies on are still stated there, and
// refreshes the "checked on" date by itself when nothing changed. The page itself also warns readers
// when the last check is too old, so a stuck check can never leave stale rules looking current.

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', ndash: "–", mdash: "—" };

const isIso = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const toUtc = iso => {
  if (!isIso(iso)) return NaN;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date.getTime() : NaN;
};

// Whole days from one ISO date to another (negative when `toIso` is earlier). NaN for a bad date.
export function ageInDays(fromIso, toIso) {
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86400000);
}

// True when the check is older than maxDays, in the future, or not a real date: anything that cannot be
// trusted is reported as stale rather than quietly shown as fresh.
export function isStale(checkedIso, todayIso, maxDays) {
  const age = ageInDays(checkedIso, todayIso);
  return !Number.isFinite(age) || age < 0 || age > maxDays;
}

// Readable text of a downloaded page: scripts, styles and page furniture removed, the main region kept
// when there is one, entities decoded, whitespace collapsed.
export function htmlToText(html) {
  let text = String(html ?? "");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/<(script|style|noscript|svg|nav|header|footer|form|aside)\b[\s\S]*?<\/\1>/gi, " ");
  const main = text.match(/<main\b[\s\S]*?<\/main>/i);
  if (main) text = main[0];
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
  text = text.replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole);
  return text.replace(/\s+/g, " ").trim();
}

// The "Last Updated" date a page states about itself, as an ISO date, or null when it states none.
export function extractPageUpdated(text) {
  const match = String(text ?? "").match(/last\s+updated\s*:?\s*(?:[A-Za-z]+,\s*)?([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
  if (!match) return null;
  const month = MONTHS.indexOf(match[1].toLowerCase());
  if (month === -1) return null;
  const iso = `${match[3]}-${String(month + 1).padStart(2, "0")}-${String(Number(match[2])).padStart(2, "0")}`;
  return Number.isFinite(toUtc(iso)) ? iso : null;
}

// Which expected phrases (regular expression sources, case-insensitive) are missing from the page text.
export function missingPatterns(text, patterns) {
  return patterns.filter(pattern => !new RegExp(pattern, "i").test(text));
}

// Decides what the weekly check does. `results` has one entry per source:
// { id, fetched, error?, missing[], hash, pageUpdated }, `stored` maps id to { contentHash, pageUpdated }.
// verified/baseline: facts present and the page unchanged (or first time seen): the date is refreshed.
// changed: facts missing or the page text differs: nothing is refreshed, a person must read the change.
// failed: a page could not be downloaded: nothing is refreshed, the next run tries again.
export function decide(results, stored, todayIso) {
  const reasons = [];
  const failedFetch = results.filter(item => !item.fetched);
  for (const item of failedFetch) reasons.push(`${item.id}: could not be downloaded (${item.error ?? "unknown error"})`);
  if (failedFetch.length) return { status: "failed", reasons, updates: null };

  for (const item of results) {
    if (item.missing.length) reasons.push(`${item.id}: expected text not found on the page: ${item.missing.join(" | ")}`);
  }
  const differs = results.filter(item => stored[item.id]?.contentHash && stored[item.id].contentHash !== item.hash);
  for (const item of differs) reasons.push(`${item.id}: the page text changed since it was last verified`);
  if (reasons.length) return { status: "changed", reasons, updates: null };

  const baseline = results.some(item => !stored[item.id]?.contentHash);
  const updates = {
    lastVerified: todayIso,
    sources: Object.fromEntries(results.map(item => [item.id, { contentHash: item.hash, pageUpdated: item.pageUpdated ?? stored[item.id]?.pageUpdated ?? null }])),
  };
  return { status: baseline ? "baseline" : "verified", reasons: [], updates };
}
