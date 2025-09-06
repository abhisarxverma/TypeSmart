import { formatDistanceToNowStrict } from "date-fns";

export function timeAgo(dateString: string) {
  return formatDistanceToNowStrict(new Date(dateString), { addSuffix: true });
}


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

  // Collapse excessive horizontal whitespace (tabs, multiple spaces), but preserve newlines
  t = t
    .replace(/[ \t\f\v]+/g, " ")       // Replace tabs and other horizontal whitespace with single space
    .replace(/ {2,}/g, " ");           // Collapse multiple spaces into one

  // Optionally strip non-typable symbols (keep common punctuation and newlines)
  t = t.replace(/[^.,!?;:'"()\[\]{}<>\-_\/@#*$%+=A-Za-z0-9 \n]/g, "");

  return t;
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}