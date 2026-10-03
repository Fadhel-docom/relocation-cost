export const DEFAULT_CONTINGENCY_RATE = 0.10;
export const DEFAULT_RANGE_LOW = 0.80;
export const DEFAULT_RANGE_HIGH = 1.20;
export const MOVE_BASE_COST = 350;
export const MOVE_PER_MILE = 0.56;

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

export function calculateBudget(
  { distance, size, type, travel = 0, housing = 0, setup = 0, extras = 0 },
  { validate = true } = {},
) {
  if (validate) {
    for (const [name, limits] of Object.entries(INPUT_LIMITS)) {
      validateNumber(name, arguments[0][name], limits);
    }
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
  };
}
