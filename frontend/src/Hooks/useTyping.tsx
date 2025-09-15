"use client";
import { createContext, useContext } from "react";
import type { Text, Group } from "@/Types/Library";

export interface TextSegment {
  textId: string;
  start: number;
  end: number;
}

export interface TypingState {
  mode: "idle" | "text" | "group";
  typingText: string;
  progress: number; 
  startedAt?: number;
  finishedAt?: number;
  source?: { type: "text"; id: string } | { type: "group"; id: string };
  segments?: TextSegment[] | null
}

export interface StatsRefObject {
  correct: number
  incorrect: number
  startedAt : number
  elapsedPaused: number;   // total ms spent paused
  pausedAt?: number;       // when the current pause started
  isPaused: boolean;
}

export interface Stats {
  wpm: number  
}

interface TypingContextType {
  state: TypingState;
  startText: (text: Text) => void;
  startGroup: (group: Group) => void;
  resetRound: () => void;
  updateProgress: (index: number, total: number) => void;
  completeRound: () => void;
  progressRef : React.RefObject<number>
  getCurrentTextName: () => string | null;
  statsRef : React.RefObject<StatsRefObject>;
  getCurrentStats: () => Stats;
  pause: () => void;
  resume: () => void;
}

export const TypingContext = createContext<TypingContextType | null>(null);

export function useTyping() {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTyping must be used within TypingProvider");
  return ctx;
}
