// src/hooks/useWindowedTyping.ts
import { useEffect, useMemo, useRef, useState } from "react";

export type Status = "pending" | "correct" | "incorrect" | "current";

export const STATUS_CLASS: Record<Status, string> = {
  pending: "text-gray-400",
  correct: "text-blue-600",
  incorrect: "text-red-500 bg-red-100",
  current: "text-gray-800",
};

/**
 * useWindowedTyping
 * - Keeps a sliding window of the text to render (virtually)
 * - Exposes imperative refs (spanRefs/containerRef) for direct DOM updates
 * - Maintains caret index and a typed bitset in refs to avoid re-renders
 */
export default function useWindowedTyping(
  text: string,
  opts?: { windowSize?: number; guard?: number }
) {
  const chars = useMemo(() => Array.from(text || ""), [text]);
  const total = chars.length;

  const windowSize = opts?.windowSize ?? 1200;
  const guard = opts?.guard ?? Math.max(64, Math.floor(windowSize / 3));

  const [start, setStart] = useState(0);
  const end = Math.min(start + windowSize, total);

  // refs: caret index (global), typed bitset (0=pending,1=correct,2=incorrect)
  const caretIndexRef = useRef<number>(0);
  const typedRef = useRef<Uint8Array>(new Uint8Array(total));

  // DOM refs for visible slice (local indices 0..windowSize-1)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // reset when text changes
  useEffect(() => {
    caretIndexRef.current = 0;
    typedRef.current = new Uint8Array(total);
    setStart(0);
    spanRefs.current = [];
  }, [text, total]);

  const visibleChars = useMemo(() => chars.slice(start, end), [chars, start, end]);

  // helpers
  const inWindow = (globalIndex: number) => globalIndex >= start && globalIndex < end;
  const toLocal = (globalIndex: number) => globalIndex - start;

  function applyStatus(globalIndex: number, status: Status) {
    if (!inWindow(globalIndex)) return;
    const local = toLocal(globalIndex);
    const el = spanRefs.current[local];
    if (!el) return;
    // Imperatively update class to avoid component re-render
    el.className = `${STATUS_CLASS[status]} transition-colors duration-100`;
  }

  function maybeShiftWindow(globalIndex: number) {
    if (total <= windowSize) return; // no need to shift

    // When caret approaches the right edge
    if (globalIndex >= end - guard && end < total) {
      const newStart = Math.min(
        Math.max(0, globalIndex - Math.floor(guard * 0.6)),
        Math.max(0, total - windowSize)
      );
      setStart(newStart);
      return;
    }

    // When caret approaches the left edge
    if (globalIndex < start + guard && start > 0) {
      const newStart = Math.max(0, globalIndex - Math.floor(guard * 0.6));
      setStart(newStart);
    }
  }

  function reset() {
    caretIndexRef.current = 0;
    typedRef.current = new Uint8Array(total);
    setStart(0);
    spanRefs.current = [];
  }

  return {
    visibleChars,
    start,
    end,
    windowSize,
    containerRef,
    spanRefs,
    caretIndexRef,
    typedRef,
    applyStatus,
    maybeShiftWindow,
    reset,
    setStart,
  } as const;
}
