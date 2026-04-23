import { INITIAL_DATA } from "../constants.js";

export function cloneInitialData() {
  if (typeof structuredClone === "function") {
    return structuredClone(INITIAL_DATA);
  }
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

export function buildId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function fmtDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function roleLabel(role) {
  return role.replaceAll("_", " ");
}
