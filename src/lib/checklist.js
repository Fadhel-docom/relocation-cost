// Moving checklist content and helpers. No prices and no legal claims: every item is a
// plain reminder. Where a rule depends on the state or the provider, the item says to check it.
export const PHASES = Object.freeze([
  {
    id: "w8",
    title: "8 weeks or more before",
    weeksBefore: 8,
    items: [
      { id: "w8-budget", text: "Build your budget with the calculator and keep the print-out or share link." },
      { id: "w8-employer", text: "Ask your employer whether any relocation help is offered, and in what form (lump sum, paid directly, or both)." },
      { id: "w8-quotes", text: "Ask at least two providers for a written quote for your actual dates and addresses." },
      { id: "w8-lease", text: "Check your lease notice period and your closing or key dates, and write them down." },
      { id: "w8-declutter", text: "Decide what to sell, donate or throw away before you pay to move it." },
      { id: "w8-folder", text: "Start one folder (paper or digital) for quotes, receipts and confirmations." },
    ],
  },
  {
    id: "w5",
    title: "4 to 6 weeks before",
    weeksBefore: 5,
    items: [
      { id: "w5-book", text: "Book your movers or truck for your date, and keep the confirmation." },
      { id: "w5-supplies", text: "Get boxes, tape and padding. Ask local stores and friends for used boxes first." },
      { id: "w5-leave", text: "Request time off work for packing and moving day." },
      { id: "w5-special", text: "Ask each provider how they handle heavy or fragile items, stairs and parking, and note any extra charges." },
      { id: "w5-storage", text: "If there is a gap between homes, ask about storage and enter the amount in the calculator." },
    ],
  },
  {
    id: "w3",
    title: "2 to 3 weeks before",
    weeksBefore: 3,
    items: [
      { id: "w3-address", text: "File your change of address and update banks, insurers, subscriptions and your employer." },
      { id: "w3-utilities", text: "Arrange stop dates at the old home and start dates at the new one for power, water, internet and other services." },
      { id: "w3-records", text: "Ask doctors, schools and others for records or transfers you will need." },
      { id: "w3-parking", text: "Reserve an elevator, loading dock or parking space at either end if the building requires it." },
      { id: "w3-pack", text: "Pack rooms you rarely use first, and label every box with its room." },
    ],
  },
  {
    id: "w1",
    title: "The last week",
    weeksBefore: 1,
    items: [
      { id: "w1-confirm", text: "Confirm the date, time, address and price in writing with your mover or truck provider." },
      { id: "w1-essentials", text: "Pack an essentials box: chargers, medicines, documents, basic tools, toiletries, a change of clothes." },
      { id: "w1-photos", text: "Photograph valuables, electronics and furniture before they are moved." },
      { id: "w1-cash", text: "Prepare payment as agreed, and keep your cash buffer within reach." },
      { id: "w1-appliances", text: "Empty and defrost the fridge and freezer, and disconnect appliances you are taking." },
    ],
  },
  {
    id: "day",
    title: "Moving day",
    weeksBefore: 0,
    items: [
      { id: "day-walk", text: "Walk through every room, closet and storage area before the truck leaves." },
      { id: "day-meters", text: "Note or photograph the meter readings at the old home." },
      { id: "day-keep", text: "Keep documents, valuables, medicines and the essentials box with you, not on the truck." },
      { id: "day-inventory", text: "Check the inventory and the paperwork before you sign anything." },
      { id: "day-keys", text: "Hand over the keys as agreed and keep the confirmation." },
    ],
  },
  {
    id: "after",
    title: "After the move",
    weeksBefore: -2,
    items: [
      { id: "after-damage", text: "Check for damage soon after delivery and report it to the provider as their paperwork says." },
      { id: "after-license", text: "Look up your new state's deadlines for your driver license, vehicle registration and voter registration." },
      { id: "after-receipts", text: "Keep your receipts. Compare what you actually spent with your estimate." },
      { id: "after-neighbors", text: "Locate the nearest pharmacy, grocery store and urgent care." },
    ],
  },
]);

export const ALL_ITEM_IDS = Object.freeze(PHASES.flatMap(phase => phase.items.map(item => item.id)));

// Date a phase is due: `weeksBefore` weeks before the move date (negative = after).
// Works in UTC so a date never shifts with the viewer's time zone. Returns "" when
// the move date is not a real YYYY-MM-DD date.
export function dueDate(moveDate, weeksBefore) {
  if (typeof moveDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) return "";
  const [year, month, day] = moveDate.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  if (base.getUTCFullYear() !== year || base.getUTCMonth() !== month - 1 || base.getUTCDate() !== day) return "";
  base.setUTCDate(base.getUTCDate() - weeksBefore * 7);
  return base.toISOString().slice(0, 10);
}

export function formatDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

// Counts only real item ids, so old or edited saved data cannot inflate the progress.
export function progress(checkedIds) {
  const known = new Set(ALL_ITEM_IDS);
  const done = new Set((Array.isArray(checkedIds) ? checkedIds : []).filter(id => known.has(id)));
  return { done: done.size, total: ALL_ITEM_IDS.length, percent: Math.round((done.size / ALL_ITEM_IDS.length) * 100) };
}

// Keeps only valid ids, once each (used when loading saved data).
export function cleanChecked(value) {
  const known = new Set(ALL_ITEM_IDS);
  return [...new Set(Array.isArray(value) ? value : [])].filter(id => known.has(id));
}
