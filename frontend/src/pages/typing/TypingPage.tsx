import { useEffect, useRef, useState } from "react";
import { useLibrary } from "@/Hooks/useLibrary";
import { useTyping } from "@/Hooks/useTyping";
import { FaFile, FaLayerGroup } from "react-icons/fa6";
import TypingInterface from "@/components/typing/TypingInterface/TypingInterface";
import ProgressBar from "@/components/typing/TypingInterface/ProgressBar";
import { Button } from "@/components/ui/button";
import { IoIosPause } from "react-icons/io";
import { VscDebugRestart } from "react-icons/vsc";
import { FaPlay } from "react-icons/fa";


export default function TypingPage() {
  const { state, getCurrentTextName, getCurrentStats, resetRound, statsRef, resume, pause } = useTyping();
  const { library } = useLibrary();

  const [currentTextName, setCurrentTextName] = useState<string | null>(null);
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

  // Poll for current file name
  useEffect(() => {
    let frame: number;
    const tick = () => {
      setCurrentTextName(getCurrentTextName());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [getCurrentTextName]);

  // Poll for live stats
  useEffect(() => {
    let frame: number;
    const tick = () => {
      setStats(getCurrentStats());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [getCurrentStats]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
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
            <span className="font-semibold">{currentTextName}</span>
          </span>
        )}
        {state.mode === "group" && (
          <>
            <span className="text-xl flex items-center text-muted-foreground gap-2">
              <FaFile />
              <span className="font-semibold">{currentTextName}</span>
            </span>
            <span className="text-xl flex items-center text-muted-foreground gap-2 font-semibold">
              <FaLayerGroup />
              {
                library.groups.find(g => g.id === state.source?.id)?.name
              }
            </span>
          </>
        )}
      </div>

      {/* Typing area */}
      <TypingInterface containerRef={typingContainerRef} />

      {/* Progress bar */}
      <ProgressBar addClass="mt-10" />

      {/* Stats */}
      <div className="mt-6 flex justify-between text-lg text-muted-foreground">
        <span>WPM: <strong>{stats.wpm}</strong></span>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              if (statsRef.current.isPaused) {
                  handleRestart()
              } else {
                  handlePause()
              }
            }}
          >
            {statsRef.current.isPaused ? <FaPlay /> : <IoIosPause />}
          </Button>
          <Button variant="ghost" onClick={resetRound}><VscDebugRestart /></Button>
        </div>
      </div>
    </div>
  );
}
