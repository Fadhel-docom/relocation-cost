// Content and sources for the "How to check a moving company" guide. Every rule below is a plain-language
// paraphrase of one of the official pages listed in SOURCES (FMCSA and the FTC). Nothing here is a price,
// a promise or legal advice. Tests (mover-checks.test.js) require every rule to cite a listed source and
// limit the figures to the ones the sources state. The dates come from data/source-checks.json (scope
// "scam-guide"); these pages are read by a person, and the weekly check opens a reminder issue before the
// page warns readers.
import checks from "../../data/source-checks.json" with { type: "json" };
import { oldestDate } from "./source-freshness.js";

export const MAX_AGE_DAYS = checks.maxAgeDays;
const entries = Object.entries(checks.sources).filter(([, source]) => source.scope === "scam-guide");
// Oldest verification date among this guide's sources; null (never a made-up date) when any is missing or
// invalid, which the page treats as stale.
export const CHECKED_ON = oldestDate(entries.map(([, source]) => source.lastVerified));

export const TITLE = "How to Check a Moving Company and Spot Red Flags";
export const DESCRIPTION = "How to check a mover's federal registration, the warning signs of moving scams, what to do if the price jumps or goods are held, and where to report it.";

const BASE_SOURCES = [
  {
    id: "fmcsa-faq",
    label: "FMCSA: Questions about how to protect yourself from fraud",
    url: "https://www.fmcsa.dot.gov/protect-your-move/faq",
  },
  {
    id: "fmcsa-rogue",
    label: "FMCSA: How can I avoid fraudulent or rogue moving companies?",
    url: "https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/how-can-i-avoid-fraudulent-or-rogue-moving-companies",
  },
  {
    id: "ftc-alert",
    label: "FTC Consumer Advice: Avoid scams when you hire a moving company",
    url: "https://consumer.ftc.gov/consumer-alerts/2024/09/avoid-scams-when-you-hire-moving-company",
  },
  {
    id: "fmcsa-brochure",
    label: "FMCSA: Protect Your Move brochure (an older publication)",
    url: "https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/docs/Protect_Your_Move_Brochure.pdf",
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

export const RULE_GROUPS = Object.freeze([
  {
    id: "check",
    title: "Check the company before you book",
    rules: [
      {
        text: "Movers and brokers that handle moves to a different state must be registered with the federal government and have a U.S. DOT number. The FTC adds that the same registration applies to moves out of the country.",
        sources: ["fmcsa-rogue", "ftc-alert"],
      },
      {
        text: "FMCSA runs a household goods search tool. You can search by company name, U.S. DOT number or MC number, and it shows whether the company is registered and what complaints it has. FMCSA also says a company can be registered without being authorized to move household goods, and the same search shows whether it is insured and authorized.",
        sources: ["fmcsa-faq", "fmcsa-rogue"],
      },
      {
        text: "A broker does not move your belongings. It must use only registered movers, and a broker working across state lines must be registered itself. Ask whether the company is a mover or a broker, and whether it uses its own crews and trucks.",
        sources: ["fmcsa-faq"],
      },
      {
        text: "For a move inside one state, the rules differ by state. Ask your state, county or local consumer affairs agency, or your state moving association, what applies. The FTC suggests looking for a local address, contact details, registration, licenses and insurance on the company's website.",
        sources: ["fmcsa-rogue", "ftc-alert"],
      },
      {
        text: "The FTC also suggests reading online reviews and searching the company's name together with the words complaint or scam.",
        sources: ["ftc-alert"],
      },
    ],
  },
  {
    id: "signs",
    title: "Warning signs",
    rules: [
      {
        text: "The FTC says to walk away from paperwork with blanks left for prices, dates, signatures or other key details, from a demand for cash or a large deposit before the move, and from an interstate mover that is not registered.",
        sources: ["ftc-alert"],
      },
      {
        text: "FMCSA's brochure lists more signs: an estimate given by phone or online without anyone inspecting your belongings, and a company that does not hand you the booklet Your Rights and Responsibilities When You Move.",
        sources: ["fmcsa-brochure"],
      },
      {
        text: "The brochure also warns about a website with no local address and no registration or insurance information, a company that claims all your goods are covered by its insurance, and a phone greeting that says only \"Movers\" instead of a company name.",
        sources: ["fmcsa-brochure"],
      },
      {
        text: "It adds offices or warehouses that are in poor condition or do not exist, and a crew that arrives in a rental truck instead of a company-owned, marked truck.",
        sources: ["fmcsa-brochure"],
      },
    ],
  },
  {
    id: "writing",
    title: "Get it in writing",
    rules: [
      {
        text: "Get written estimates from several movers. The FTC says a mover should inspect your belongings, or have them fully described, before it estimates. Check that each estimate lists all of your property before you compare them.",
        sources: ["ftc-alert"],
      },
      {
        text: "FMCSA's page lists a physical survey among the requirements for a move arranged through a broker: the mover that will transport your goods, not the broker, must do it when your goods are within 50 miles of the mover's or its agent's location (the closer of the two counts), unless you waive the survey.",
        sources: ["fmcsa-faq"],
      },
      {
        text: "Ask each mover what it charges to insure your goods and what it pays for damage, and compare the answers in writing.",
        sources: ["ftc-alert"],
      },
    ],
  },
  {
    id: "price",
    title: "If the price goes up or your goods are held",
    rules: [
      {
        text: "FMCSA says that if a mover raises the price after loading, you do not have to pay more than 100 percent of a binding estimate or 110 percent of a non-binding estimate. The mover must bill any extra charges within 30 days after delivery.",
        sources: ["fmcsa-faq"],
      },
      {
        text: "If you have paid those amounts and the mover still will not deliver, FMCSA's page says the mover has broken the federal rules that protect people who ship household goods, and that this is a reason to file a complaint.",
        sources: ["fmcsa-faq"],
      },
    ],
  },
  {
    id: "report",
    title: "Where to report a problem",
    rules: [
      {
        text: "For a problem with a move to a different state, or to another country, report it to FMCSA. It takes complaints online and by phone, listed below.",
        sources: ["fmcsa-faq", "ftc-alert"],
      },
      {
        text: "FMCSA's page says a complaint should include your name, address and phone number, the mover's or broker's name, address and phone number, where the move started and ended, the U.S. DOT and MC numbers if you have them, and a short description of what went wrong.",
        sources: ["fmcsa-faq"],
      },
      {
        text: "For a problem with a move inside one state, the FTC points to your state enforcement agency. If a mover disappears with your belongings, FMCSA's page also suggests contacting your state attorney general or the state enforcement agency.",
        sources: ["ftc-alert", "fmcsa-faq"],
      },
      {
        text: "If you already paid someone you think is a scammer, the FTC has a page on what to do, and you can report the scam to the FTC.",
        sources: ["ftc-alert"],
      },
    ],
  },
]);

// Contact details exactly as the sources state them (kept apart from the rules so the tests can limit the
// figures inside the rules).
export const CONTACTS = Object.freeze([
  { label: "Search a mover or broker (registration, insurance, complaint history)", text: "FMCSA household goods search", url: "https://ai.fmcsa.dot.gov/hhg/search.asp", sources: ["fmcsa-faq", "ftc-alert"] },
  { label: "File a complaint with FMCSA online", text: "complaint.fmcsa.dot.gov", url: "https://complaint.fmcsa.dot.gov", sources: ["fmcsa-faq"] },
  { label: "FMCSA complaint hotline (8:00 am to 8:00 pm Eastern, Monday to Friday)", text: "1-888-368-7238", url: "tel:+18883687238", sources: ["fmcsa-faq"] },
  { label: "State enforcement agencies for in-state moves (FMCSA's list)", text: "FMCSA state law enforcement page", url: "https://www.fmcsa.dot.gov/protect-your-move/state-law-enforcement", sources: ["ftc-alert"] },
  { label: "Report a scam to the FTC", text: "ReportFraud.ftc.gov", url: "https://reportfraud.ftc.gov/", sources: ["ftc-alert"] },
]);

// What the pages we read do not say. Listed so nobody assumes the guide fills the gap.
export const NOT_STATED = Object.freeze([
  "None of the pages gives a limit for a deposit, so there is no number here to compare against.",
  "None of the pages we read gives a deadline for you to file a complaint. Do not wait to see whether a problem fixes itself.",
  "FMCSA's page does not say what happens after you file, how long it takes, or whether goods or money are recovered.",
]);

// Practical questions. These are suggestions, not rules, so they carry no source.
export const QUESTIONS = Object.freeze([
  "Is the company in FMCSA's search, and do its name, address and DOT number match the paperwork and the truck?",
  "Is it a mover or a broker, and who will actually load and drive?",
  "Did anyone look at my belongings, in person or by video, before giving a price?",
  "Is every line of the paperwork filled in before I sign, with no blanks?",
  "Why is a deposit needed, how much is it, and how will I pay?",
  "What is written about insurance and damage, and what does it cost?",
  "Did I receive the FMCSA booklet before the move?",
]);

export function sourceNumber(id) {
  const index = SOURCES.findIndex(source => source.id === id);
  return index === -1 ? 0 : index + 1;
}
