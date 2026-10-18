// "Email this estimate to myself": builds a mailto: link that opens the person's own email app with
// the estimate already written. Nothing is sent to this site. Email apps and browsers limit how long a
// mailto: link can be, so when the message is too long it drops the least useful parts in a fixed order
// (the cost lines, then the employer lines, then the three-part breakdown) and only as a last resort the
// share link. The core summary is never cut.
import { marginSummary } from "./trust.js";

export const MAX_HREF_LENGTH = 1900;

const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const gapWording = amount => amount > 0 ? `You pay ${money(amount)}` : amount < 0 ? `${money(-amount)} left over` : "Fully covered";

function requireNumbers(object, keys, label) {
  for (const key of keys) {
    if (!Number.isFinite(object?.[key])) throw new TypeError(`${label}.${key} must be a finite number.`);
  }
}

// route: "California to Texas". miles: number. result: calculateBudget() output. lines: costLines() output.
// employer: employerGap() output or null. shareUrl: link that reopens the same inputs.
export function buildEstimateEmail({ route, miles, sizeLabel, typeLabel, result, lines = [], employer = null, shareUrl = "" }) {
  if (!route || !sizeLabel || !typeLabel) throw new TypeError("route, sizeLabel and typeLabel are required.");
  if (!Number.isFinite(miles)) throw new TypeError("miles must be a finite number.");
  requireNumbers(result, ["move", "other", "contingency", "total", "rangeLow", "rangeHigh", "reserve", "cashNeeded"], "result");

  const range = `${money(result.rangeLow)}–${money(result.rangeHigh)}`;
  const subject = `Moving budget: ${route}, ${money(result.total)} (range ${range})`;
  const margin = marginSummary().label;

  const parts = {
    core: [
      "Relocation budget estimate",
      `Route: ${route} (about ${Math.round(miles).toLocaleString("en-US")} miles)`,
      `Home size: ${sizeLabel}`,
      `Move type: ${typeLabel}`,
      "",
      `Estimated budget: ${money(result.total)}`,
      `Indicative range: ${range}`,
      ...(result.reserve > 0 ? [`Cash buffer: ${money(result.reserve)}`, `Cash to have ready: ${money(result.cashNeeded)}`] : []),
    ],
    breakdown: [`Move ${money(result.move)} + other costs ${money(result.other)} + contingency ${money(result.contingency)}`],
    employer: employer ? [`Covered by your employer: ${money(employer.covered)}`, `Employer gap: ${gapWording(employer.gap)}`] : [],
    lines: lines.length ? ["Costs you entered:", ...lines.map(line => `- ${line.label}: ${money(line.amount)}`)] : [],
    link: shareUrl ? ["Reopen or change this estimate:", shareUrl] : [],
    caveat: [`This is a planning estimate, not a quote. Real quotes can differ (typical margin ${margin}). Keep written quotes from movers.`],
  };

  const compose = include => {
    const sections = [parts.core, include.breakdown && parts.breakdown, include.employer && parts.employer, include.lines && parts.lines, include.link && parts.link, parts.caveat]
      .filter(section => section && section.length);
    const body = sections.map(section => section.join("\r\n")).join("\r\n\r\n");
    return { body, href: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
  };

  const attempts = [
    { breakdown: true, employer: true, lines: true, link: true },
    { breakdown: true, employer: true, lines: false, link: true },
    { breakdown: true, employer: false, lines: false, link: true },
    { breakdown: false, employer: false, lines: false, link: true },
    { breakdown: false, employer: false, lines: false, link: false },
  ];
  for (const include of attempts) {
    const built = compose(include);
    if (built.href.length <= MAX_HREF_LENGTH) {
      return { subject, ...built, trimmed: include !== attempts[0], hasLink: include.link && parts.link.length > 0 };
    }
  }
  const last = compose(attempts[attempts.length - 1]);
  return { subject, ...last, trimmed: true, hasLink: false };
}
