import benchmarkData from "../../data/coefficients.json" with { type: "json" };

const coefficients = {
  uhaulOneWayByDistance: benchmarkData.benchmarks.uhaul_one_way_average_by_distance.map(({ max_miles, average_usd }) => ({
    maxMiles: max_miles ?? Number.POSITIVE_INFINITY,
    averageUsd: average_usd,
  })),
  blsLaborHourlyUsd: benchmarkData.benchmarks.bls_laborers_freight_stock_material_movers_hand_mean_hourly_usd,
};

export const DEFAULT_CONTINGENCY_RATE = 0.10;
export const DEFAULT_RANGE_LOW = 0.80;
export const DEFAULT_RANGE_HIGH = 1.20;
export const MOVE_BASE_COST = 350;
export const MOVE_PER_MILE = 0.56;
export const DIY_TYPE_MULTIPLIER = 0.65;
export const HOME_SIZES = Object.freeze([1, 1.35, 1.8, 2.4]);
export const MOVE_TYPES = Object.freeze([DIY_TYPE_MULTIPLIER, 1, 1.65]);
// Weeks of living costs to hold in cash until the first income at the new place.
export const RESERVE_WEEKS = Object.freeze([0, 2, 4, 6, 8, 12]);
// Optional itemized costs. Each one is added to "other costs" exactly as typed;
// they default to 0 and are left out of the total until the user knows an amount.
export const ITEMIZED_KEYS = Object.freeze(["fuel", "insurance", "packing", "equipment", "utilities"]);

// Returns the numeric value when it is one of the allowed options, otherwise
// the fallback. Used to clean values restored from share links or storage.
export function pickAllowed(value, allowed, fallback) {
  const number = Number(value);
  return value !== "" && value !== null && value !== undefined && allowed.includes(number) ? number : fallback;
}

export const SOURCE_BENCHMARKS = Object.freeze({
  uhaulOneWayByDistance: coefficients.uhaulOneWayByDistance,
  blsLaborHourlyUsd: coefficients.blsLaborHourlyUsd,
});

const INPUT_LIMITS = {
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
  weeklyLiving: { min: 0, max: 100000 },
};

