import { type Status } from "@/Hooks/useTyping";
import type { Group } from "@/Types/Library";
import { normalizeForTyping } from "./text";

export function initializeStatuses(text: string) : Status[] {
    const statuses: Status[] = Array(text.length).fill("pending");
    statuses[0] = "current"
    return statuses;
}

type Importance = "high" | "medium" | "low";

export function getWeight(importance: Importance): number {
  if (importance === "high") return 3;
  if (importance === "medium") return 2;
  return 1;
}

export function chunkText(text: string, wordsPerChunk: number = 100): string[] {
  const words = text.trim().split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }

  return chunks;
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function chunkAndShuffle(text: string, wordsPerChunk: number = 40): string {
  const chunks = chunkText(text, wordsPerChunk);
  return shuffle(chunks).join(" ");
}

export function generateTypingTextFromGroup(group: Group): string {
  const allChunks: string[] = [];

  for (const item of group.group_texts) {
    const normalized = normalizeForTyping(item.text);
    const chunks = chunkText(normalized);
    const weight = getWeight(item.importance as Importance);
    const repeatedChunks = Array(weight).fill(chunks).flat();
    allChunks.push(...repeatedChunks);
  }

  return shuffle(allChunks).join(" ").trim();
}