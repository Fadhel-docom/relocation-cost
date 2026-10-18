import { ALL_ITEM_IDS, cleanChecked, dueDate, formatDate, progress } from "../lib/checklist.js";

const KEY = "relocation-checklist";
const moveDateInput = document.querySelector("#moveDate");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const progressFill = document.querySelector("#progressFill");
const boxes = [...document.querySelectorAll("input[data-item]")];
const dueLabels = [...document.querySelectorAll("[data-due]")];

let state = { checked: [], moveDate: "" };

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      state.checked = cleanChecked(saved.checked);
      state.moveDate = dueDate(saved.moveDate, 0) ? saved.moveDate : "";
    }
  } catch {}
};

const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
};

const render = () => {
  const checked = new Set(state.checked);
  boxes.forEach(box => {
    box.checked = checked.has(box.dataset.item);
    box.parentElement.dataset.done = String(box.checked);
  });

  const { done, total, percent } = progress(state.checked);
  progressText.textContent = `${done} of ${total} done`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", String(percent));

  moveDateInput.value = state.moveDate;
  dueLabels.forEach(label => {
    const weeks = Number(label.dataset.weeks);
    const iso = dueDate(state.moveDate, weeks);
    if (!iso) { label.hidden = true; label.textContent = ""; return; }
    label.hidden = false;
    label.textContent = weeks === 0 ? `On ${formatDate(iso)}` : weeks < 0 ? `From ${formatDate(iso)}` : `Aim for ${formatDate(iso)}`;
  });
};

boxes.forEach(box => box.addEventListener("change", () => {
  const next = new Set(state.checked);
  if (box.checked) next.add(box.dataset.item); else next.delete(box.dataset.item);
  state.checked = ALL_ITEM_IDS.filter(id => next.has(id));
  save();
  render();
}));

moveDateInput?.addEventListener("change", () => {
  state.moveDate = dueDate(moveDateInput.value, 0) ? moveDateInput.value : "";
  save();
  render();
});

document.querySelector("#resetList")?.addEventListener("click", () => {
  state = { checked: [], moveDate: "" };
  try { localStorage.removeItem(KEY); } catch {}
  render();
});

document.querySelector("#printList")?.addEventListener("click", () => window.print());

load();
render();
