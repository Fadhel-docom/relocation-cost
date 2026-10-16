import { track } from "@vercel/analytics";
import stateData from "../../data/state-distances.json";
import { calculateBudget, costBreakdown, HOME_SIZES, MOVE_TYPES, pickAllowed, RESERVE_WEEKS, savingsTips } from "../lib/calculator.js";
import { createFunnel } from "../lib/calculator-analytics.js";

const form = document.querySelector("#calculator");
const ids = ["fromState","toState","distance","size","type","travel","housing","setup","extras","fuel","insurance","packing","equipment","utilities","reserveWeeks","weeklyLiving"];
const defaults = { fromState: "CA", toState: "TX", distance: "", size: "1", type: "0.65", travel: "0", housing: "0", setup: "0", extras: "0", fuel: "0", insurance: "0", packing: "0", equipment: "0", utilities: "0", reserveWeeks: "0", weeklyLiving: "0" };
const fields = Object.fromEntries(ids.map(id => [id, document.querySelector("#" + id)]));
const result = document.querySelector("#result");
const moveResult = document.querySelector("#moveResult");
const otherResult = document.querySelector("#otherResult");
const contingencyResult = document.querySelector("#contingencyResult");
const range = document.querySelector("#range");
const mobileTotal = document.querySelector("#mobileTotal");
const mobileRange = document.querySelector("#mobileRange");
const breakdownBar = document.querySelector("#breakdownBar");
const breakdownList = document.querySelector("#breakdownList");
const tipsList = document.querySelector("#tipsList");
const cashBox = document.querySelector("#cashBox");
const reserveResult = document.querySelector("#reserveResult");
const cashNeededResult = document.querySelector("#cashNeededResult");
const marketBenchmark = document.querySelector("#marketBenchmark");
const floorNote = document.querySelector("#floorNote");
const inputError = document.querySelector("#inputError");
const share = document.querySelector("#share");
const reset = document.querySelector("#reset");
const shareStatus = document.querySelector("#shareStatus");
const stateDistanceNote = document.querySelector("#stateHelp");
const nextSteps = document.querySelector("#nextSteps");
const routeGuideItem = document.querySelector("#routeGuideItem");
const routeGuideLink = document.querySelector("#routeGuideLink");
const compareCards = [...document.querySelectorAll("[data-compare-type]")];
const sizeCompareCards = [...document.querySelectorAll("[data-compare-size]")];

const money = n => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(n);

const limits = {
  distance: { min: 1, max: 30000 },
  travel: { min: 0, max: 1000000 },
  housing: { min: 0, max: 1000000 },
  setup: { min: 0, max: 1000000 },
  extras: { min: 0, max: 1000000 },
  fuel: { min: 0, max: 1000000 },
  insurance: { min: 0, max: 1000000 },
  packing: { min: 0, max: 1000000 },
  equipment: { min: 0, max: 1000000 },
  utilities: { min: 0, max: 1000000 },
  weeklyLiving: { min: 0, max: 100000 }
};

const stateCodes = Object.keys(stateData.states).sort((a, b) =>
  stateData.states[a].name.localeCompare(stateData.states[b].name)
);

stateCodes.forEach(code => {
  fields.fromState.append(new Option(`${stateData.states[code].name} (${code})`, code));
  fields.toState.append(new Option(`${stateData.states[code].name} (${code})`, code));
});

fields.fromState.value = defaults.fromState;
fields.toState.value = defaults.toState;
ids.forEach(id => { if (id !== "distance") fields[id].value = defaults[id]; });

const toRadians = degrees => degrees * Math.PI / 180;

