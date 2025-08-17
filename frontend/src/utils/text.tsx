export function normalizeForTyping(input: string): string {
  let t = input.normalize("NFKC");

  // Replace various Unicode spaces with regular space
  t = t.replace(/[\u00A0\u2007\u202F]/g, " ");

  // Remove zero-width characters & BOM
  t = t.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

  // Normalize quotes and dashes
  t = t
    .replace(/[\u2018\u2019]/g, "'")   // ‘ ’ → '
    .replace(/[\u201C\u201D]/g, '"')   // “ ” → "
    .replace(/[\u2013\u2014]/g, "-")   // – — → -
    .replace(/\u2026/g, "...");       // … → ...

  // Collapse excessive spaces and tabs (but keep single spaces/newlines)
  t = t.replace(/[\t\f\v]+/g, " ").replace(/ {2,}/g, " ");

  // Optionally strip non-typable symbols (keep common punctuation)
  t = t.replace(/[^.,!?;:'"()\[\]{}<>\-_\/@#*$%+=A-Za-z0-9 \n]/g, "");

  return t;
}
