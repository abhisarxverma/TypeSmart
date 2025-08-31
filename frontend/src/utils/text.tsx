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

export function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);

  if (years > 0)   return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0)  return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0)   return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0)    return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0)   return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
