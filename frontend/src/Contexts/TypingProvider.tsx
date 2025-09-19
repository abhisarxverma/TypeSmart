import { useRef, useState, type ReactNode } from "react";
import { dummyText } from "@/Data/dummy";
import type { Text, Group } from "@/Types/Library";
import { normalizeForTyping } from "@/utils/text";
import { TypingContext, type StatsRefObject, type TextSegment, type TypingState } from "@/Hooks/useTyping";
import { useLibrary } from "@/Hooks/useLibrary";
import { getPortionByImportance, shuffle } from "@/utils/group";


const defaultState: TypingState = {
  mode: "idle",
  typingText: dummyText,
  progress: 0
};

export default function TypingProvider({ children }: { children: ReactNode }) {

  const { library } = useLibrary();

  const [state, setState] = useState<TypingState>(defaultState);

  const progressRef = useRef<number>(0);

  const statsRef = useRef<StatsRefObject>({
    correct: 0,
    incorrect: 0,
    startedAt: 0,
    elapsedPaused: 0,
    isPaused: false,
    completed: false
  });


  const startText = (text: Text) => {
    progressRef.current = 0;
    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: Date.now(),
      elapsedPaused: 0,
      isPaused: false,
      completed: false
    }
    setState({
      mode: "text",
      typingText: normalizeForTyping(text.text),
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
      source: { type: "text", id: text.id },
    });
  };

  const startGroup = (group: Group) => {
    
    const selectedTexts = group.group_texts.map(txtObj => {
      return getPortionByImportance(txtObj.text, txtObj.importance as "high" | "medium" | "low");
    });
    
    const typingText = shuffle(selectedTexts).join(" ");
    
    let combined = "";
    const segments: TextSegment[] = [];

    typingText.forEach((t) => {
      const norm = normalizeForTyping(t.text);
      const start = combined.length;
      combined += (combined ? " " : "") + norm;
      const end = combined.length - 1;
      segments.push({ textId: t.id, start, end });
    });

    progressRef.current = 0;
    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: Date.now(),
      elapsedPaused: 0,
      isPaused: false,
      completed: false
    }

    setState({
      mode: "group",
      typingText: combined,
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
      source: { type: "group", id: group.id },
      segments: segments
    });
  };

  const resetRound = () => {
    progressRef.current = 0;
    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: Date.now(),
      elapsedPaused: 0,
      isPaused: false,
      completed: false,
      finalWpm: undefined
    };

    if (state.source?.type === "text") {
      const text = library.texts.find(t => t.id === state.source?.id);
      if (text) startText(text);
    } else if (state.source?.type === "group") {
      const group = library.groups.find(g => g.id === state.source?.id);
      if (group) startGroup(group);
    } else {
      setState({
        ...defaultState,
        startedAt: Date.now()
      });
    }
  };

  const updateProgress = (index: number, total: number) => {
    progressRef.current = Math.round((index / total) * 100);
  };

  const completeRound = () => {
    setState((prev) => ({
      ...prev,
      progress: 100,
      finishedAt: Date.now(),
    }));
    if (statsRef.current) {
      statsRef.current.completed = true;
      statsRef.current.finalWpm = getCurrentStats()?.wpm;
    }
  };

  const getCurrentTextName = (): string | null => {
    if (state.mode === "text") {
      const text = library.texts.find(t => t.id === state.source?.id);
      return text?.title ?? null;
    }

    if (state.mode === "group" && state.segments) {
      const currentIndex = Math.round(
        (progressRef.current / 100) * state.typingText.length
      );
      const seg = state.segments.find(
        s => currentIndex >= s.start && currentIndex <= s.end
      );
      if (!seg) return null;
      const text = library.texts.find(t => t.id === seg.textId);
      return text?.title ?? null;
    }

    return null;
  };

  const getCurrentStats = () => {
    const { correct, startedAt, elapsedPaused, pausedAt, isPaused, completed, finalWpm } = statsRef.current;

    if (!startedAt) return { wpm: 0 };

    if (completed && finalWpm !== undefined) {
      return { wpm: finalWpm };
    }

    const now = Date.now();
    let totalPaused = elapsedPaused;

    if (isPaused && pausedAt) {
      totalPaused += now - pausedAt;
    }

    const activeMs = Math.max(now - startedAt - totalPaused, 1);
    const elapsedMinutes = activeMs / 1000 / 60;

    const grossWpm = (correct / 5) / elapsedMinutes;
    const wpm = Math.max(0, Math.round(grossWpm));

    return { wpm };
  };


  const pause = () => {
    if (!statsRef.current.isPaused) {
      statsRef.current.isPaused = true;
      statsRef.current.pausedAt = Date.now();
    }
  };

  const resume = () => {
    if (statsRef.current.isPaused) {
      const now = Date.now();
      if (statsRef.current.pausedAt) {
        statsRef.current.elapsedPaused += now - statsRef.current.pausedAt;
      }
      statsRef.current.isPaused = false;
      statsRef.current.pausedAt = undefined;
    }
  };

  return (
    <TypingContext.Provider
      value={{
        state,
        startText,
        startGroup,
        resetRound,
        updateProgress,
        completeRound,
        progressRef,
        getCurrentTextName,
        statsRef,
        getCurrentStats,
        pause,
        resume
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
