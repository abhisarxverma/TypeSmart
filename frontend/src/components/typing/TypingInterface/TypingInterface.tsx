import { useRef, memo, useEffect, useState, useLayoutEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import clsx from "clsx";
import { useTyping } from "../../../Hooks/useTyping"
import toast from "react-hot-toast";

type Status = "pending" | "correct" | "incorrect" | "current";

const STATUS_CLASS: Record<Status, string> = {
  pending: "text-gray-400",
  correct: "text-foreground",
  incorrect: "text-gray-500",
  current: "text-primary"
};

export type WindowConfig = {
  lines: number;      // how many lines visible at once
  overscan: number;   // extra lines above/below
  edgePadding: number; // when caret is this many lines from top/bottom, shift
};

// Default: 3 lines window
const WINDOW: WindowConfig = {
  lines: 3,
  overscan: 1,
  edgePadding: 1,
};

const Char = memo(
  ({
    char,
    status,
    spanRef,
    index,
  }: {
    char: string;
    status: Status;
    spanRef?: (el: HTMLSpanElement | null) => void;
    index: number;
  }) => {
    return (
      <span
        ref={spanRef}
        data-index={index}
        className={clsx(`${STATUS_CLASS[status]} transition-colors duration-150`)}
      >
        {char}
      </span>
    );
  }
);

type LineInfo = { start: number; end: number; top: number };

export default function TypingInterface({ containerRef }: { containerRef?: React.RefObject<HTMLDivElement | null> }) {
  const { state, updateProgress, statsRef, resume, completeRound, currentIndexRef, statusRef, pause } = useTyping();
  const typingText = state.typingText;
  const characters = typingText.split("");

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const left = useMotionValue(0);
  const top = useMotionValue(1);

  const [windowStartLine, setWindowStartLine] = useState(0);
  const [lineMap, setLineMap] = useState<LineInfo[]>([]);

  // Remove the infinite loop useEffect - it's not needed!

  const applyStatus = (index: number, status: Status) => {
    statusRef.current[index] = status;
    const el = spanRefs.current[index];
    if (!el) return;
    el.className = `${STATUS_CLASS[status]} transition-colors duration-150`;
    if (status === "correct") statsRef.current.correct++;
    else statsRef.current.incorrect++;
  };

  const clampIndex = (i: number) =>
    Math.max(0, Math.min(i, characters.length - 1));

  const moveCursorToIndex = (i: number) => {
    const container = containerRef?.current;
    const span = spanRefs.current[clampIndex(i)];
    if (!container || !span) return;

    const containerRect = container.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const x = spanRect.left - containerRect.left;
    const y = spanRect.top - containerRect.top + 1;

    animate(left, x, { type: "spring", stiffness: 300, damping: 30 });
    animate(top, y, { type: "spring", stiffness: 300, damping: 30 });
  };

  const rebuildLineMap = () => {
    const lines: LineInfo[] = [];
    let currentLine: LineInfo | null = null;

    spanRefs.current.forEach((el, i) => {
      if (!el) return;
      const top = el.getBoundingClientRect().top;

      if (!currentLine || currentLine.top !== top) {
        if (currentLine) lines.push(currentLine);
        currentLine = { start: i, end: i, top };
      } else {
        currentLine.end = i;
      }
    });
    if (currentLine) lines.push(currentLine);
    setLineMap(lines);
  };

  const getLineOfIndex = (i: number) => {
    for (let line = 0; line < lineMap.length; line++) {
      const { start, end } = lineMap[line];
      if (i >= start && i <= end) return line;
    }
    return 0;
  };

  const updateWindowForIndex = (i: number) => {
    const caretLine = getLineOfIndex(i);
    const { lines, edgePadding } = WINDOW;

    if (caretLine < windowStartLine + edgePadding) {
      setWindowStartLine(Math.max(0, caretLine - edgePadding));
    } else if (caretLine >= windowStartLine + lines - edgePadding) {
      setWindowStartLine(
        Math.min(Math.max(0, (lineMap.length - lines)), caretLine - lines + edgePadding + 1)
      );
    }
  };

  const handleBackspace = () => {
    const i = currentIndexRef.current;
    if (i === 0) return;

    applyStatus(i, "pending");
    applyStatus(i - 1, "current");

    currentIndexRef.current = i - 1;
    updateWindowForIndex(currentIndexRef.current);
    moveCursorToIndex(currentIndexRef.current);
    updateProgress(currentIndexRef.current, spanRefs.current.length);
  };

  const handleChar = (key: string) => {
    const i = currentIndexRef.current;
    if (i >= characters.length) return;

    const expected = characters[i];
    const isCorrect = key === expected;

    applyStatus(i, isCorrect ? "correct" : "incorrect");

    if (i + 1 < characters.length) {
      applyStatus(i + 1, "current");
      currentIndexRef.current = i + 1;
    } else {
      toast.success("Completed")
      currentIndexRef.current = i;
      updateProgress(characters.length, characters.length);
      completeRound()
    }

    updateWindowForIndex(currentIndexRef.current);
    moveCursorToIndex(currentIndexRef.current);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!statsRef.current.startedAt) {
      statsRef.current.startedAt = Date.now();
    }
    if (e.key === " " || e.key === "Backspace") e.preventDefault();

    if (e.key === "Backspace") {
      handleBackspace();
      return;
    }

    if (e.key.length !== 1) return;

    handleChar(e.key);
    updateProgress(currentIndexRef.current, spanRefs.current.length);
    if (statsRef.current.isPaused) resume();
  };

  useEffect(() => {
    if (statusRef.current.length !== characters.length || statusRef.current.length === 0) {
      statusRef.current = Array(characters.length).fill("pending");

      if (characters.length > 0) {
        const currentIndex = currentIndexRef.current;
        if (currentIndex < characters.length) {
          statusRef.current[currentIndex] = "current";
        } else if (currentIndex === 0) {
          statusRef.current[0] = "current";
        }
      }

      setWindowStartLine(0);
    }
  }, [typingText]);

  // Rebuild line map after layout
  useLayoutEffect(() => {
    rebuildLineMap();
  }, [characters.length, typingText]);

  useLayoutEffect(() => {
    updateWindowForIndex(currentIndexRef.current);
    moveCursorToIndex(currentIndexRef.current);
  }, [windowStartLine, characters.length, lineMap]);

  useEffect(() => {
    const isNewRound = state.startedAt && (
      state.progress === 0 &&
      currentIndexRef.current === 0 &&
      !statsRef.current.completed
    );

    if (isNewRound) {
      currentIndexRef.current = 0;
      statusRef.current = Array(characters.length).fill("pending");
      if (characters.length > 0) {
        statusRef.current[0] = "current";
      }
      setWindowStartLine(0);

      requestAnimationFrame(() => {
        moveCursorToIndex(0);
      });
    } else {
      requestAnimationFrame(() => {
        moveCursorToIndex(currentIndexRef.current);
      });
    }
  }, [typingText]);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.focus();
    }
  }, [typingText]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      statusRef.current.forEach((status, index) => {
        const el = spanRefs.current[index];
        if (el && status) {
          el.className = `${STATUS_CLASS[status]} transition-colors duration-150`;
        }
      });

      moveCursorToIndex(currentIndexRef.current);
    });
  }, [characters.length, lineMap]);

  useEffect(() => {
    const statsRefCopy = statsRef.current
    return () => {
      if (!statsRefCopy.isPaused && !statsRefCopy.completed) {
        pause();
      }
    };
  }, []);


  const { lines, overscan } = WINDOW;
  const startLine = Math.max(0, windowStartLine - overscan);
  const endLine = Math.min(lineMap.length - 1, windowStartLine + lines + overscan - 1);

  const startIndex = lineMap[startLine]?.start ?? 0;
  const endIndex = lineMap[endLine]?.end ?? characters.length - 1;

  return (
    <div
      ref={containerRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className={clsx(
        "text-heading font-semibold [word-spacing:10px] leading-relaxed relative [text-align:justify] [text-justify:center] focus:outline-none focus:border-none"
      )}
    >
      <div
        className="relative mt-3 outline-none"
        tabIndex={0}
        autoFocus
        onKeyDown={onKeyDown}
      >
        {characters.slice(startIndex, endIndex + 1).map((char, localIndex) => {
          const globalIndex = startIndex + localIndex;
          return (
            <Char
              key={globalIndex}
              char={char}
              status={
                statusRef.current[globalIndex] ??
                (globalIndex === 0 ? "current" : "pending")
              }
              index={globalIndex}
              spanRef={(el) => {
                spanRefs.current[globalIndex] = el;
              }}
            />
          );
        })}

        <motion.div
          className="absolute w-0.5 bg-primary"
          style={{ left, top, height: "2rem" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            opacity: { duration: 1, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>
    </div>
  );
}