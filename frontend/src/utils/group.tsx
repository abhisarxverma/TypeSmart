
export function getPortionByImportance(text: string, importance: "high" | "medium" | "low") {
  const len = text.length;
  if (importance === "high") return text.slice(0, Math.max(1, Math.floor(len * 0.6)));
  if (importance === "medium") return text.slice(0, Math.max(1, Math.floor(len * 0.3)));
  return text.slice(0, Math.max(1, Math.floor(len * 0.1)));
}

export function shuffle<T>( arr: T[] ) : T[]  {
    return [...arr].sort(() => Math.random() - 0.5);
}