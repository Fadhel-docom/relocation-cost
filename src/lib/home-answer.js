// The short, sourced answer in the "How it works" section of the home page. The home page renders these
// constants, the post-deploy check looks for HOME_ANSWER_LEAD, and home-answer.test.js ties each claim to what
// the calculator really does. No number, price, period or percentage is typed here: a figure that changes in the
// calculator must never leave this text saying something else.
export const HOME_ANSWER_HEADING = "How to calculate relocation costs";

export const HOME_ANSWER_LEAD = "A relocation budget has three parts: the move itself, the costs around the move, and a planning buffer for what you miss.";

export const HOME_ANSWER_MOVE = "Here the move cost comes from your distance, home size and move type, and it is never set below the published average one-way truck-rental price for your distance band.";

export const HOME_ANSWER_AROUND = "The costs around the move, such as travel, temporary housing, deposits and setup, packing, insurance and storage, are amounts you enter yourself, and the calculator adds a contingency on top.";

export const HOME_ANSWER_LIMITS = "It is a planning range, not a quote: it uses an approximate driving distance between a central point in each of two states unless you enter your driving miles, it does not use your move date, and it does not calculate taxes. Replace it with written quotes based on your addresses and inventory.";

export const HOME_ANSWER_LINKS = Object.freeze({
  calculator: { href: "/calculator/", label: "Calculate my moving cost →" },
  employer: { href: "/calculator/#employer-package", label: "Moving for a job? Compare with an employer package →" },
});
