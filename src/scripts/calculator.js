import { track } from "@vercel/analytics";
import stateData from "../../data/state-distances.json";
import { calculateBudget, HOME_SIZES, MOVE_TYPES, pickAllowed } from "../lib/calculator.js";
import { createFunnel } from "../lib/calculator-analytics.js";

const form = document.querySelector("#calculator");
const ids = ["fromState","toState","distance","size","type","travel","housing","setup","extras"];
const defaults = { fromState: "CA", toState: "TX", distance: "", size: "1", type: "0.65", travel: "0", housing: "0", setup: "0", extras: "0" };
const fields = Object.fromEntries(ids.map(id => [id, document.querySelector("#" + id)]));
const result = document.querySelector("#result");
const moveResult = document.querySelector("#moveResult");
const otherResult = document.querySelector("#otherResult");
const contingencyResult = document.querySelector("#contingencyResult");
const range = document.querySelector("#range");
const mobileTotal = document.querySelector("#mobileTotal");
const mobileRange = document.querySelector("#mobileRange");
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
  extras: { min: 0, max: 1000000 }
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

// When an input is invalid, show dashes instead of leaving the last valid
// estimate on screen next to the error message.
const clearResults = () => {
  const dash = "—";
  [result, moveResult, otherResult, contingencyResult, range, mobileTotal, mobileRange, marketBenchmark]
    .forEach(el => { if (el) el.textContent = dash; });
  if (floorNote) floorNote.hidden = true;
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

  const resultData = calculateBudget({
    distance: num("distance"),
    size: num("size"),
    type: num("type"),
    travel: num("travel"),
    housing: num("housing"),
    setup: num("setup"),
    extras: num("extras")
  });

  result.textContent = money(resultData.total);
  moveResult.textContent = money(resultData.move);
  otherResult.textContent = money(resultData.other);
  contingencyResult.textContent = money(resultData.contingency);
  range.textContent = money(resultData.rangeLow) + "–" + money(resultData.rangeHigh);
  if (mobileTotal) mobileTotal.textContent = money(resultData.total);
  if (mobileRange) mobileRange.textContent = money(resultData.rangeLow) + "–" + money(resultData.rangeHigh);
  marketBenchmark.textContent = money(resultData.marketBenchmark);
  if (floorNote) floorNote.hidden = !resultData.moveFloored;

  compareCards.forEach(card => {
    const typeValue = Number(card.dataset.compareType);
    const alt = calculateBudget({
      distance: num("distance"),
      size: num("size"),
      type: typeValue,
      travel: num("travel"),
      housing: num("housing"),
      setup: num("setup"),
      extras: num("extras")
    });
    card.querySelector("[data-compare-total]").textContent = money(alt.total);
    card.querySelector("[data-compare-range]").textContent =
      "Range " + money(alt.rangeLow) + "–" + money(alt.rangeHigh);
    card.dataset.selected = String(typeValue === num("type"));
  });

  sizeCompareCards.forEach(card => {
    const sizeValue = Number(card.dataset.compareSize);
    const alt = calculateBudget({
      distance: num("distance"),
      size: sizeValue,
      type: num("type"),
      travel: num("travel"),
      housing: num("housing"),
      setup: num("setup"),
      extras: num("extras")
    });
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
};

const resetCalculator = () => {
  ids.forEach(id => {
    fields[id].value = defaults[id];
    fields[id].removeAttribute("aria-invalid");
  });

  try { localStorage.removeItem("relocation-cost-inputs"); } catch {}
  shareStatus.textContent = "";
  applyStateDistance();
  funnel.reset();
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

["distance","size","type","travel","housing","setup","extras"].forEach(id =>
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
