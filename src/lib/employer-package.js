// Content and sources for the "Employer relocation package" guide. Every statement about tax is paraphrased from the
// two IRS pages in SOURCES (the same two pages behind the tax note in the calculator's employer box, scope "tax-note"
// in data/source-checks.json, read by a person). The questions to ask an employer are our own suggestions, not
// statements from any source. Nothing here is an amount, a tax calculation, or tax advice.
import checks from "../../data/source-checks.json" with { type: "json" };
import { oldestDate } from "./source-freshness.js";

export const MAX_AGE_DAYS = checks.maxAgeDays;
const entries = Object.entries(checks.sources).filter(([, source]) => source.scope === "tax-note");
// Oldest verification date among this guide's sources; null (never a made-up date) when missing or invalid,
// which the page treats as stale.
export const CHECKED_ON = oldestDate(entries.map(([, source]) => source.lastVerified));

export const TITLE = "Employer Relocation Package: What the IRS Says";
export const DESCRIPTION = "What two IRS pages say about employer moving reimbursements and the moving expense deduction, plus questions to ask your employer before you rely on a package.";
export const LEAD = "A relocation package can look generous until you ask how it is paid and reported.";

const BASE_SOURCES = [
  { id: "irs-p15b", label: "IRS Publication 15-B (2026), Employer's Tax Guide to Fringe Benefits", url: "https://www.irs.gov/publications/p15b" },
  { id: "irs-i3903", label: "IRS Instructions for Form 3903 (2025)", url: "https://www.irs.gov/node/62261" },
];

export const SOURCES = Object.freeze(BASE_SOURCES.map(source => {
  const config = checks.sources[source.id] ?? {};
  return Object.freeze({
    ...source,
    verified: config.lastVerified ?? null,
    ...(config.pageUpdated ? { pageUpdated: config.pageUpdated } : {}),
  });
}));

// What the two pages say.
export const FACTS = Object.freeze([
  { text: "Publication 15-B (2026) says the exclusion for qualified moving expense reimbursements was permanently eliminated. For most employees, a reimbursement for moving costs is therefore no longer left out of income.", sources: ["irs-p15b"] },
  { text: "The same page keeps the exclusion for members of the U.S. Armed Forces on active duty, limited to reimbursement of moving expenses the member could deduct. It also makes it available to an employee or new appointee of the intelligence community, under the same limit.", sources: ["irs-p15b"] },
  { text: "The publication's general rule for a taxable fringe benefit is that it is generally subject to employment taxes and must be reported on Form W-2.", sources: ["irs-p15b"] },
  { text: "The Form 3903 instructions say the moving expense deduction was eliminated for tax years after 2017, except for certain Armed Forces members. They say you can no longer deduct moving expenses unless you are a member of the Armed Forces on active duty. The page shows an update date of April 30, 2026.", sources: ["irs-i3903"] },
]);

// What the sources do not say. Listed so nobody assumes this guide fills the gap.
export const NOT_STATED = Object.freeze([
  "We read the \"What's New\" part of Publication 15-B and most of the page, not every section. The parts we read do not spell out how a moving reimbursement is withheld or reported, so this guide does not either.",
  "Neither page covers state income tax or the tax rules of other countries.",
  "Neither page says whether a particular employer adds extra money to cover the tax on a package. That is an employer policy.",
  "Neither page covers repayment agreements, deadlines or what an employer chooses to cover. Those are set by the employer.",
  "This is a summary of two pages, not tax advice. Your employer's payroll team or a tax professional can say how your package is reported.",
]);

// Our suggestions, not statements from the sources.
export const QUESTIONS = Object.freeze([
  "Is the amount quoted before or after tax? Ask for the figure you would actually receive.",
  "Is any part a lump sum paid to you, and any part paid directly to movers or a housing provider? Ask how each part is reported.",
  "Does the employer add extra money to cover the tax on the package (sometimes called a gross-up), and is that in writing?",
  "What is covered: movers, travel, temporary housing, house hunting, storage? What is not?",
  "What receipts, forms and deadlines apply, and who books and pays the movers?",
  "Must you repay any of it if you leave the company within a set period? Get the terms in writing.",
]);

export function sourceNumber(id) {
  const index = SOURCES.findIndex(source => source.id === id);
  return index === -1 ? 0 : index + 1;
}