const stateMiles = (fromCode, toCode) => {
  const from = stateData.states[fromCode];
  const to = stateData.states[toCode];
  if (!from || !to || fromCode === toCode) return null;

  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return Math.round(3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const fillStateDistance = () => {
  const miles = stateMiles(fields.fromState.value, fields.toState.value);

  if (miles !== null) {
    fields.distance.value = miles;
    stateDistanceNote.textContent =
      `Auto-filled ${miles.toLocaleString("en-US")} miles: an approximate straight line between the centers of the two states, not road mileage. If you know your actual driving miles, type them in to replace it.`;
  } else {
    stateDistanceNote.textContent =
      "Same-state move selected. Enter your driving distance in miles.";
  }
};

const applyStateDistance = () => {
  fillStateDistance();
  calculate();
};

const validateInputs = () => {
  for (const id of Object.keys(limits)) {
    const value = Number(fields[id]?.value);
    const { min, max } = limits[id];

    if (!Number.isFinite(value) || value < min || value > max) {
      inputError.textContent = id === "distance"
        ? "Enter a distance from 1 to 30,000 miles."
        : id === "weeklyLiving"
          ? "Enter weekly living costs from $0 to $100,000."
          : "Enter an amount from $0 to $1,000,000 for each additional cost.";
      fields[id]?.setAttribute("aria-invalid", "true");
      return false;
    }

    fields[id]?.removeAttribute("aria-invalid");
  }

  if (!HOME_SIZES.includes(Number(fields.size.value)) || !MOVE_TYPES.includes(Number(fields.type.value))) {
    inputError.textContent = "Choose a home size and a move type from the lists.";
    return false;
  }

  if (!RESERVE_WEEKS.includes(Number(fields.reserveWeeks.value))) {
    inputError.textContent = "Choose the weeks of living costs to cover from the list.";
    return false;
  }

  inputError.textContent = "";
  return true;
};

const routeSlugs = (() => {
  try { return new Set(JSON.parse(nextSteps?.dataset.routeSlugs || "[]")); } catch { return new Set(); }
})();

// Show a link to the matching route guide only when that guide page exists.
const updateRouteGuide = () => {
  if (!routeGuideItem || !routeGuideLink) return;
  const slug = `${fields.fromState.value}-to-${fields.toState.value}`.toLowerCase();
  if (routeSlugs.has(slug)) {
    const from = stateData.states[fields.fromState.value]?.name;
    const to = stateData.states[fields.toState.value]?.name;
    routeGuideLink.href = `/moving-cost/${slug}/`;
    routeGuideLink.textContent = `${from} to ${to} route guide`;
    routeGuideItem.hidden = false;
  } else {
    routeGuideItem.hidden = true;
  }
};

const num = id => Number(fields[id]?.value) || 0;

// All calculator inputs, optionally with some replaced (used by the comparison cards).
const inputs = (overrides = {}) => ({
  distance: num("distance"),
  size: num("size"),
  type: num("type"),
  travel: num("travel"),
  housing: num("housing"),
  setup: num("setup"),
  extras: num("extras"),
  fuel: num("fuel"),
  insurance: num("insurance"),
  packing: num("packing"),
  equipment: num("equipment"),
  utilities: num("utilities"),
  reserveWeeks: num("reserveWeeks"),
  weeklyLiving: num("weeklyLiving"),
  ...overrides
});

// Decorative segment colors. The legend text carries the information, so the
// bar never depends on color alone.
const BREAKDOWN_COLORS = {
  move: "#0369a1",
  travel: "#0f766e",
  housing: "#7c3aed",
  setup: "#b45309",
  extras: "#be185d",
  contingency: "#64748b"
};

const renderBreakdown = (inputData, resultData) => {
  if (!breakdownBar || !breakdownList || !tipsList) return;
  const parts = costBreakdown(inputData, resultData);

  breakdownBar.replaceChildren();
  breakdownList.replaceChildren();
  tipsList.replaceChildren();

  parts.forEach(part => {
    const segment = document.createElement("div");
    segment.style.width = part.percent + "%";
    segment.style.backgroundColor = BREAKDOWN_COLORS[part.key];
    breakdownBar.append(segment);

    const item = document.createElement("li");
    item.className = "flex items-center justify-between gap-3";
    const label = document.createElement("span");
    label.className = "flex items-center gap-2 text-slate-700";
    const swatch = document.createElement("span");
    swatch.className = "inline-block h-3 w-3 shrink-0 rounded-sm";
    swatch.style.backgroundColor = BREAKDOWN_COLORS[part.key];
    swatch.setAttribute("aria-hidden", "true");
    label.append(swatch, part.label);
    const value = document.createElement("strong");
    value.className = "whitespace-nowrap text-slate-900";
    value.textContent = `${money(part.amount)} · ${part.percent}%`;
    item.append(label, value);
    breakdownList.append(item);
  });

  breakdownBar.setAttribute(
    "aria-label",
    "Cost breakdown: " + parts.map(part => `${part.label} ${part.percent}%`).join(", ")
  );

  savingsTips(inputData, resultData).forEach(text => {
    const tip = document.createElement("li");
    tip.textContent = text;
    tipsList.append(tip);
  });
};

// When an input is invalid, show dashes instead of leaving the last valid
// estimate on screen next to the error message.
const clearResults = () => {
  const dash = "—";
  [result, moveResult, otherResult, contingencyResult, range, mobileTotal, mobileRange, marketBenchmark, reserveResult, cashNeededResult]
    .forEach(el => { if (el) el.textContent = dash; });
  if (floorNote) floorNote.hidden = true;
  if (cashBox) cashBox.hidden = true;
  if (breakdownBar) {
    breakdownBar.replaceChildren();
    breakdownBar.setAttribute("aria-label", "Cost breakdown is not available until the inputs are fixed");
  }
  if (breakdownList) {
    breakdownList.replaceChildren();
    const message = document.createElement("li");
    message.className = "text-slate-500";
    message.textContent = "Fix the input above to see the breakdown.";
    breakdownList.append(message);
  }
  if (tipsList) tipsList.replaceChildren();
  [...compareCards, ...sizeCompareCards].forEach(card => {
    card.querySelector("[data-compare-total]").textContent = dash;
    card.querySelector("[data-compare-range]").textContent = "Fix the input above to compare";
    card.dataset.selected = "false";
  });
};

const calculate = () => {
  updateRouteGuide();
  if (!validateInputs()) {
    clearResults();
    return null;
  }

  const currentInputs = inputs();
  const resultData = calculateBudget(currentInputs);

  result.textContent = money(resultData.total);
  moveResult.textContent = money(resultData.move);
  otherResult.textContent = money(resultData.other);
  contingencyResult.textContent = money(resultData.contingency);
  range.textContent = money(resultData.rangeLow) + "–" + money(resultData.rangeHigh);
  if (mobileTotal) mobileTotal.textContent = money(resultData.total);
  if (mobileRange) mobileRange.textContent = money(resultData.rangeLow) + "–" + money(resultData.rangeHigh);
  marketBenchmark.textContent = money(resultData.marketBenchmark);
  if (floorNote) floorNote.hidden = !resultData.moveFloored;
  if (cashBox) {
    cashBox.hidden = resultData.reserve <= 0;
    reserveResult.textContent = money(resultData.reserve);
    cashNeededResult.textContent = money(resultData.cashNeeded);
  }

  renderBreakdown(currentInputs, resultData);

  compareCards.forEach(card => {
    const typeValue = Number(card.dataset.compareType);
    const alt = calculateBudget(inputs({ type: typeValue }));
    card.querySelector("[data-compare-total]").textContent = money(alt.total);
    card.querySelector("[data-compare-range]").textContent =
      "Range " + money(alt.rangeLow) + "–" + money(alt.rangeHigh);
    card.dataset.selected = String(typeValue === num("type"));
  });

  sizeCompareCards.forEach(card => {
    const sizeValue = Number(card.dataset.compareSize);
    const alt = calculateBudget(inputs({ size: sizeValue }));
    card.querySelector("[data-compare-total]").textContent = money(alt.total);
    card.querySelector("[data-compare-range]").textContent =
      "Range " + money(alt.rangeLow) + "–" + money(alt.rangeHigh);
    card.dataset.selected = String(sizeValue === num("size"));
  });

  try {
    localStorage.setItem(
      "relocation-cost-inputs",
      JSON.stringify(Object.fromEntries(ids.map(id => [id, fields[id].value])))
    );
  } catch {}

  funnel.estimate(true);

  return resultData.total;
};

const loadQuery = () => {
  const params = new URLSearchParams(location.search);
  ids.forEach(id => {
    if (params.has(id)) fields[id].value = params.get(id);
  });
};

const loadSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("relocation-cost-inputs") || "null");
    if (saved) ids.forEach(id => {
      if (saved[id] !== undefined) fields[id].value = saved[id];
    });
  } catch {}
};