function validateNumber(name, value, { min, max }) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be a finite number between ${min} and ${max}.`);
  }
}

export function getUhaulBenchmark(distance) {
  validateNumber("distance", distance, INPUT_LIMITS.distance);
  return coefficients.uhaulOneWayByDistance.find(({ maxMiles }) => distance <= maxMiles).averageUsd;
}

export function calculateBudget(
  {
    distance, size, type, travel = 0, housing = 0, setup = 0, extras = 0,
    fuel = 0, insurance = 0, packing = 0, equipment = 0, utilities = 0,
    reserveWeeks = 0, weeklyLiving = 0,
  },
  { validate = true } = {},
) {
  if (validate) {
    validateNumber("distance", distance, INPUT_LIMITS.distance);
    validateNumber("travel", travel, INPUT_LIMITS.travel);
    validateNumber("housing", housing, INPUT_LIMITS.housing);
    validateNumber("setup", setup, INPUT_LIMITS.setup);
    validateNumber("extras", extras, INPUT_LIMITS.extras);
    validateNumber("fuel", fuel, INPUT_LIMITS.fuel);
    validateNumber("insurance", insurance, INPUT_LIMITS.insurance);
    validateNumber("packing", packing, INPUT_LIMITS.packing);
    validateNumber("equipment", equipment, INPUT_LIMITS.equipment);
    validateNumber("utilities", utilities, INPUT_LIMITS.utilities);
    validateNumber("weeklyLiving", weeklyLiving, INPUT_LIMITS.weeklyLiving);
    if (!RESERVE_WEEKS.includes(reserveWeeks)) {
      throw new RangeError(`reserveWeeks must be one of ${RESERVE_WEEKS.join(", ")}.`);
    }
    if (!HOME_SIZES.includes(size)) {
      throw new RangeError(`size must be one of ${HOME_SIZES.join(", ")}.`);
    }
    if (!MOVE_TYPES.includes(type)) {
      throw new RangeError(`type must be one of ${MOVE_TYPES.join(", ")}.`);
    }
  }

  const marketBenchmark = getUhaulBenchmark(distance);
  const perMileCost = distance * MOVE_PER_MILE * size;
  const diyModel = MOVE_BASE_COST + perMileCost * DIY_TYPE_MULTIPLIER;
  // The DIY base can never fall below the published average one-way truck rental
  // for its distance band (the benchmark is a lower bound, not a per-mile
  // coefficient). Labor and service move types add their MVP premium on top of
  // that base, so every move type stays above the benchmark and ordered.
  const diyBase = Math.max(diyModel, marketBenchmark);
  const moveFloored = marketBenchmark > diyModel;
  const servicePremium = Math.max(0, perMileCost * (type - DIY_TYPE_MULTIPLIER));
  const move = diyBase + servicePremium;
  const other = travel + housing + setup + extras + fuel + insurance + packing + equipment + utilities;
  const contingency = (move + other) * DEFAULT_CONTINGENCY_RATE;
  const total = move + other + contingency;
  // The cash buffer is money the user plans to hold until the first income, not
  // an estimated expense: it is outside the contingency and the indicative range.
  const reserve = reserveWeeks * weeklyLiving;

  return {
    move,
    moveFloored,
    other,
    contingency,
    reserve,
    cashNeeded: total + reserve,
    total,
    rangeLow: total * DEFAULT_RANGE_LOW,
    rangeHigh: total * DEFAULT_RANGE_HIGH,
    marketBenchmark,
  };
}

// Where the budget goes: each part of the total with its share. Percentages are
// whole numbers that always add up to 100 (largest-remainder rounding). The cash
// buffer is not part of the total, so it is not part of the breakdown either.
export function costBreakdown(input, result) {
  const get = key => input[key] ?? 0;
  const parts = [
    { key: "move", label: "Move", amount: result.move },
    { key: "travel", label: "Travel", amount: get("travel") },
    { key: "housing", label: "Temporary housing", amount: get("housing") },
    { key: "setup", label: "Deposits / setup", amount: get("setup") },
    {
      key: "extras",
      label: "Packing, extras and itemized costs",
      amount: get("extras") + get("fuel") + get("insurance") + get("packing") + get("equipment") + get("utilities"),
    },
    { key: "contingency", label: "Contingency (10%)", amount: result.contingency },
  ].filter(part => part.amount > 0);

  const total = parts.reduce((sum, part) => sum + part.amount, 0);
  if (total <= 0) return [];

  const raw = parts.map(part => (part.amount / total) * 100);
  const floors = raw.map(Math.floor);
  let remaining = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = raw.map((value, index) => ({ index, fraction: value - floors[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (const { index } of order) {
    if (remaining <= 0) break;
    floors[index] += 1;
    remaining -= 1;
  }
  return parts.map((part, index) => ({ ...part, percent: floors[index] }));
}

// Plain, non-numeric money-saving tips chosen from what the user entered. They
// make no price claims; the last tip always reminds to replace assumptions with quotes.
export function savingsTips(input, result) {
  const get = key => input[key] ?? 0;
  const breakdown = costBreakdown(input, result);
  const largest = breakdown.reduce((best, part) => (part.amount > best.amount ? part : best), { amount: -1 });
  const tips = [];

  if (largest.key === "move") {
    tips.push("Moving is your largest cost. Compare the three move types below and get at least two quotes before you book.");
  }
  if (input.type !== 1.65 && get("fuel") === 0) {
    tips.push("Add fuel if you drive a rental truck. It is only counted when you enter it under “Itemize your costs”.");
  }
  if (get("packing") === 0 && get("extras") === 0) {
    tips.push("Ask local stores and friends for used boxes before buying packing materials, then enter what you actually spend.");
  }
  if (get("insurance") === 0) {
    tips.push("Check what coverage your mover or rental company already includes before you buy extra moving insurance.");
  }
  if (get("housing") > 0) {
    tips.push("Compare weekly and monthly rates for temporary housing before you book.");
  }
  if (!input.reserveWeeks) {
    tips.push("Consider a cash buffer for living costs until your first income. The buffer fields above add it to “Cash to have ready”.");
  }

  const finalTip = "Replace these planning assumptions with route-specific provider quotes as soon as you have them.";
  return [...tips.slice(0, 3), finalTip];
}
