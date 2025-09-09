"use client";
import { useRef, useState, type ReactNode } from "react";
import { dummyText } from "@/Data/dummy";
import type { Text, Group } from "@/Types/Library";
import { normalizeForTyping } from "@/utils/text";
import { TypingContext, type StatsRefObject, type TextSegment, type TypingState } from "@/Hooks/useTyping";
import { useLibrary } from "@/Hooks/useLibrary";


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
  });


  const startText = (text: Text) => {
    progressRef.current = 0;
    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: Date.now()
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
    const segments: TextSegment[] = [];
    let combined = "";


    group.group_texts.forEach((t) => {
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
      startedAt: Date.now()
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

  // const resetRound = () => {
  //   if (state.source?.type === "text") {
  //     // restart text
  //     startText(library.texts.find(txt => txt.id===(state?.source?.id)) as Text);
  //   } else if (state.source?.type === "group") {
  //     // restart group — in real app we’d reload from library, here we reuse text
  //     startGroup({ id: state.source.id, texts: [{ id: "dummy", content: state.typingText }] } as Group);
  //   } else {
  //     setState(defaultState);
  //   }
  // };

  function resetRound() {
    return;
  }

  const updateProgress = (index: number, total: number) => {
    progressRef.current = Math.round((index / total) * 100);
  };

  const completeRound = () => {
    setState((prev) => ({
      ...prev,
      progress: 100,
      finishedAt: Date.now(),
    }));
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
    const { correct, incorrect, startedAt } = statsRef.current;

    if (!startedAt) {
      return { wpm: 0, accuracy: 100, elapsed: 0 };
    }

    const now = Date.now();
    const elapsedMs = Math.max(now - startedAt, 1); // avoid divide by zero
    const elapsedMinutes = elapsedMs / 1000 / 60;

    // WPM = (correct chars / 5) / minutes
    const grossWpm = (correct / 5) / elapsedMinutes;
    const wpm = Math.max(0, Math.round(grossWpm));

    // Accuracy = correct / total typed
    const totalTyped = correct + incorrect;
    const accuracy = totalTyped > 0
      ? Math.min(100, Math.max(0, Math.round((correct / totalTyped) * 100)))
      : 100;

    return {
      wpm,
      accuracy,
      elapsed: Math.floor(elapsedMs / 1000), // seconds
    };
  };



  console.log("TYPING TEXT : ", state.typingText);

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
        getCurrentStats
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
