// "What is included" per move type. No prices and no provider-specific claims: the first table
// says who usually does what, and every cell that depends on the provider says to ask. The list
// of costs outside the move cost comes from the calculator itself, so it cannot drift from it.
import { DIY_TYPE_MULTIPLIER, ITEMIZED_KEYS, MOVE_TYPES, costLines } from "./calculator.js";

export const MOVE_OPTIONS = Object.freeze([
  { label: "DIY", type: DIY_TYPE_MULTIPLIER },
  { label: "Rental truck + labor", type: 1 },
  { label: "Full-service movers", type: 1.65 },
]);

// Cells follow MOVE_OPTIONS order: DIY, rental truck + labor, full-service movers.
export const WHO_DOES_WHAT = Object.freeze([
  { task: "The truck", cells: ["You rent it.", "You rent it.", "The company brings it."] },
  { task: "Driving", cells: ["You drive.", "You drive.", "The company's driver."] },
  { task: "Loading and unloading", cells: ["You and any friends or family.", "Hired helpers do the heavy lifting.", "The company's crew."] },
  { task: "Packing", cells: ["You.", "You.", "Often an optional extra. Ask whether it is in the quote."] },
  { task: "Boxes, tape, dollies and straps", cells: ["You buy or rent them.", "You buy or rent them.", "Ask what the company supplies."] },
  { task: "Coverage for your belongings", cells: ["Your choice. Ask what the truck rental company offers and what it leaves out.", "Your choice. Ask the rental company and the labor provider what they cover.", "Ask exactly what is included and its limits."] },
]);

// Labels of the costs the calculator keeps outside the move cost, in calculator order. They are
// added only when the user enters them, for every move type.
export function notInMoveCost() {
  const every = Object.fromEntries(["travel", "housing", "setup", "extras", ...ITEMIZED_KEYS].map(key => [key, 1]));
  return costLines(every).map(line => line.label);
}

export const MOVE_TYPE_COUNT = MOVE_TYPES.length;
