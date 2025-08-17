"use client";

import React, {
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  memo,
  useState,
} from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
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

type TypingInterfaceProps = {
  // Visual container height; make it taller/shorter as needed
  height?: number;
  // Extra classes for the scroll container and the text content
  className?: string;
  textClassName?: string; // e.g., "font-mono text-heading leading-relaxed"
  // Cursor customization
  cursorColorClass?: string; // e.g., "bg-blue-500"
  // Spring tuning
  cursorStiffness?: number;
  cursorDamping?: number;
  // Overscan rows for virtualization
  overscan?: number;
};

const Char = memo(
  ({
    char,
    status,
    spanRef,
    charWidth,
  }: {
    char: string;
    status: Status;
    spanRef?: (el: HTMLSpanElement | null) => void;
    charWidth: number;
  }) => {
    return (
      <span
        ref={spanRef}
        className={clsx(STATUS_CLASS[status], "transition-colors duration-150")}
        style={{
          display: "inline-block",
          width: `auto`,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  }
);
Char.displayName = "Char";

export default function TypingInterfaceVirtual({
  height = 320,
  className,
  textClassName = "font-mono text-heading leading-relaxed no-scrollbar",
  cursorColorClass = "bg-blue-500",
  cursorStiffness = 300,
  cursorDamping = 30,
  overscan = 6,
}: TypingInterfaceProps) {
  const { typingText } = useTypingText();
  const characters = useMemo(() => typingText.split(""), [typingText]);

  // Mutable state (no re-render on keystrokes)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const currentIndexRef = useRef(0);

  // Store per-char statuses so virtualization can rehydrate classes when rows mount
  const statusesRef = useRef<Status[]>([]);
  useEffect(() => {
    statusesRef.current = Array.from({ length: characters.length }, (_, i) =>
      i === 0 ? "current" : "pending"
    );
    currentIndexRef.current = 0;
  }, [characters.length]);

  // Motion values for the caret
  const left = useMotionValue(0);
  const top = useMotionValue(1);

  // Scroll container + measurement
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measurerRef = useRef<HTMLSpanElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [charWidth, setCharWidth] = useState(1);
  const [lineHeight, setLineHeight] = useState(13);

  // Measure character width & line height and observe container width
  useLayoutEffect(() => {
    const parent = scrollParentRef.current;
    if (!parent) return;

    const measure = () => {
      // Width
      const w = parent.clientWidth;
      setContainerWidth(w);

      // Character width + line height from measurer
      if (measurerRef.current) {
        const rect = measurerRef.current.getBoundingClientRect();
        const computed = window.getComputedStyle(measurerRef.current);
        const lh =
          computed.lineHeight === "normal"
            ? rect.height // fallback
            : parseFloat(computed.lineHeight);

        setCharWidth(Math.max(1, rect.width)); // safe guard
        setLineHeight(Math.max(1, lh));
      }
    };

    measure();

    // Resize observer for container changes (width)
    const ro = new ResizeObserver(() => measure());
    ro.observe(parent);

    // Font load can slightly change metrics
    const fontReady = (document as any).fonts?.ready;
    if (fontReady && typeof fontReady.then === "function") {
      (document as any).fonts.ready.then(measure).catch(() => {});
    }

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Compute columns by container width and monospaced char width
  const cols = useMemo(() => {
    if (charWidth <= 0) return 1;
    // Leave a tiny buffer to avoid last-column clipping
    return Math.max(1, Math.floor(containerWidth / charWidth) - 0);
  }, [containerWidth, charWidth]);

  const rowCount = useMemo(() => {
    if (cols <= 0) return 1;
    return Math.max(1, Math.ceil(characters.length / cols));
  }, [characters.length, cols]);

  // Virtualize rows
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => lineHeight,
    overscan,
  });

  // Helpers
  const indexToRowCol = (i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return { row, col };
  };

  const applyStatus = (index: number, status: Status) => {
    if (index < 0 || index >= characters.length) return;
    statusesRef.current[index] = status;
    const el = spanRefs.current[index];
    if (el) {
      el.className = clsx(STATUS_CLASS[status], "transition-colors duration-150");
    }
  };

  const clampIndex = (i: number) =>
    Math.max(0, Math.min(i, characters.length - 1));

  const moveCursorToIndex = (i: number) => {
    const clamped = clampIndex(i);
    const { row, col } = indexToRowCol(clamped);

    // Ensure row is visible
    rowVirtualizer.scrollToIndex(row);

    // Compute position relative to content (no need for span to be mounted)
    const x = (col * charWidth);
    const y = row * lineHeight + 1;

    animate(left, x, { type: "spring", stiffness: cursorStiffness, damping: cursorDamping });
    animate(top, y, { type: "spring", stiffness: cursorStiffness, damping: cursorDamping });
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

    // Advance caret or stay at end
    if (i + 1 < characters.length) {
      applyStatus(i + 1, "current");
      currentIndexRef.current = i + 1;
    } else {
      currentIndexRef.current = i;
    }

    moveCursorToIndex(currentIndexRef.current);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Backspace") e.preventDefault();
    if (e.key === "Backspace") {
      handleBackspace();
      return;
    }
    if (e.key.length !== 1) return; // ignore non-printables
    handleChar(e.key);
  };

  // Reset cursor when text/metrics are ready
  useEffect(() => {
    if (characters.length > 0 && cols > 0) {
      moveCursorToIndex(0);
      // Scroll to top
      rowVirtualizer.scrollToIndex(0, { align: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters.length, cols, lineHeight]);

  // Clear refs on text change
  useEffect(() => {
    spanRefs.current = [];
  }, [characters.length]);

  // Styles for the focusable layer
  const focusableLayerProps = {
    tabIndex: 0,
    onKeyDown,
    className: "relative outline-none",
  };

  return (
    <div
      className={clsx(
        styles.textBox,
        "mx-auto relative no-scrollbar",
        // className
      )}
      style={{ height, overflow: "auto" }}
      ref={scrollParentRef}
    >
      {/* Hidden measurer to get char width and line height accurately */}
      <span
        ref={measurerRef}
        className={clsx(textClassName, "whitespace-pre invisible absolute pointer-events-none")}
        aria-hidden
      >
        M
      </span>

      <div
        className={clsx(textClassName, styles.textBox, "max-w-3xl")}
        style={{ position: "relative", height: rowVirtualizer.getTotalSize(), textAlign: "justify", textJustify: "inter-word" }}
        ref={contentRef}
        {...focusableLayerProps}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const start = rowIndex * cols;
          const end = Math.min(characters.length, start + cols);
          if (start >= end) return null;

          return (
            <div
              key={virtualRow.key}
              className={clsx(styles.textBox, "absolute left-0 right-0 text-align-[justify] text-justify-[inter-word] font-mono text-heading")}
              style={{
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                height: virtualRow.size,
                lineHeight: `${lineHeight}px`,
              }}
            >
              {/* Render row slice */}
              {characters.slice(start, end).map((char, idx) => {
                const i = start + idx;
                return (
                  <Char
                    key={i}
                    char={char}
                    status={statusesRef.current[i]}
                    charWidth={charWidth}
                    spanRef={(el) => {
                      spanRefs.current[i] = el;
                    }}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Cursor (absolute in content space; uses computed charWidth/lineHeight) */}
        <motion.div
          className={clsx("absolute w-0.5", cursorColorClass)}
          style={{
            left,
            top,
            height: `${lineHeight}px`,
          }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ opacity: { duration: 1, repeat: Infinity, ease: "linear" } }}
        />
      </div>
    </div>
  );
}
