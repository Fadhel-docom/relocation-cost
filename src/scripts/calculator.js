import stateData from "../../data/state-distances.json";
import { calculateBudget } from "../lib/calculator.js";

const form = document.querySelector("#calculator");
const ids = ["fromState","toState","distance","size","type","travel","housing","setup","extras"];
const defaults = { fromState: "CA", toState: "TX", distance: "1400", size: "1", type: "0.65", travel: "0", housing: "0", setup: "0", extras: "0" };
const fields = Object.fromEntries(ids.map(id => [id, document.querySelector("#" + id)]));
const result = document.querySelector("#result");
const moveResult = document.querySelector("#moveResult");
const otherResult = document.querySelector("#otherResult");
const contingencyResult = document.querySelector("#contingencyResult");
const range = document.querySelector("#range");
const marketBenchmark = document.querySelector("#marketBenchmark");
const inputError = document.querySelector("#inputError");
const share = document.querySelector("#share");
const reset = document.querySelector("#reset");
const shareStatus = document.querySelector("#shareStatus");
const stateDistanceNote = document.querySelector("#stateHelp");

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
ids.forEach(id => { fields[id].value = defaults[id]; });

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

const applyStateDistance = () => {
  const miles = stateMiles(fields.fromState.value, fields.toState.value);

  if (miles !== null) {
    fields.distance.value = miles;
    stateDistanceNote.textContent =
      `Auto-filled ${miles.toLocaleString("en-US")} miles from state centroids. You can edit the distance manually if you have a route-specific mileage estimate.`;
  } else {
    stateDistanceNote.textContent =
      "Same-state move selected. Enter the route distance manually in miles.";
  }

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

  inputError.textContent = "";
  return true;
};

const num = id => Number(fields[id]?.value) || 0;

const calculate = () => {
  if (!validateInputs()) return null;

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
  marketBenchmark.textContent = money(resultData.marketBenchmark);

  try {
    localStorage.setItem(
      "relocation-cost-inputs",
      JSON.stringify(Object.fromEntries(ids.map(id => [id, fields[id].value])))
    );
  } catch {}

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

const resetCalculator = () => {
  ids.forEach(id => {
    fields[id].value = defaults[id];
    fields[id].removeAttribute("aria-invalid");
  });

  try { localStorage.removeItem("relocation-cost-inputs"); } catch {}
  shareStatus.textContent = "";
  applyStateDistance();
};

loadSaved();
loadQuery();

form?.addEventListener("submit", event => {
  event.preventDefault();
  calculate();
});

fields.fromState?.addEventListener("change", applyStateDistance);
fields.toState?.addEventListener("change", applyStateDistance);

["distance","size","type","travel","housing","setup","extras"].forEach(id =>
  fields[id]?.addEventListener("input", calculate)
);

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

  try {
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = "Share link copied to your clipboard.";
  } catch {
    shareStatus.textContent = url;
  }
});

calculate();
