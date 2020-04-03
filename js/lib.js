const select = selector => document.querySelector(selector);
const selectAll = selector => Array.from(document.querySelectorAll(selector));
const create = el => document.createElement(el);

//helper function to toggle visibility (of a mole) with the attribute of active true || false
function toggleVisibility(arr) {
  let toggleVisibility = arr.getAttribute("data-active") === "true";
  toggleVisibility = !toggleVisibility;
  arr.dataset.active = toggleVisibility;
}