// Share links and saved inputs can be edited by hand. Any value that is not one
// of the offered options falls back to the default instead of leaving a select
// blank (which would silently read as 0 and give a wrong estimate).
const sanitizeSelects = () => {
  if (!stateCodes.includes(fields.fromState.value)) fields.fromState.value = defaults.fromState;
  if (!stateCodes.includes(fields.toState.value)) fields.toState.value = defaults.toState;
  fields.size.value = String(pickAllowed(fields.size.value, HOME_SIZES, Number(defaults.size)));
  fields.type.value = String(pickAllowed(fields.type.value, MOVE_TYPES, Number(defaults.type)));
  fields.reserveWeeks.value = String(pickAllowed(fields.reserveWeeks.value, RESERVE_WEEKS, Number(defaults.reserveWeeks)));
};

const resetCalculator = () => {
  ids.forEach(id => {
    fields[id].value = defaults[id];
    fields[id].removeAttribute("aria-invalid");
  });

  try { localStorage.removeItem("relocation-cost-inputs"); } catch {}
  shareStatus.textContent = "";
  // Reset the funnel before rendering defaults, so the default estimate is not
  // misattributed to the previous user attempt.
  funnel.reset();
  applyStateDistance();
};

// Start state: saved or shared values win; otherwise the distance is computed
// from the selected states so the field and the helper text always agree.
loadSaved();
loadQuery();
sanitizeSelects();
if (fields.distance.value === "") {
  fillStateDistance();
} else if (stateMiles(fields.fromState.value, fields.toState.value) === Number(fields.distance.value)) {
  fillStateDistance();
} else {
  stateDistanceNote.textContent =
    "Distance restored from your saved or shared inputs. Change a state to refill it with the approximate straight-line distance between state centers (not road mileage).";
}

