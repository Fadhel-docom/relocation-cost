import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ageInDays, decide, extractPageUpdated, htmlToText, isStale, manualDue, missingPatterns, oldestDate, uhaulBandPatterns } from "./source-freshness.js";
import { CHECKED_AUTO, CHECKED_MANUAL, CHECKED_ON, MAX_AGE_DAYS, SOURCES } from "./quote-guide.js";

const data = JSON.parse(fs.readFileSync(new URL("../../data/source-checks.json", import.meta.url), "utf8"));

test("ageInDays counts whole days across month ends and leap years", () => {
  assert.equal(ageInDays("2026-10-18", "2026-10-18"), 0);
  assert.equal(ageInDays("2026-10-18", "2026-10-19"), 1);
  assert.equal(ageInDays("2026-01-31", "2026-03-01"), 29);
  assert.equal(ageInDays("2028-02-28", "2028-03-01"), 2);
  assert.equal(ageInDays("2026-10-19", "2026-10-18"), -1);
  assert.ok(Number.isNaN(ageInDays("2026-02-30", "2026-03-01")));
  assert.ok(Number.isNaN(ageInDays("nope", "2026-03-01")));
});

test("a check is stale only after the limit, and anything untrustworthy counts as stale", () => {
  assert.equal(isStale("2026-04-21", "2026-10-18", 180), false);
  assert.equal(ageInDays("2026-04-21", "2026-10-18"), 180);
  assert.equal(isStale("2026-04-20", "2026-10-18", 180), true);
  assert.equal(isStale("2026-10-18", "2026-10-18", 180), false);
  assert.equal(isStale("2026-10-19", "2026-10-18", 180), true, "a date in the future is not a fresh check");
  for (const bad of ["", "2026-13-01", null, undefined, "yesterday"]) assert.equal(isStale(bad, "2026-10-18", 180), true, String(bad));
});

test("htmlToText keeps the readable text of the main region and drops page furniture", () => {
  const html = `<html><head><style>.a{}</style><script>var x=1</script></head><body>
    <nav>Menu Home</nav><header>Site header</header>
    <main><h1>Binding &amp; non-binding</h1><p>The mover can&#39;t require more than 110&nbsp;percent.</p><script>evil()</script></main>
    <footer>Footer links</footer></body></html>`;
  const text = htmlToText(html);
  assert.equal(text, "Binding & non-binding The mover can't require more than 110 percent.");
  assert.equal(htmlToText("<p>No   main\n region</p><footer>x</footer>"), "No main region");
  assert.equal(htmlToText(null), "");
});

test("extractPageUpdated reads the date a page states about itself", () => {
  assert.equal(extractPageUpdated("Something. Last Updated: October 26, 2023 More"), "2023-10-26");
  assert.equal(extractPageUpdated("Last Updated Monday, November 4, 2024"), "2024-11-04");
  assert.equal(extractPageUpdated("last updated: March 3, 2025"), "2025-03-03");
  assert.equal(extractPageUpdated("Last updated: Smarch 3, 2025"), null);
  assert.equal(extractPageUpdated("Last updated: February 30, 2025"), null);
  assert.equal(extractPageUpdated("No date here"), null);
});

test("missingPatterns is case and spacing tolerant and reports what is absent", () => {
  const text = "The mover cannot require more than 110 percent of the Non-Binding Estimate. Full (Replacement) Value protection applies.";
  assert.deepEqual(missingPatterns(text, ["110 percent of the non-binding estimate", "full\\s*(\\(replacement\\)\\s*)?value"]), []);
  assert.deepEqual(missingPatterns(text, ["110 percent", "15 percent", "30 days"]), ["15 percent", "30 days"]);
  assert.throws(() => missingPatterns(text, ["("]));
});

const ok = (id, hash = "h-" + id, extra = {}) => ({ id, fetched: true, missing: [], hash, pageUpdated: null, ...extra });
const stored = ids => Object.fromEntries(ids.map(id => [id, { contentHash: "h-" + id, pageUpdated: "2023-10-26" }]));

