"use client";
import { useRef, memo, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import clsx from "clsx";
import styles from "./TypingInterface.module.css";
import { useTypingText } from "@/Hooks/useTypingText";

type Status = "pending" | "correct" | "incorrect" | "current";

const STATUS_CLASS: Record<Status, string> = {
  pending: "text-gray-400",
  correct: "text-blue-600",
  incorrect: "text-red-500 bg-red-100",
  current: "text-gray-800",
};

const Char = memo(
  ({
    char,
    status,
    spanRef,
  }: {
    char: string;
    status: Status;
    spanRef?: (el: HTMLSpanElement | null) => void;
  }) => {
    const style = STATUS_CLASS[status];
    return (
      <span
        ref={spanRef}
        className={`${style} transition-colors duration-150`}
      >
        {char}
      </span>
    );
  }
);

export default function TypingInterface() {

  const { typingText } = useTypingText();

  console.log("TYPING TEXT : ", typingText);

  const characters = typingText.split("");

  // Refs for DOM and mutable state (no React re-renders on keystrokes)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);

  // Motion values for the cursor (imperative spring updates)
  const left = useMotionValue(0);
  const top = useMotionValue(1);

  // Helpers
  const applyStatus = (index: number, status: Status) => {
    const el = spanRefs.current[index];
    if (!el) return;
    el.className = `${STATUS_CLASS[status]} transition-colors duration-150`;
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

    // Smooth spring animations without triggering React re-renders
    animate(left, x, { type: "spring", stiffness: 300, damping: 30 });
    animate(top, y, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleBackspace = () => {
    const i = currentIndexRef.current;
    if (i === 0) return;

    // Clear current and move caret back
    applyStatus(i, "pending");
    applyStatus(i - 1, "current");

    currentIndexRef.current = i - 1;
    moveCursorToIndex(currentIndexRef.current);
  };

  const handleChar = (key: string) => {
    const i = currentIndexRef.current;
    if (i >= characters.length) return;

    const expected = characters[i];
    const isCorrect = key === expected;

    // Mark current as correct/incorrect
    applyStatus(i, isCorrect ? "correct" : "incorrect");

    // Advance caret if not at end
    if (i + 1 < characters.length) {
      applyStatus(i + 1, "current");
      currentIndexRef.current = i + 1;
    } else {
      // Stay at end (optional: keep cursor after last char)
      currentIndexRef.current = i; 
    }

    moveCursorToIndex(currentIndexRef.current);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent default to avoid space/page scroll and other side effects
    if (e.key === " " || e.key === "Backspace") e.preventDefault();

    if (e.key === "Backspace") {
      handleBackspace();
      return;
    }

    // Ignore non-printable keys
    if (e.key.length !== 1) return;

    handleChar(e.key);
  };

  useEffect(() => {
    if (characters.length > 0) moveCursorToIndex(0);
  })

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
        {characters.map((char, index) => (
          <Char
            key={index}
            char={char}
            status={index === 0 ? "current" : "pending"} // initial only; updates are DOM-only
            spanRef={(el) => {
              spanRefs.current[index] = el;
            }}
          />
        ))}

        {/* Cursor (driven by motion values, no re-render on keypress) */}
        <motion.div
          className="absolute w-0.5 bg-blue-500"
          style={{
            left,
            top,
            height: "1.1em",
          }}
          animate={{
            opacity: [1, 0, 1],
          }}
          transition={{
            opacity: {
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      </div>
    </div>
  );
}
