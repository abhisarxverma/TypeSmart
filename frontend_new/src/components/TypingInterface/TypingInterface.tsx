// app/components/TypingInterface.tsx
"use client";
import { useRef, memo, useEffect, useState, useLayoutEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import clsx from "clsx";
import { useTypingText } from "@/Hooks/useTypingText"
import styles from "./TypingInterface.module.css";
import toast from "react-hot-toast";

type Status = "pending" | "correct" | "incorrect" | "current";

const STATUS_CLASS: Record<Status, string> = {
  pending: "text-gray-400",
  correct: clsx("text-foreground", styles.typed),
  incorrect: clsx("text-red-500", styles.typed),
  current: "text-orange-200",
};

export type WindowConfig = {
  lines: number;      // how many lines visible at once
  overscan: number;   // extra lines above/below
  edgePadding: number; // when caret is this many lines from top/bottom, shift
};

// Default: 3 lines window
const WINDOW: WindowConfig = {
  lines: 5,
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
    const style = STATUS_CLASS[status];
    return (
      <span
        ref={spanRef}
        data-index={index}
        className={clsx(`${style} transition-colors duration-150`)}
      >
        {char}
      </span>
    );
  }
);

type LineInfo = { start: number; end: number; top: number };

export default function TypingInterface() {
  const { typingText, statsRef } = useTypingText();
  const characters = typingText.split("");

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const statusRef = useRef<Status[]>([]);

  const left = useMotionValue(0);
  const top = useMotionValue(1);

  // window is tracked in line numbers
  const [windowStartLine, setWindowStartLine] = useState(0);
  const [lineMap, setLineMap] = useState<LineInfo[]>([]);

  const applyStatus = (index: number, status: Status) => {
    statusRef.current[index] = status;
    const el = spanRefs.current[index];
    if (!el) return;
    el.className = `${STATUS_CLASS[status]} transition-colors duration-150 ${styles.character}`;

  };

  const clampIndex = (i: number) =>
    Math.max(0, Math.min(i, characters.length - 1));

  const moveCursorToIndex = (i: number) => {
    const container = containerRef.current;
    const span = spanRefs.current[clampIndex(i)];
    if (!container || !span) return;

    const containerRect = container.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const x = spanRect.left - containerRect.left;
    const y = spanRect.top - containerRect.top + 1;

    animate(left, x, { type: "spring", stiffness: 300, damping: 30 });
    animate(top, y, { type: "spring", stiffness: 300, damping: 30 });
  };

  // --- NEW: rebuild line map when spans layout changes ---
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
  };

  const handleChar = (key: string) => {
    const i = currentIndexRef.current;
    if (i >= characters.length) return;

    const expected = characters[i];
    const isCorrect = key === expected;

    if (isCorrect) {
      statsRef.current.correct++;
    } else {
      statsRef.current.incorrect++;
    }

    applyStatus(i, isCorrect ? "correct" : "incorrect");

    if (i + 1 < characters.length) {
      applyStatus(i + 1, "current");
      currentIndexRef.current = i + 1;
    } else {
      currentIndexRef.current = i;
      toast.success("Completed typing")
    }

    updateWindowForIndex(currentIndexRef.current);
    moveCursorToIndex(currentIndexRef.current);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Backspace") e.preventDefault();

    if (e.key === "Backspace") {
      handleBackspace();
      return;
    }

    if (e.key.length !== 1) return;

    handleChar(e.key);
  };

  useEffect(() => {
    statusRef.current = Array(characters.length).fill("pending");
    if (characters.length > 0) statusRef.current[0] = "current";
    setWindowStartLine(0);
  }, [typingText]);

  // rebuild line map after layout
  useLayoutEffect(() => {
    rebuildLineMap();
  }, [characters.length, typingText]);

  useLayoutEffect(() => {
    moveCursorToIndex(currentIndexRef.current);
  }, [windowStartLine, characters.length]);

  // --- Visible slice calculation (by line) ---
  const { lines, overscan } = WINDOW;
  const startLine = Math.max(0, windowStartLine - overscan);
  const endLine = Math.min(lineMap.length - 1, windowStartLine + lines + overscan - 1);

  const startIndex = lineMap[startLine]?.start ?? 0;
  const endIndex = lineMap[endLine]?.end ?? characters.length - 1;

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.textBox,
        "max-w-3xl mx-auto font-mono text-heading leading-relaxed relative"
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
          className="absolute w-0.5 bg-blue-500"
          style={{ left, top, height: "var(--fs-h2)" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            opacity: { duration: 1, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>
    </div>
  );
}
