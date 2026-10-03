export const DEFAULT_CONTINGENCY_RATE = 0.10;
export const DEFAULT_RANGE_LOW = 0.80;
export const DEFAULT_RANGE_HIGH = 1.20;
export const MOVE_BASE_COST = 350;
export const MOVE_PER_MILE = 0.56;

export function calculateBudget({ distance, size, type, travel = 0, housing = 0, setup = 0, extras = 0 }) {
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