test("decide: unchanged pages with every fact present are verified and the date is refreshed", () => {
  const ids = ["a", "b"];
  const decision = decide(ids.map(id => ok(id)), stored(ids), "2026-10-25");
  assert.equal(decision.status, "verified");
  assert.deepEqual(decision.reasons, []);
  assert.equal(decision.updates.sources.a.lastVerified, "2026-10-25");
  assert.equal(decision.updates.sources.b.lastVerified, "2026-10-25");
  assert.equal(decision.updates.sources.a.pageUpdated, "2023-10-26", "keeps the stored page date when the page states none");
});

test("decide: a newly stated page date replaces the stored one", () => {
  const decision = decide([ok("a", "h-a", { pageUpdated: "2025-01-02" })], stored(["a"]), "2026-10-25");
  assert.equal(decision.updates.sources.a.pageUpdated, "2025-01-02");
});

test("decide: the first check of a page is a baseline, not a change", () => {
  const decision = decide([ok("a"), ok("b")], { a: { contentHash: null }, b: { contentHash: null } }, "2026-10-25");
  assert.equal(decision.status, "baseline");
  assert.ok(decision.updates);
});

test("decide: changed text or a missing fact refreshes nothing and says why", () => {
  const changed = decide([ok("a", "different")], stored(["a"]), "2026-10-25");
  assert.equal(changed.status, "changed");
  assert.equal(changed.updates, null);
  assert.match(changed.reasons[0], /a: the page text changed/);

  const missing = decide([ok("a", "h-a", { missing: ["110 percent"] })], stored(["a"]), "2026-10-25");
  assert.equal(missing.status, "changed");
  assert.match(missing.reasons[0], /expected text not found/);
});

test("decide: a page that cannot be downloaded is a failure, whatever else is true", () => {
  const decision = decide([ok("a"), { id: "b", fetched: false, error: "HTTP 403", missing: [], hash: null }], stored(["a", "b"]), "2026-10-25");
  assert.equal(decision.status, "failed");
  assert.equal(decision.updates, null);
  assert.match(decision.reasons[0], /b: could not be downloaded \(HTTP 403\)/);
});

test("oldestDate gives the earliest valid date, and null when any date cannot be trusted", () => {
  assert.equal(oldestDate(["2026-10-18", "2026-03-01", "2026-09-01"]), "2026-03-01");
  assert.equal(oldestDate([]), null);
  assert.equal(oldestDate(["2026-10-18", ""]), null);
  assert.equal(oldestDate(["2026-10-18", "2026-02-30"]), null);
  assert.equal(oldestDate(["2026-10-18", undefined]), null);
});

test("manualDue reminds before the page warns, only for hand-checked sources", () => {
  const sources = {
    a: { monitor: "auto", lastVerified: "2020-01-01" },
    b: { monitor: "manual", lastVerified: "2026-10-18" },
    c: { monitor: "manual", lastVerified: "2026-05-01" },
    d: { monitor: "manual", lastVerified: "" },
  };
  assert.deepEqual(manualDue(sources, "2026-10-18", 180, 30), ["c", "d"]);
  assert.equal(ageInDays("2026-05-01", "2026-10-18"), 170);
  assert.deepEqual(manualDue({ x: { monitor: "manual", lastVerified: "2026-05-21" } }, "2026-10-18", 180, 30), [], "150 days old is not yet due");
  assert.deepEqual(manualDue({ x: { monitor: "manual", lastVerified: "2026-05-20" } }, "2026-10-18", 180, 30), ["x"], "151 days old is due");
});

