import { compareCities, describeComparison, equivalentSpending } from "../lib/cost-of-living.js";

const from = document.querySelector("#fromCity");
const to = document.querySelector("#toCity");
const spending = document.querySelector("#spending");
const sentence = document.querySelector("#resultSentence");
const spendingLine = document.querySelector("#resultSpending");
const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function update() {
  const comparison = compareCities(from.value, to.value);
  sentence.textContent = describeComparison(comparison);
  const amount = spending.value.trim() === "" ? NaN : Number(spending.value);
  if (Number.isFinite(amount) && amount >= 0 && comparison.from.slug !== comparison.to.slug) {
    spendingLine.textContent = `The same average basket that costs ${money(amount)} a month in ${comparison.from.name} would cost about ${money(equivalentSpending(amount, comparison.ratio))} a month in ${comparison.to.name}. This is an average-household comparison, not a forecast of your own bills.`;
    spendingLine.hidden = false;
  } else {
    spendingLine.hidden = true;
  }
}

for (const element of [from, to, spending]) element.addEventListener("input", update);
update();
