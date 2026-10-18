// Expected vs actual budget tracking. Every amount is typed by the person: the page adds
// no price, no estimate and no assumption of its own. Lines left at 0 are left out.
export const TRACKER_LINES = Object.freeze([
  { key: "movers", label: "Movers or truck rental (your quote)" },
  { key: "travel", label: "Travel" },
  { key: "housing", label: "Temporary housing" },
  { key: "setup", label: "Deposits / setup" },
  { key: "extras", label: "Packing / extras" },
  { key: "fuel", label: "Fuel" },
  { key: "insurance", label: "Moving insurance" },
  { key: "packing", label: "Packing materials" },
  { key: "equipment", label: "Equipment rental" },
  { key: "utilities", label: "Utility connection fees" },
  { key: "storage", label: "Storage" },
  { key: "tips", label: "Crew tips" },
  { key: "specialty", label: "Specialty items" },
  { key: "access", label: "Access fees (stairs, long carry, elevator)" },
  { key: "other", label: "Anything else" },
]);

export const TRACKER_KEYS = Object.freeze(TRACKER_LINES.map(line => line.key));
export const MAX_AMOUNT = 1_000_000;

// Calculator inputs that are plain user-entered costs and can be copied as planned amounts.
export const CALCULATOR_COST_KEYS = Object.freeze(TRACKER_KEYS.filter(key => key !== "movers" && key !== "other"));

// Turns what a field or saved data holds into a safe amount: a finite number from 0 to
// MAX_AMOUNT, rounded to cents. Anything else (blank, text, negative, too large) is 0.
export function cleanAmount(value) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value.trim().replace(/,/g, "")) : NaN;
  if (!Number.isFinite(number) || number <= 0 || number > MAX_AMOUNT) return 0;
  return Math.round(number * 100) / 100;
}

// Keeps only known lines, each as a clean amount above zero (used when loading saved data).
export function cleanAmounts(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const out = {};
  for (const key of TRACKER_KEYS) {
    const amount = cleanAmount(source[key]);
    if (amount > 0) out[key] = amount;
  }
  return out;
}

// Copies the user-entered costs from saved calculator inputs. Returns {} when none were entered.
export function plannedFromCalculator(saved) {
  const source = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  const out = {};
  for (const key of CALCULATOR_COST_KEYS) {
    const amount = cleanAmount(source[key]);
    if (amount > 0) out[key] = amount;
  }
  return out;
}

const cents = value => Math.round(value * 100);
const fromCents = value => value / 100;

// Compares planned and actual amounts line by line.
// status: "over" / "under" / "on-plan" (both entered), "pending" (planned, nothing spent yet),
// "unplanned" (spent without a planned amount). difference = actual - planned, so a positive
// difference means more was spent than planned.
// Totals compare like with like: `spentLinesPlanned` is the plan for only the lines that already
// have an actual amount, so lines not yet spent do not look like savings.
export function trackBudget(planned, actual) {
  const p = cleanAmounts(planned);
  const a = cleanAmounts(actual);
  const lines = [];
  let plannedAll = 0;
  let actualAll = 0;
  let spentLinesPlanned = 0;
  let spentLinesActual = 0;
  let stillToSpend = 0;

  for (const { key, label } of TRACKER_LINES) {
    const plan = cents(p[key] ?? 0);
    const spent = cents(a[key] ?? 0);
    if (plan === 0 && spent === 0) continue;
    let status;
    if (spent === 0) status = "pending";
    else if (plan === 0) status = "unplanned";
    else status = spent > plan ? "over" : spent < plan ? "under" : "on-plan";
    const hasBoth = plan > 0 && spent > 0;
    lines.push({
      key,
      label,
      planned: fromCents(plan),
      actual: fromCents(spent),
      difference: spent > 0 ? fromCents(spent - plan) : null,
      percent: hasBoth ? Math.round(((spent - plan) / plan) * 100) : null,
      status,
    });
    plannedAll += plan;
    actualAll += spent;
    if (spent > 0) {
      spentLinesPlanned += plan;
      spentLinesActual += spent;
    } else {
      stillToSpend += plan;
    }
  }

  const spentDifference = spentLinesActual - spentLinesPlanned;
  return {
    lines,
    hasData: lines.length > 0,
    plannedTotal: fromCents(plannedAll),
    actualTotal: fromCents(actualAll),
    spentLinesPlanned: fromCents(spentLinesPlanned),
    spentDifference: fromCents(spentDifference),
    spentPercent: spentLinesPlanned > 0 ? Math.round((spentDifference / spentLinesPlanned) * 100) : null,
    stillToSpend: fromCents(stillToSpend),
    // Spent so far plus the plan for lines with no actual yet. A simple sum, not a forecast.
    expectedFinal: fromCents(spentLinesActual + stillToSpend),
    status: spentLinesActual === 0 ? "none" : spentDifference > 0 ? "over" : spentDifference < 0 ? "under" : "on-plan",
  };
}

export function formatMoney(value) {
  const whole = Number.isInteger(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// "Over by $50", "Under by $20.50" or "On plan", for a difference of actual - planned.
export function describeDifference(difference) {
  if (difference === null || difference === undefined || !Number.isFinite(difference)) return "";
  const rounded = Math.round(difference * 100) / 100;
  if (rounded === 0) return "On plan";
  return `${rounded > 0 ? "Over" : "Under"} by ${formatMoney(Math.abs(rounded))}`;
}

export function describeLine(line) {
  if (line.status === "pending") return "Not spent yet";
  if (line.status === "unplanned") return "No planned amount";
  return describeDifference(line.difference);
}
