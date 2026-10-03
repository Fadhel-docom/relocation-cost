const coefficients = {
  uhaulOneWayByDistance: [
    { maxMiles: 200, averageUsd: 202 },
    { maxMiles: 500, averageUsd: 444 },
    { maxMiles: 1000, averageUsd: 995 },
    { maxMiles: 1500, averageUsd: 1657 },
    { maxMiles: 2000, averageUsd: 2190 },
    { maxMiles: 2500, averageUsd: 2694 },
    { maxMiles: Number.POSITIVE_INFINITY, averageUsd: 3517 },
  ],
  blsLaborHourlyUsd: 20.32,
};

export const DEFAULT_CONTINGENCY_RATE = 0.10;
export const DEFAULT_RANGE_LOW = 0.80;
export const DEFAULT_RANGE_HIGH = 1.20;
export const MOVE_BASE_COST = 350;
export const MOVE_PER_MILE = 0.56;
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

  const move = Math.max(MOVE_BASE_COST, MOVE_BASE_COST + distance * MOVE_PER_MILE * size * type);
  const other = travel + housing + setup + extras;
  const contingency = (move + other) * DEFAULT_CONTINGENCY_RATE;
  const total = move + other + contingency;

  return {
    move,
    other,
    contingency,
    total,
    rangeLow: total * DEFAULT_RANGE_LOW,
    rangeHigh: total * DEFAULT_RANGE_HIGH,
    marketBenchmark: getUhaulBenchmark(distance),
  };
}