test("the check data matches the guide's sources and the calculator's data source", () => {
  const scope = config => config.scope ?? "guide";
  const guideIds = Object.entries(data.sources).filter(([, config]) => scope(config) === "guide").map(([id]) => id);
  assert.deepEqual(guideIds.sort(), SOURCES.map(source => source.id).sort());
  for (const [id, config] of Object.entries(data.sources)) {
    assert.ok(["guide", "calculator", "truck-guide", "cost-of-living", "scam-guide"].includes(scope(config)), `${id}: scope`);
    assert.ok(["auto", "manual"].includes(config.monitor), `${id}: monitor must be auto or manual`);
    assert.match(config.lastVerified, /^\d{4}-\d{2}-\d{2}$/, id);
    if (config.patternsFrom) assert.ok(["uhaul-bands", "truck-volumes"].includes(config.patternsFrom), id);
    else assert.ok(config.patterns.length >= 2, `${id} needs at least two expected phrases`);
    for (const pattern of config.patterns) assert.doesNotThrow(() => new RegExp(pattern, "i"), `${id}: ${pattern}`);
    assert.ok(config.contentHash === null || /^[0-9a-f]{64}$/.test(config.contentHash), id);
    assert.ok(config.pageUpdated === null || /^\d{4}-\d{2}-\d{2}$/.test(config.pageUpdated), id);
    if (scope(config) !== "guide") assert.match(config.url, /^https:\/\//, `${id} needs its own url`);
  }
  for (const date of [CHECKED_ON, CHECKED_AUTO, CHECKED_MANUAL]) assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(CHECKED_ON <= CHECKED_AUTO && CHECKED_ON <= CHECKED_MANUAL, "overall date is the oldest");
  assert.ok(Number.isInteger(data.manualWarnDays) && data.manualWarnDays > 0 && data.manualWarnDays < MAX_AGE_DAYS);
  assert.equal(MAX_AGE_DAYS, data.maxAgeDays);
  assert.ok(MAX_AGE_DAYS >= 30 && MAX_AGE_DAYS <= 366);
});

test("the guide's dates ignore the calculator's data source", () => {
  const guideDates = Object.values(data.sources).filter(config => (config.scope ?? "guide") === "guide").map(config => config.lastVerified);
  assert.equal(CHECKED_ON, oldestDate(guideDates));
});

test("the U-Haul expected figures come from the data the calculator uses", () => {
  const coefficients = JSON.parse(fs.readFileSync(new URL("../../data/coefficients.json", import.meta.url), "utf8"));
  const patterns = uhaulBandPatterns(coefficients);
  assert.equal(patterns.length, coefficients.benchmarks.uhaul_one_way_average_by_distance.length);
  const page = "Average one-way rental by distance: 1-200 miles $202, up to 500 miles $444, $995, $1,657, $2,190, $2,694 and over 2,500 miles $3,517.";
  assert.deepEqual(missingPatterns(page, patterns), []);
  assert.deepEqual(missingPatterns(page.replace("$1,657", "$1,799"), patterns), ["\\$1,657"], "a changed figure on the page is reported");
  assert.throws(() => uhaulBandPatterns({}), TypeError);
  assert.throws(() => uhaulBandPatterns({ benchmarks: { uhaul_one_way_average_by_distance: [{ average_usd: 12.5 }] } }), TypeError);
});

test("decide: a page judged on figures only is not treated as a first-time baseline every week", () => {
  const untracked = { id: "u", fetched: true, missing: [], hash: null, pageUpdated: null };
  const decision = decide([untracked], { u: { contentHash: null } }, "2026-10-25");
  assert.equal(decision.status, "verified");
  assert.equal(decision.updates.sources.u.contentHash, null);
  assert.equal(decision.updates.sources.u.lastVerified, "2026-10-25");
  const missing = decide([{ ...untracked, missing: ["\\$1,657"] }], { u: { contentHash: null } }, "2026-10-25");
  assert.equal(missing.status, "changed");
});

test("the build never fails because a date got old: the age check only warns on the page", () => {
  const page = fs.readFileSync(new URL("../pages/guides/reading-a-moving-quote.astro", import.meta.url), "utf8");
  assert.match(page, /data-checked=/);
  assert.match(page, /data-max-days=/);
  const verify = fs.readFileSync(new URL("../../tools/verify-seo.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(verify, /source-checks|isStale/);
});
