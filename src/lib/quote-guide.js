// Content and sources for the "How to read a moving quote" guide. Every rule below is a plain-language
// paraphrase of one of the official pages listed in SOURCES, which were read on CHECKED_ON. Nothing here is a
// price or legal advice. Tests (quote-guide.test.js) require every rule to cite a listed source and limit the
// figures to the ones the sources state.
export const CHECKED_ON = "2026-10-18";

export const TITLE = "How to Read a Moving Quote: Binding vs Non-Binding Estimates";
export const DESCRIPTION = "What binding and non-binding moving estimates mean under federal rules for interstate moves, the 110% limit at delivery, and what to ask before you sign.";

export const SOURCES = Object.freeze([
  {
    id: "fmcsa-estimates",
    label: "FMCSA: What is a binding move estimate?",
    url: "https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/what-binding-move-estimate",
    pageUpdated: "2023-10-26",
  },
  {
    id: "fmcsa-avoid",
    label: "FMCSA: How can I avoid unexpected moving costs?",
    url: "https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/how-can-i-avoid-unexpected-moving-costs",
    pageUpdated: "2023-10-26",
  },
  {
    id: "fmcsa-rights",
    label: "FMCSA: Consumer rights when you move",
    url: "https://www.fmcsa.dot.gov/protect-your-move/consumer-rights",
    pageUpdated: "2024-11-04",
  },
  {
    id: "cfr-401",
    label: "49 CFR § 375.401: Must I estimate charges?",
    url: "https://www.law.cornell.edu/cfr/text/49/375.401",
  },
  {
    id: "cfr-403",
    label: "49 CFR § 375.403: How must I provide a binding estimate?",
    url: "https://www.law.cornell.edu/cfr/text/49/375.403",
  },
  {
    id: "cfr-405",
    label: "49 CFR § 375.405: How must I provide a non-binding estimate?",
    url: "https://www.law.cornell.edu/cfr/text/49/375.405",
  },
  {
    id: "cfr-201",
    label: "49 CFR § 375.201: What is the mover's liability for loss or damage?",
    url: "https://www.law.cornell.edu/cfr/text/49/375.201",
  },
]);

export const RULE_GROUPS = Object.freeze([
  {
    id: "getting",
    title: "Getting an estimate",
    rules: [
      {
        text: "These federal rules cover moves to a different state. Before an interstate move, the mover or broker must give you FMCSA's handbook Your Rights and Responsibilities When You Move and its Ready to Move brochure.",
        sources: ["fmcsa-rights"],
      },
      {
        text: "A mover must give you a written estimate of total charges before the bill of lading, which is the shipping contract, is executed. The estimate must say whether it is binding or non-binding. Oral estimates are not an option under this rule.",
        sources: ["cfr-401"],
      },
      {
        text: "The estimate is supposed to rest on a physical survey of your belongings, unless you waive the survey in a signed written agreement. FMCSA's consumer page also mentions a virtual inspection.",
        sources: ["cfr-401", "fmcsa-avoid"],
      },
      {
        text: "FMCSA says a rate quote is not an estimate. Look for a document that lists the shipment, the services and the charges, and says binding or non-binding.",
        sources: ["fmcsa-avoid", "fmcsa-estimates"],
      },
      {
        text: "The regulation describes two kinds of estimate, binding and non-binding. If a company uses another name, ask which of the two it is and have the answer written on the estimate.",
        sources: ["cfr-401", "fmcsa-estimates"],
      },
    ],
  },
  {
    id: "binding",
    title: "If the estimate is binding",
    rules: [
      {
        text: "A binding estimate is an agreement made in advance that fixes the total for the quantities and services it lists. Its face must say that it binds both you and the mover and that the charges cover only the services listed.",
        sources: ["cfr-401", "cfr-403"],
      },
      {
        text: "If you add items or services, or conditions turn out different (stairs, elevators, parking permits), the mover must prepare a new binding estimate that covers everything being moved. Before loading, the mover may also reaffirm the old estimate or agree in writing to treat it as non-binding.",
        sources: ["fmcsa-estimates", "cfr-403"],
      },
      {
        text: "If only part of a binding shipment is delivered, the mover may collect only a prorated share based on weight.",
        sources: ["cfr-403"],
      },
    ],
  },
  {
    id: "non-binding",
    title: "If the estimate is non-binding",
    rules: [
      {
        text: "A non-binding estimate is the mover's best projection of the cost. Final charges follow the shipment's actual weight, the services provided and the mover's tariff, so the final bill can be higher. The estimate must say it is not binding and that the charges are approximate.",
        sources: ["cfr-401", "cfr-405", "fmcsa-estimates"],
      },
      {
        text: "At delivery, the mover cannot require you to pay more than 110 percent of a non-binding estimate, with limited exceptions for added services. Services the mover considers necessary after the bill of lading is issued are billed 30 days after delivery.",
        sources: ["cfr-405", "fmcsa-estimates"],
      },
      {
        text: "Charges for impracticable operations, as defined in the mover's tariff, can be collected at delivery, but only up to 15 percent of all the other charges due at delivery.",
        sources: ["cfr-403", "cfr-405"],
      },
      {
        text: "Before doing an added service after the bill of lading is issued, the mover must tell you what it is and give you at least one hour to decide. If you agree, you sign a written attachment.",
        sources: ["cfr-405"],
      },
    ],
  },
  {
    id: "coverage",
    title: "Coverage for loss or damage",
    rules: [
      {
        text: "A mover is liable for loss or damage to your goods during transportation. With full value protection, liability equals the replacement value, up to the shipment's declared value. If you waive it in writing, liability is limited to the released rates set by the Surface Transportation Board. The mover must clearly tell you the limits of its liability.",
        sources: ["cfr-201"],
      },
    ],
  },
]);

export const COMPARISON = Object.freeze([
  {
    label: "What it fixes",
    binding: "The total for the listed quantities and services.",
    nonBinding: "Nothing: it is the mover's best projection.",
    sources: ["cfr-401", "cfr-403"],
  },
  {
    label: "What sets the final charge",
    binding: "The estimate, unless you add items or services.",
    nonBinding: "Actual weight, services provided and the mover's tariff.",
    sources: ["cfr-401", "cfr-405"],
  },
  {
    label: "At delivery",
    binding: "You pay the estimated amount for the listed services.",
    nonBinding: "The mover cannot require more than 110 percent of the estimate, with limited exceptions.",
    sources: ["fmcsa-estimates", "cfr-403", "cfr-405"],
  },
  {
    label: "If you add items or services",
    binding: "The mover must prepare a new binding estimate for everything being moved.",
    nonBinding: "The mover must tell you what is added and give you time to decide, then you sign a written attachment.",
    sources: ["fmcsa-estimates", "cfr-403", "cfr-405"],
  },
]);

// Practical questions. These are suggestions, not rules, so they carry no source.
export const QUESTIONS = Object.freeze([
  "Is the estimate in writing, and does it say binding or non-binding?",
  "Was it based on a survey of my belongings, in person or virtual, and does it match my real inventory?",
  "Does it list every service I need: packing, stairs or a long carry, an elevator, storage, parking?",
  "What would make the mover write a new estimate, and how would I approve it?",
  "What coverage does the price include, and what are its limits, in writing?",
  "When and how is payment due at delivery, and in what form?",
  "Did I receive the FMCSA handbook and brochure before the move?",
]);

export function sourceNumber(id) {
  const index = SOURCES.findIndex(source => source.id === id);
  return index === -1 ? 0 : index + 1;
}
