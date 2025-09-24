import { useRef, useState, type ReactNode } from "react";
import { dummyText } from "@/Data/dummy";
import type { Text, Group } from "@/Types/Library";
import { normalizeForTyping } from "@/utils/text";
import { TypingContext, type StatsRefObject, type Status, type TypingState } from "@/Hooks/useTyping";
import { chunkAndShuffle, generateTypingTextFromGroup, initializeStatuses } from "@/utils/typing";
import { useMode } from "@/Hooks/useMode";
import { DEMO_LIBRARY } from "@/Data/DemoLibraryData";
import { getLastTyped, saveAsLastTyped } from "@/utils/localStorage";
import { useLibrary } from "@/Hooks/useLibrary";

function getRandomDemoText() {
  const texts = DEMO_LIBRARY.texts;
  return texts[Math.floor(Math.random() * texts.length)];
}

export default function TypingProvider({ children }: { children: ReactNode }) {

  const { mode } = useMode();

  const { library } = useLibrary();

  const defaultTypingText =
    mode === "demo"
      ? getRandomDemoText().text
      : dummyText;

  let defaultState: TypingState = {
    mode: "idle",
    typingText: defaultTypingText,
    progress: 0
  };

  const lastTyped = getLastTyped();

  if (lastTyped) {
    const type = lastTyped.type;
    const lastTypedId = lastTyped.id;
    if (type === 'text') {
      const lastTypedText = library.texts.find(txt => txt.id === lastTypedId);
      if (lastTypedText) defaultState = {
        mode: "text",
        typingText: lastTypedText.text,
        progress: 0,
        startedAt: Date.now(),
        finishedAt: undefined,
        source: { type: "text", id: lastTypedText.id, name: lastTypedText.title },
      }
    }

    if (type === 'group') {
      const lastTypedGroup = library?.groups.find(grp => grp.id === lastTypedId);
      if (lastTypedGroup) defaultState = {
        mode: "group",
        typingText: generateTypingTextFromGroup(lastTypedGroup),
        progress: 0,
        startedAt: Date.now(),
        finishedAt: undefined,
        source: { type: "group", id: lastTypedGroup.id, name: lastTypedGroup.name },
      }
    }
  }

  const [state, setState] = useState<TypingState>(defaultState);

  const [isCreatingTypingText, setIsCreatingTypingText] = useState<boolean>(false);

  const progressRef = useRef<number>(0);

  const statsRef = useRef<StatsRefObject>({
    correct: 0,
    incorrect: 0,
    startedAt: 0,
    elapsedPaused: 0,
    isPaused: false,
    completed: false
  });

  const currentIndexRef = useRef<number>(0);

  const statusRef = useRef<Status[]>(initializeStatuses(dummyText));

  function startText(text: Text) {
    let typingText = normalizeForTyping(text.text);
    typingText = chunkAndShuffle(typingText);

    progressRef.current = 0;
    currentIndexRef.current = 0;

    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: 0,
      elapsedPaused: 0,
      isPaused: false,
      completed: false,
      finalWpm: undefined
    };

    statusRef.current = initializeStatuses(typingText);

    setState({
      mode: "text",
      typingText: typingText,
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
      source: { type: "text", id: text.id, name: text.title },
    });

    saveAsLastTyped("text", text);
  };

  const startGroup = (group: Group) => {
    setIsCreatingTypingText(true);

    const typingText = generateTypingTextFromGroup(group);

    progressRef.current = 0;
    currentIndexRef.current = 0;

    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: 0,
      elapsedPaused: 0,
      isPaused: false,
      completed: false,
    };

    statusRef.current = initializeStatuses(typingText);

    setState({
      mode: "group",
      typingText,
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
      source: { type: "group", id: group.id, name: group.name },
    });

    setIsCreatingTypingText(false);
    saveAsLastTyped("group", group);
  };

  const resetRound = () => {
    progressRef.current = 0;
    currentIndexRef.current = 0;

    statsRef.current = {
      correct: 0,
      incorrect: 0,
      startedAt: 0,
      elapsedPaused: 0,
      isPaused: false,
      completed: false,
      finalWpm: undefined
    };

    statusRef.current = initializeStatuses(state.typingText);

    setState(prev => ({
      ...prev,
      progress: 0,
      startedAt: Date.now(),
      finishedAt: undefined,
    }));
  };

  const updateProgress = (index: number, total: number) => {
    const newProgress = Math.round((index / total) * 100);
    progressRef.current = newProgress;

    if (Math.abs(state.progress - newProgress) >= 1) {
      setState(prev => ({ ...prev, progress: newProgress }));
    }
  };

  const completeRound = () => {
    statsRef.current.completed = true;
    statsRef.current.finalWpm = getCurrentStats()?.wpm;

    setState((prev) => ({
      ...prev,
      progress: 100,
      finishedAt: Date.now(),
    }));

    if (state.mode === "idle") {
      setState({
        ...state,
        mode: "text",
        source: { type: "text", id: "dummy", name: "dummy" },
      });
    }
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
        statsRef,
        getCurrentStats,
        pause,
        resume,
        currentIndexRef,
        statusRef,
        isCreatingTypingText
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}