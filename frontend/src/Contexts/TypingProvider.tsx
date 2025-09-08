"use client";
import { useRef, useState, type ReactNode } from "react";
import { dummyText } from "@/Data/dummy";
import type { Text, Group } from "@/Types/Library";
import { normalizeForTyping } from "@/utils/text";
import { TypingContext, type TextSegment, type TypingState } from "@/Hooks/useTyping";
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

  const startText = (text: Text) => {
    progressRef.current = 0;
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
      segments.push({ textId: t.title, start, end });
    });
    progressRef.current = 0;

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
        getCurrentTextName
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
