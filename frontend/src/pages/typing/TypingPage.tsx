import { useEffect, useRef, useState } from "react";
import { useTyping } from "@/Hooks/useTyping";
import { FaFile, FaLayerGroup } from "react-icons/fa6";
import TypingInterface from "@/components/typing/TypingInterface/TypingInterface";
import ProgressBar from "@/components/typing/TypingInterface/ProgressBar";
import { Button } from "@/components/ui/button";
import { IoIosPause } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import { FaPlay } from "react-icons/fa";
import RoundCompleted from "@/components/typing/TypingInterface/RoundCompleted";

export default function TypingPage() {
  const { state, getCurrentStats, resetRound, statsRef, resume, pause } = useTyping();

  const [stats, setStats] = useState({ wpm: 0 });

  const typingContainerRef = useRef<HTMLDivElement>(null);

  const handlePause = () => {
    if (statsRef.current.isPaused) resume();
    else pause();
    typingContainerRef.current?.focus();
  };

  const handleRestart = () => {
    resetRound();
    typingContainerRef.current?.focus();
  };

  useEffect(() => {
    let frame: number;
    const tick = () => {
      setStats(getCurrentStats());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [getCurrentStats]);

  const isCompleted = state.mode !== "idle" && statsRef.current.completed;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mt-10 mb-15">
        {state.mode === "idle" && (
          <span className="text-xl flex items-center text-muted-foreground gap-2">
            <FaFile />
            <span className="font-semibold">Demo Text</span>
          </span>
        )}
        {state.mode === "text" && (
          <span className="text-xl flex items-center text-muted-foreground gap-2">
            <FaFile />
            <span className="font-semibold">{state.source?.name ?? "Demo Text"}</span>
          </span>
        )}
        {state.mode === "group" && (
          <span className="text-xl flex items-center text-muted-foreground gap-2">
            <FaLayerGroup />
            <span className="font-semibold">{state.source?.name ?? "Demo group"}</span>
          </span>
        )}
      </div>

      {isCompleted ? <RoundCompleted wpm={stats.wpm} restartFn={resetRound} /> : <TypingInterface containerRef={typingContainerRef} />}

      <ProgressBar addClass="mt-10" />

      {!isCompleted && (
        <div className="mt-6 flex justify-between text-lg text-muted-foreground">
        <span>WPM: <strong>{stats.wpm}</strong></span>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={handlePause}
          >
            {statsRef.current.isPaused ? <FaPlay /> : <IoIosPause />}
          </Button>
          <Button variant="ghost" onClick={handleRestart}><VscDebugRestart /></Button>
        </div>
      </div>)}
    </div>
  );
}
