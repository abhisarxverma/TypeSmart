"use client";
import { createContext, useContext } from "react";
import type { Text, Group } from "@/Types/Library";

export interface TypingState {
  mode: "idle" | "text" | "group";
  typingText: string;
  progress: number; 
  startedAt?: number;
  finishedAt?: number;
  source?: { type: "text"; id: string } | { type: "group"; id: string };
}

interface TypingContextType {
  state: TypingState;
  startText: (text: Text) => void;
  startGroup: (group: Group) => void;
  resetRound: () => void;
  updateProgress: (index: number, total: number) => void;
  completeRound: () => void;
}

export const TypingContext = createContext<TypingContextType | null>(null);

export function useTyping() {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTyping must be used within TypingProvider");
  return ctx;
}