const funnel = createFunnel(track, () => ({ from: fields.fromState.value, to: fields.toState.value }));

form?.addEventListener("submit", event => {
  event.preventDefault();
  calculate();
});

// Capture phase so the interaction is recorded before the field handlers run
// calculate(), which lets the first valid estimate count as a funnel step.
form?.addEventListener("input", () => funnel.interaction(), true);
form?.addEventListener("change", () => funnel.interaction(), true);

fields.fromState?.addEventListener("change", applyStateDistance);
fields.toState?.addEventListener("change", applyStateDistance);

["distance","size","type","travel","housing","setup","extras","fuel","insurance","packing","equipment","utilities","reserveWeeks","weeklyLiving"].forEach(id =>
  fields[id]?.addEventListener("input", calculate)
);

routeGuideLink?.addEventListener("click", () => track("route_guide_clicked"));

reset?.addEventListener("click", resetCalculator);

share?.addEventListener("click", async () => {
  const total = calculate();

  if (total === null) {
    shareStatus.textContent = "Fix the input above before sharing.";
    return;
  }

  const params = new URLSearchParams();
  ids.forEach(id => params.set(id, fields[id].value));

  const url = location.origin + location.pathname + "?" + params.toString();

  track("share_clicked");

  try {
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = "Share link copied to your clipboard.";
    funnel.share("clipboard");
  } catch {
    shareStatus.textContent = url;
    funnel.share("fallback");
  }
});

calculate();
