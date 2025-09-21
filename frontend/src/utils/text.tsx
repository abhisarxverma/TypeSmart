import { formatDistanceToNowStrict } from "date-fns";

export function timeAgo(dateString: string) {
  return formatDistanceToNowStrict(new Date(dateString + "Z"), { addSuffix: true });
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
    .replace(/\u2026/g, "...");        // … → ...

  // Replace all horizontal whitespace (tabs, multiple spaces) with single space
  t = t.replace(/[ \t\f\v]+/g, " ");

  // Ensure exactly ONE space after sentence-ending punctuation
  t = t.replace(/([.?!])\s+/g, "$1 ");

  // Remove spaces before punctuation
  t = t.replace(/\s+([.,!?;:'")\]}])/g, "$1");

  // Ensure no multiple spaces anywhere
  t = t.replace(/ {2,}/g, " ");

  // Normalize line breaks:
  // - Trim spaces around newlines
  // - Ensure single \n, not \r\n or multiple \n
  t = t.replace(/\r\n?/g, "\n");
  t = t.replace(/ *\n */g, "\n"); 
  t = t.replace(/\n{2,}/g, "\n\n");

  // Strip non-typable symbols (only allow common punctuation + newlines)
  t = t.replace(/[^.,!?;:'"()\[\]{}<>\-_\/@#*$%+=A-Za-z0-9 \n]/g, "");

  // Trim leading/trailing spaces
  t = t.trim();

  return t;
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function chunkAndShuffle(text: string, wordsPerChunk: number = 30): string {
  const words = text.split(/\s+/); 
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }

  const shuffled = chunks.sort(() => Math.random() - 0.5);

  return shuffled.join(" ");
}

export function sentenceShuffle(text: string): string {
  const sentences = text.split(/([.?!])\s+/).reduce((acc, part, idx, arr) => {
    if (/[.?!]/.test(part) && arr[idx + 1]) {
      acc[acc.length - 1] += part; 
    } else {
      acc.push(part);
    }
    return acc;
  }, [] as string[]);

  const shuffled = sentences.sort(() => Math.random() - 0.5);
  return shuffled.join(" ");
}
