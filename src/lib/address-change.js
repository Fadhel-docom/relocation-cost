// Content and sources for the "Who to tell when you move" guide. Every point is paraphrased from one of the two
// official pages listed in SOURCES (read by a person on the date in data/source-checks.json, scope "address-guide").
// Nothing here is a price, a legal deadline of ours or a promise. Tests (address-change.test.js) check that each
// point cites a listed source, that the only figures are the ones the pages state, and that the source data matches.
import checks from "../../data/source-checks.json" with { type: "json" };
import { oldestDate } from "./source-freshness.js";

export const MAX_AGE_DAYS = checks.maxAgeDays;
const entries = Object.entries(checks.sources).filter(([, source]) => source.scope === "address-guide");
// Oldest verification date among this guide's sources; null (never a made-up date) when missing or invalid,
// which the page treats as stale.
export const CHECKED_ON = oldestDate(entries.map(([, source]) => source.lastVerified));

export const TITLE = "Who to Tell When You Move: An Address-Change List";
export const DESCRIPTION = "The agencies the official USAGov moving page tells you to update, and what the USPS says about when to file a change of address and how long mail is forwarded.";

const BASE_SOURCES = [
  { id: "usagov-moving", label: "USAGov: How to change your address", url: "https://www.usa.gov/moving" },
  { id: "usps-coa", label: "USPS FAQ: Change of Address, The Basics", url: "https://faq.usps.com/articles/Knowledge/Change-of-Address-The-Basics" },
];

export const SOURCES = Object.freeze(BASE_SOURCES.map(source => {
  const config = checks.sources[source.id] ?? {};
  return Object.freeze({
    ...source,
    verified: config.lastVerified ?? null,
    ...(config.pageUpdated ? { pageUpdated: config.pageUpdated } : {}),
  });
}));

// The list the USAGov page gives, in its order. "who" is the office to contact; "what" paraphrases the page.
export const STEPS = Object.freeze([
  { who: "U.S. Postal Service", what: "Tell the post office you are changing your address so mail can be forwarded. The page says you can do this online at USPS.com/move or at a local post office.", sources: ["usagov-moving"] },
  { who: "Internal Revenue Service (federal taxes)", what: "Update your address with the IRS. The page links to the IRS address-change page.", sources: ["usagov-moving"] },
  { who: "Social Security", what: "Update your contact information with the Social Security Administration through the page it links to.", sources: ["usagov-moving"] },
  { who: "Veterans benefits (VA)", what: "Change the address on file with the Department of Veterans Affairs through the page it links to.", sources: ["usagov-moving"] },
  { who: "Immigration (USCIS)", what: "Submit an address change to U.S. Citizenship and Immigration Services through the page it links to.", sources: ["usagov-moving"] },
  { who: "Driver's license and vehicle registration", what: "Contact your state motor vehicle services office.", sources: ["usagov-moving"] },
  { who: "Voter registration", what: "Contact your state election office. The page also points to vote.gov for updating a registration.", sources: ["usagov-moving"] },
]);

// What the USPS page says about filing a change of address.
export const MAIL_FACTS = Object.freeze([
  { text: "A change-of-address request can be submitted up to 90 days before the effective date of your move and up to 30 days after it.", sources: ["usps-coa"] },
  { text: "The page recommends telling the people and companies that send you mail at least two weeks before you move, which it says makes the change faster.", sources: ["usps-coa"] },
  { text: "First-Class Mail, USPS Ground Advantage and Priority Mail are forwarded for up to 12 months, depending on the mail class. Periodicals are forwarded for 60 days, and USPS Marketing Mail is forwarded only if the sender asks for forwarding. A temporary move can last at most 364 days.", sources: ["usps-coa"] },
  { text: "You can file online at USPS.com or at a Post Office. A paper form (PS Form 3575) is available at Post Office locations. Military address changes must be done online.", sources: ["usps-coa"] },
  { text: "Filing online involves an identity check: the page says your card details are verified electronically with the card's bank, and it mentions a small authentication fee.", sources: ["usps-coa"] },
  { text: "Both pages warn about third-party websites that charge much more than the official site for the same address change. The USPS page says it does not accept them, and USAGov says to use the official USPS.com site.", sources: ["usps-coa", "usagov-moving"] },
]);

// What the sources do not say. Listed so nobody assumes this guide fills the gap.
export const NOT_STATED = Object.freeze([
  "The USAGov page gives no deadlines for telling the IRS, Social Security, the VA, USCIS, your state motor vehicle office or your election office. Check each office's own page for its rules.",
  "The USAGov page does not mention Medicare, and it names only veterans benefits under benefits.",
  "Neither page covers banks, insurers, your employer, utilities, schools, doctors or subscriptions.",
  "The two pages state different fee amounts for the official online change of address, so this guide gives none. Check the amount on the official USPS.com checkout.",
  "The USPS page shows no publication date, so we cannot say how recent its figures are. A person last read it on the date shown under Sources.",
]);

// Practical suggestions, not statements from the sources.
export const TIPS = Object.freeze([
  "Write the list of everyone who sends you mail or bills (banks, insurers, employer, utilities, subscriptions) before moving day, and update them before the move where they allow it.",
  "Start with the official records on this page, then the accounts that send paper statements.",
  "Type usps.com yourself or use the link from USAGov instead of clicking an advertisement, so you do not land on a look-alike site.",
  "Keep the confirmation of each change in one place, and note any office that asks for a different form or proof.",
]);

export function sourceNumber(id) {
  const index = SOURCES.findIndex(source => source.id === id);
  return index === -1 ? 0 : index + 1;
}
