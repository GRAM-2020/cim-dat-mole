const select = selector => document.querySelector(selector);
const selectAll = selector => Array.from(document.querySelectorAll(selector));
const create = el => document.createElement(el);

// just a littel helperfkt to toggle the attribute active true || false
function toggle(arr) {
  let toggle = arr.getAttribute("data-active") === "true";
  toggle = !toggle;
  arr.dataset.active = toggle;
}
