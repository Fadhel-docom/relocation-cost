// Content and source for the "How many moving boxes do I need?" guide. The box counts below are one
// published rule of thumb, copied as ranges from the single page listed in SOURCES; nothing here is a
// price, a calculation of ours or a promise. Tests (packing-boxes.test.js) check that the ranges are
// ordered, that no money figure appears, and that the source matches data/source-checks.json (scope
// "packing-guide"). The page is read by a person; the weekly check opens a reminder issue before the
// guide warns readers.
import checks from "../../data/source-checks.json" with { type: "json" };
import { oldestDate } from "./source-freshness.js";

export const MAX_AGE_DAYS = checks.maxAgeDays;
const entries = Object.entries(checks.sources).filter(([, source]) => source.scope === "packing-guide");
// Oldest verification date among this guide's sources; null (never a made-up date) when missing or invalid,
// which the page treats as stale.
export const CHECKED_ON = oldestDate(entries.map(([, source]) => source.lastVerified));

export const TITLE = "How Many Moving Boxes Do I Need? By Home Size";
export const DESCRIPTION = "A published rule of thumb for how many moving boxes a studio to a 5-bedroom home needs, which box size suits which items, and why to plan some extra.";

const BASE_SOURCES = [
  {
    id: "redfin-boxes",
    label: "Redfin: How Many Boxes Do I Need to Move? (Freda Nkrumah, published July 28, 2026)",
    url: "https://www.redfin.com/blog/how-many-boxes-do-i-need-to-move/",
  },
];

export const SOURCES = Object.freeze(BASE_SOURCES.map(source => {
  const config = checks.sources[source.id] ?? {};
  return Object.freeze({
    ...source,
    verified: config.lastVerified ?? null,
    ...(config.pageUpdated ? { pageUpdated: config.pageUpdated } : {}),
  });
}));

// Ranges exactly as the source's table states them. "min" and "max" are boxes; max is null for "120+".
export const RANGES = Object.freeze([
  { size: "Studio", min: 10, max: 20 },
  { size: "1-bedroom", min: 20, max: 40 },
  { size: "2-bedroom", min: 40, max: 60 },
  { size: "3-bedroom", min: 60, max: 80 },
  { size: "4-bedroom", min: 80, max: 120 },
  { size: "5+ bedrooms", min: 120, max: null },
]);

export function rangeLabel(range) {
  return range.max === null ? `${range.min}+` : `${range.min}–${range.max}`;
}

// Box sizes and what the source suggests putting in each.
export const BOX_TYPES = Object.freeze([
  { name: "Small", items: "books, dishes, canned goods, tools and other heavy items" },
  { name: "Medium", items: "kitchen supplies, toys, decor, towels and linens" },
  { name: "Large", items: "pillows, comforters, lampshades and other light but bulky items" },
  { name: "Specialty", items: "TVs, mirrors, artwork, hanging clothes and fragile dishware" },
]);

export const RULES = Object.freeze([
  {
    text: "The article says its table suits an average household and that every move is different. It states there is no exact formula: the number depends on how many people live there, how long you have lived there and how much you have collected.",
    sources: ["redfin-boxes"],
  },
  {
    text: "Pack heavy or breakable things in smaller boxes. One expert quoted in the article says they are easier to lift and less likely to break.",
    sources: ["redfin-boxes"],
  },
  {
    text: "The article warns that overfilling large boxes is a very common mistake, and that fragile items need room for packing paper or bubble wrap.",
    sources: ["redfin-boxes"],
  },
  {
    text: "Specialty boxes such as TV boxes and dish-pack kits are described as often worth the extra cost for expensive electronics, artwork or fine china.",
    sources: ["redfin-boxes"],
  },
  {
    text: "Plan for some spare boxes. One expert quoted suggests grabbing 10 to 15 extra, and another source in the article suggests buying about 10 percent more than your estimate.",
    sources: ["redfin-boxes"],
  },
  {
    text: "Keep leftover boxes: the article notes they can serve as dividers between dishes or as cushioning.",
    sources: ["redfin-boxes"],
  },
]);

// What the page says that does not fit the table neatly. Shown so the table is not read as exact.
export const DISAGREEMENTS = Object.freeze([
  "The same article quotes one expert at 30 to 50 boxes for a 2-bedroom home, which is lower than the table's 40 to 60.",
  "It also quotes another expert saying larger homes often need 75 or more, so the ranges are a starting point, not a limit.",
]);

// What this source does not say. Listed so nobody assumes the guide fills the gap.
export const NOT_STATED = Object.freeze([
  "The article does not give the box sizes in inches or cubic feet, so a \"small\" box here is not a measured size.",
  "It does not say how many boxes of each type a home needs, only the total.",
  "It does not give prices, and this guide does not either. The moving cost estimate does not include a packing-supplies line from this table.",
  "It is one publisher's rule of thumb. We found no official or regulator figure for box counts.",
]);

// Practical suggestions, not rules from the source.
export const TIPS = Object.freeze([
  "Count rooms and closets first, then compare your total to the range for your home size.",
  "Buy or collect the small boxes first: books and kitchen items usually fill them fastest.",
  "Pack one room as a trial. If it used more or fewer boxes than you guessed, adjust the total before you buy the rest.",
  "Ask a mover whether packing materials are included in the quote or billed separately, and get the answer in writing.",
]);

export function sourceNumber(id) {
  const index = SOURCES.findIndex(source => source.id === id);
  return index === -1 ? 0 : index + 1;
}
