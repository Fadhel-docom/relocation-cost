import test from "node:test";
import assert from "node:assert/strict";
import { MAX_HREF_LENGTH, buildEstimateEmail } from "./estimate-email.js";
import { calculateBudget, costLines, employerGap, ITEMIZED_KEYS } from "./calculator.js";

const IDS = ["fromState", "toState", "distance", "size", "type", "travel", "housing", "setup", "extras", ...ITEMIZED_KEYS, "employerCash", "employerDirect", "reserveWeeks", "weeklyLiving"];
const shareUrlFor = values => "https://relocation-cost-psi.vercel.app/calculator/?" + new URLSearchParams(IDS.map(id => [id, String(values[id] ?? "0")])).toString();

function scenario(extra = {}) {
  const input = { distance: 1317, size: 1.35, type: 1, ...extra };
  const result = calculateBudget(input);
  return {
    route: "California to Texas",
    miles: input.distance,
    sizeLabel: "2–3 rooms",
    typeLabel: "Rental truck + labor",
    result,
    lines: costLines(input),
    employer: employerGap(input, result),
    shareUrl: shareUrlFor({ fromState: "CA", toState: "TX", ...input }),
  };
}

const parse = href => {
  const [, query] = href.split("mailto:?");
  const [subject, body] = query.split("&body=");
  return { subject: decodeURIComponent(subject.replace("subject=", "")), body: decodeURIComponent(body) };
};
const fmt = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

test("a simple estimate becomes a mailto link with the real figures", () => {
  const input = scenario();
  const email = buildEstimateEmail(input);
  assert.ok(email.href.startsWith("mailto:?subject="));
  const { subject, body } = parse(email.href);
  assert.equal(subject, email.subject);
  assert.match(subject, /^Moving budget: California to Texas, \$/);
  assert.ok(subject.includes(fmt(input.result.total)));
  for (const value of [input.result.total, input.result.rangeLow, input.result.rangeHigh, input.result.move, input.result.contingency]) {
    assert.ok(body.includes(fmt(value)), `missing ${fmt(value)}`);
  }
  assert.ok(body.includes("Route: California to Texas (about 1,317 miles)"));
  assert.ok(body.includes("Home size: 2–3 rooms") && body.includes("Move type: Rental truck + labor"));
  assert.ok(body.includes(input.shareUrl));
  assert.match(body, /planning estimate, not a quote/);
  assert.equal(email.trimmed, false);
  assert.equal(email.hasLink, true);
  assert.ok(email.href.length <= MAX_HREF_LENGTH);
});

test("entered costs, cash buffer and employer gap appear only when present", () => {
  const plain = parse(buildEstimateEmail(scenario()).href).body;
  assert.doesNotMatch(plain, /Costs you entered|Cash to have ready|Employer gap/);

  const rich = scenario({ fuel: 300, storage: 150, reserveWeeks: 4, weeklyLiving: 500, employerCash: 800 });
  const body = parse(buildEstimateEmail(rich).href).body;
  assert.match(body, /Costs you entered:\r\n- Fuel: \$300\r\n- Storage: \$150/);
  assert.ok(body.includes(`Cash to have ready: ${fmt(rich.result.cashNeeded)}`));
  assert.ok(body.includes(`Covered by your employer: ${fmt(800)}`));
  assert.match(body, /Employer gap: (You pay|\$[\d,]+ left over|Fully covered)/);
});

test("employer gap wording follows the sign of the gap", () => {
  const base = scenario({ employerCash: 1 });
  const pays = buildEstimateEmail({ ...base, employer: { covered: 100, gap: 250 } });
  assert.match(parse(pays.href).body, /Employer gap: You pay \$250/);
  const surplus = buildEstimateEmail({ ...base, employer: { covered: 5000, gap: -400 } });
  assert.match(parse(surplus.href).body, /Employer gap: \$400 left over/);
  const even = buildEstimateEmail({ ...base, employer: { covered: 2000, gap: 0 } });
  assert.match(parse(even.href).body, /Employer gap: Fully covered/);
});

test("line breaks are CRLF and the link stays under the limit even with every cost entered", () => {
  const everything = Object.fromEntries(["travel", "housing", "setup", "extras", ...ITEMIZED_KEYS].map(key => [key, 12345]));
  const input = scenario({ ...everything, reserveWeeks: 12, weeklyLiving: 99999, employerCash: 5000, employerDirect: 3000 });
  const email = buildEstimateEmail(input);
  assert.ok(email.href.length <= MAX_HREF_LENGTH, `${email.href.length}`);
  assert.ok(email.href.includes("%0D%0A"));
  assert.ok(!email.href.includes("%0A%0A") || email.href.includes("%0D%0A"));
  const body = parse(email.href).body;
  assert.ok(body.includes(fmt(input.result.total)) && body.includes(fmt(input.result.rangeHigh)));
});

test("too long a message drops cost lines first, then employer, then the breakdown, and the link last", () => {
  const rich = scenario({ fuel: 1, storage: 2, tips: 3, access: 4, specialty: 5, insurance: 6, employerCash: 7 });
  const longLabel = { ...rich, lines: rich.lines.map(line => ({ ...line, label: line.label + " " + "x".repeat(150) })) };
  const noLines = buildEstimateEmail(longLabel);
  assert.equal(noLines.trimmed, true);
  const body1 = parse(noLines.href).body;
  assert.doesNotMatch(body1, /Costs you entered/);
  assert.match(body1, /Employer gap/);
  assert.ok(noLines.hasLink);

  const hugeLink = { ...rich, shareUrl: "https://relocation-cost-psi.vercel.app/calculator/?" + "a=b&".repeat(500) };
  const noLink = buildEstimateEmail(hugeLink);
  assert.equal(noLink.hasLink, false);
  assert.equal(noLink.trimmed, true);
  assert.ok(noLink.href.length <= MAX_HREF_LENGTH);
  const body2 = parse(noLink.href).body;
  assert.ok(body2.includes(fmt(rich.result.total)));
  assert.doesNotMatch(body2, /Reopen or change/);
});

test("never prints undefined or NaN, and rejects missing figures", () => {
  const body = parse(buildEstimateEmail(scenario({ reserveWeeks: 6, weeklyLiving: 300, employerDirect: 900 })).href).body;
  assert.doesNotMatch(body, /undefined|NaN|\[object/);
  const input = scenario();
  assert.throws(() => buildEstimateEmail({ ...input, result: { ...input.result, total: NaN } }), TypeError);
  assert.throws(() => buildEstimateEmail({ ...input, miles: undefined }), TypeError);
  assert.throws(() => buildEstimateEmail({ ...input, route: "" }), TypeError);
  assert.throws(() => buildEstimateEmail({ ...input, result: undefined }), TypeError);
});

test("special characters in the message survive the link", () => {
  const email = buildEstimateEmail({ ...scenario(), route: "Texas & Oklahoma", shareUrl: "https://example.com/?a=1&b=2" });
  const { subject, body } = parse(email.href);
  assert.match(subject, /Texas & Oklahoma/);
  assert.ok(body.includes("https://example.com/?a=1&b=2"));
  assert.ok(!email.href.slice("mailto:?".length).replace("&body=", "").includes(" "));
});
