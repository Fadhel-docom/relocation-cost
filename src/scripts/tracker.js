import {
  TRACKER_KEYS,
  cleanAmount,
  cleanAmounts,
  describeDifference,
  describeLine,
  formatMoney,
  plannedFromCalculator,
  trackBudget,
} from "../lib/tracker.js";

const KEY = "relocation-tracker";
const CALCULATOR_KEY = "relocation-cost-inputs";

const rows = Object.fromEntries(TRACKER_KEYS.map(key => [key, document.querySelector(`[data-line="${key}"]`)]));
const plannedInputs = Object.fromEntries(TRACKER_KEYS.map(key => [key, document.querySelector(`[data-planned="${key}"]`)]));
const actualInputs = Object.fromEntries(TRACKER_KEYS.map(key => [key, document.querySelector(`[data-actual="${key}"]`)]));
const status = document.querySelector("#trackerStatus");
const summaryEmpty = document.querySelector("#summaryEmpty");
const summaryBody = document.querySelector("#summaryBody");
const headline = document.querySelector("#summaryHeadline");
const out = {
  actual: document.querySelector("#sumActual"),
  spentPlanned: document.querySelector("#sumSpentPlanned"),
  difference: document.querySelector("#sumDifference"),
  pending: document.querySelector("#sumPending"),
  planned: document.querySelector("#sumPlanned"),
  expected: document.querySelector("#sumExpected"),
};

let state = { planned: {}, actual: {} };

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      state.planned = cleanAmounts(saved.planned);
      state.actual = cleanAmounts(saved.actual);
    }
  } catch {}
};

const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
};

const setStatus = message => { status.textContent = message; };

// Writes saved amounts into the fields. Skips the field being typed in, so typing is never interrupted.
const fillFields = (skip) => {
  TRACKER_KEYS.forEach(key => {
    [[plannedInputs[key], state.planned[key]], [actualInputs[key], state.actual[key]]].forEach(([input, value]) => {
      if (!input || input === skip) return;
      input.value = value ? String(value) : "";
    });
  });
};

const headlineFor = result => {
  if (result.status === "none") return `You have planned ${formatMoney(result.plannedTotal)} and not recorded any spending yet.`;
  if (result.status === "on-plan") return `So far you are on plan: ${formatMoney(result.actualTotal)} spent against ${formatMoney(result.spentLinesPlanned)} planned for those lines.`;
  const words = describeDifference(result.spentDifference).toLowerCase();
  const percent = result.spentPercent === null ? "" : ` (${Math.abs(result.spentPercent)}%)`;
  return `On the lines you have paid so far, you are ${words}${percent}.`;
};

const render = (skip) => {
  fillFields(skip);
  const result = trackBudget(state.planned, state.actual);
  const byKey = Object.fromEntries(result.lines.map(line => [line.key, line]));

  TRACKER_KEYS.forEach(key => {
    const row = rows[key];
    if (!row) return;
    const line = byKey[key];
    row.dataset.empty = String(!line);
    row.querySelector("[data-diff]").textContent = line ? describeLine(line) + (line.percent === null || line.status === "on-plan" ? "" : ` (${line.percent > 0 ? "+" : ""}${line.percent}%)`) : "";
  });

  summaryEmpty.hidden = result.hasData;
  summaryBody.hidden = !result.hasData;
  if (!result.hasData) return;
  headline.textContent = headlineFor(result);
  out.actual.textContent = formatMoney(result.actualTotal);
  out.spentPlanned.textContent = formatMoney(result.spentLinesPlanned);
  out.difference.textContent = result.status === "none" ? "Nothing spent yet" : describeDifference(result.spentDifference);
  out.pending.textContent = formatMoney(result.stillToSpend);
  out.planned.textContent = formatMoney(result.plannedTotal);
  out.expected.textContent = formatMoney(result.expectedFinal);
};

const bind = (inputs, bucket) => {
  TRACKER_KEYS.forEach(key => {
    const input = inputs[key];
    input?.addEventListener("input", () => {
      const amount = cleanAmount(input.value);
      if (amount > 0) state[bucket][key] = amount; else delete state[bucket][key];
      setStatus("");
      save();
      render(input);
    });
    // On leaving the field, show the cleaned value (for example a negative number becomes blank).
    input?.addEventListener("blur", () => render());
  });
};

bind(plannedInputs, "planned");
bind(actualInputs, "actual");

document.querySelector("#importPlanned")?.addEventListener("click", () => {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(CALCULATOR_KEY) || "null"); } catch {}
  const copied = plannedFromCalculator(saved);
  const count = Object.keys(copied).length;
  if (!count) {
    setStatus("No costs found in the calculator. Enter costs there first, or type your planned amounts here.");
    return;
  }
  state.planned = copied;
  save();
  render();
  setStatus(`Copied ${count} planned ${count === 1 ? "cost" : "costs"} from the calculator.`);
});

document.querySelector("#resetTracker")?.addEventListener("click", () => {
  state = { planned: {}, actual: {} };
  try { localStorage.removeItem(KEY); } catch {}
  render();
  setStatus("Cleared.");
});

document.querySelector("#printTracker")?.addEventListener("click", () => window.print());

load();
render();
