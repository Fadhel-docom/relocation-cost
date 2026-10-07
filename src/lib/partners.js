// Single switch for affiliate / sponsored partners.
//
// Nothing is shown to visitors until a program has approved the site AND its
// tracking link is pasted into `href` below. An empty href keeps the program
// completely hidden: no box, no text, no link.
//
// To activate a program once it approves the site:
//   1. paste the tracking link from the advertiser's dashboard into `href`
//   2. open a PR; CI must be green before merging
// The disclosure page switches its wording automatically when any href is set.
export const PARTNERS = [
  {
    id: "movers-quotes",
    category: "Moving quotes",
    label: "Compare free quotes from moving companies",
    description: "Request written quotes based on your actual inventory and addresses.",
    href: "",
  },
  {
    id: "truck-rental",
    category: "Truck rental",
    label: "Check one-way truck rental prices",
    description: "Prices depend on origin, destination, truck size and date, so check your exact dates.",
    href: "",
  },
  {
    id: "storage",
    category: "Storage",
    label: "Find short-term storage near your new home",
    description: "Useful if move-out and move-in dates do not line up.",
    href: "",
  },
  {
    id: "moving-insurance",
    category: "Moving insurance",
    label: "Compare moving insurance options",
    description: "Standard mover liability can be low; check what is actually covered.",
    href: "",
  },
];

export const activePartners = () => PARTNERS.filter(partner => partner.href.startsWith("https://"));
