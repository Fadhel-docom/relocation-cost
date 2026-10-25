import { DEFAULT_CONTINGENCY_RATE, DEFAULT_RANGE_LOW, DEFAULT_RANGE_HIGH } from "./calculator.js";

// Turns an ISO date (YYYY-MM-DD) into "October 3, 2026". Returns "" for anything else.
export function formatReviewDate(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

// The margin of error shown to people, derived from the same constants the calculator uses.
export function marginSummary() {
  const below = Math.round((1 - DEFAULT_RANGE_LOW) * 100);
  const above = Math.round((DEFAULT_RANGE_HIGH - 1) * 100);
  return {
    below,
    above,
    contingency: Math.round(DEFAULT_CONTINGENCY_RATE * 100),
    label: below === above ? `±${below}%` : `−${below}% / +${above}%`,
  };
}

// Sources that actually feed a result, plus the ones shown for context only.
export function trustSources(sources) {
  return [
    { key: "uhaul", role: "Sets the minimum DIY move cost", ...sources.uhaul },
    { key: "bls", role: "Context only, does not change any result", ...sources.bls },
    { key: "census", role: "Context only, does not change any result", ...sources.census },
  ];
}

// Plain-language note: the model has no move-date input and applies no seasonal adjustment.
// It states no percentage on purpose, because no published figure feeds the model.
export const SEASON_NOTE = "This estimate does not use your move date. Moving companies may charge more during the busy spring and summer months, near month-end, and on weekends. A quote for your date can therefore come out higher or lower than this planning number.";

// Shown next to the U-Haul benchmark when it sets the move cost. It states the practical effect on home size
// and nothing numeric, so it stays true for every distance and every move type.
export const FLOOR_NOTE = "The move cost starts from this average because the basic model came out lower. Home size does not change this base amount. For rental-truck-with-labor and full-service moves, home size only changes the premium added on top.";
