// Truck sizes for the "Choosing a moving truck size" guide. Every figure is copied from one official
// page (U-Haul's truck rentals page, "What Fits into a Truck": Volume and Home Size rows). Nothing here is a
// price, a calculation or a recommendation for one home: the company's own "home size" wording is shown as
// the company states it. The weekly source check (data/source-checks.json, "uhaul-trucks") confirms the
// volumes are still on that page.
export const SOURCE = Object.freeze({
  id: "uhaul-trucks",
  label: "U-Haul: Truck rentals, What Fits into a Truck",
  url: "https://www.uhaul.com/Truck-Rentals/",
});

// Smallest to largest, in the order the source lists them.
export const TRUCKS = Object.freeze([
  { name: "Pickup truck", cubicFeet: 76, homeSize: "Small loads / studio apartment" },
  { name: "Cargo van", cubicFeet: 246, homeSize: "Studio apartment / deliveries" },
  { name: "10' truck", cubicFeet: 402, homeSize: "Studio / 1-bedroom apartment" },
  { name: "15' truck", cubicFeet: 764, homeSize: "1-bedroom home / 2-bedroom apartment" },
  { name: "20' truck", cubicFeet: 1016, homeSize: "2-bedroom home / 3-bedroom apartment" },
  { name: "26' truck", cubicFeet: 1682, homeSize: "3-4 bedroom home" },
  { name: "29' truck", cubicFeet: 2057, homeSize: "4-6 bedroom home" },
]);

export const formatCubicFeet = value => `${value.toLocaleString("en-US")} cu. ft.`;

// How a volume compares with the next size down, as whole percent (a plain ratio of the two listed volumes).
export function stepUp(index) {
  if (!Number.isInteger(index) || index < 1 || index >= TRUCKS.length) throw new RangeError("No smaller truck to compare with.");
  return Math.round((TRUCKS[index].cubicFeet / TRUCKS[index - 1].cubicFeet - 1) * 100);
}

// Patterns the weekly check expects on the source page: each volume as the page writes it.
export const volumePatterns = () => TRUCKS.map(truck => truck.cubicFeet.toLocaleString("en-US").replace(",", ",?") + "\\s*cu");

export const TIPS = Object.freeze([
  "Start from your inventory, not the number of rooms. Two homes with the same bedroom count can hold very different amounts, so list the big items (sofa, mattresses, appliances, boxes) and compare with the volume above.",
  "The home size shown is the company's rough guide. Treat it as a starting point, then check it against your own inventory.",
  "Volume is space inside the truck, not what fits after loading gaps and awkward shapes. Leaving some spare room is safer than planning to fill every cubic foot.",
  "A larger truck is not the same cost as a smaller one. Get the quote for the size you are considering, for your route and date, before you decide.",
  "If your load is close to the limit of one size, ask for the next size up in the same quote rather than planning on a second trip.",
  "Lengths are grouped under each heading on the company's page, so confirm the exact truck and its interior size when you book.",
]);
