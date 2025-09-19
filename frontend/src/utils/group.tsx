function getRandomIntInclusive(min: number, max: number) : number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPortionByImportance(
  text: string,
  importance: "high" | "medium" | "low"
) {
  const len = text.length;
  if (len === 0) return "";

  let sizeNeeded = 0;
  if (importance === "high") sizeNeeded = Math.max(1, Math.floor(len * 0.6));
  if (importance === "medium") sizeNeeded = Math.max(1, Math.floor(len * 0.3));
  if (importance === "low") sizeNeeded = Math.max(1, Math.floor(len * 0.1));

  const maxStart = len - sizeNeeded;
  const randomStart = getRandomIntInclusive(0, Math.max(0, maxStart));
  const randomEnd = randomStart + sizeNeeded;

  return text.slice(randomStart, randomEnd);
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
