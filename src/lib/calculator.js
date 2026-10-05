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
  { distance, size, type, travel = 0, housing = 0, setup = 0, extras = 0 },
  { validate = true } = {},
) {
  if (validate) {
    validateNumber("distance", distance, INPUT_LIMITS.distance);
    validateNumber("travel", travel, INPUT_LIMITS.travel);
    validateNumber("housing", housing, INPUT_LIMITS.housing);
    validateNumber("setup", setup, INPUT_LIMITS.setup);
    validateNumber("extras", extras, INPUT_LIMITS.extras);
    validateNumber("size", size, { min: 0, max: Number.POSITIVE_INFINITY });
    validateNumber("type", type, { min: 0, max: Number.POSITIVE_INFINITY });
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
  const other = travel + housing + setup + extras;
  const contingency = (move + other) * DEFAULT_CONTINGENCY_RATE;
  const total = move + other + contingency;

  return {
    move,
    moveFloored,
    other,
    contingency,
    total,
    rangeLow: total * DEFAULT_RANGE_LOW,
    rangeHigh: total * DEFAULT_RANGE_HIGH,
    marketBenchmark,
  };
}
