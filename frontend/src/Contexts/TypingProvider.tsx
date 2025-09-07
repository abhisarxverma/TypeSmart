"use client";
import { useState, type ReactNode } from "react";
import { dummyText } from "@/Data/dummy";
import type { Text, Group } from "@/Types/Library";
import { normalizeForTyping } from "@/utils/text";
import { TypingContext, type TypingState } from "@/Hooks/useTyping";

const defaultState: TypingState = {
  mode: "idle",
  typingText: dummyText,
  progress: 0,
};

export default function TypingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TypingState>(defaultState);

  const startText = (text: Text) => {
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
    const combined = group.group_texts
      .map((t) => normalizeForTyping(t.text))
      .join("\n\n");

    setState({
      mode: "group",
      typingText: combined,
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
      source: { type: "group", id: group.id },
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
    setState((prev) => ({
      ...prev,
      progress: Math.round((index / total) * 100),
    }));
  };

  const completeRound = () => {
    setState((prev) => ({
      ...prev,
      progress: 100,
      finishedAt: Date.now(),
    }));
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
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}
