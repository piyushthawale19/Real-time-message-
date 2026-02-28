const map = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export const escapeHtml = (str) =>
  String(str).replace(/[&<>"'/]/g, (c) => map[c]);
