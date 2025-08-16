"use client";
import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { dummyText } from "@/Data/dummy";
import clsx from "clsx";
import styles from "./TypingInterface.module.css";

const Char = memo(({ char, status, spanRef }: {
    char: string;
    status: "pending" | "correct" | "incorrect" | "current";
    spanRef?: (el: HTMLSpanElement | null) => void;
}) => {
    let style = "text-gray-400";
    if (status === "correct") style = "text-green-600";
    if (status === "incorrect") style = "text-red-500 bg-red-100";
    if (status === "current") style = "text-gray-800";

    return (
        <span ref={spanRef} className={`${style} transition-colors duration-150`}>
            {char}
        </span>
    );
});

export default function TypingInterface() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const characters = dummyText.split("");
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const [status, setStatus] = useState<
        ("pending" | "correct" | "incorrect" | "current")[]
    >(() => {
        const initial = Array(characters.length).fill("pending") as (
            | "pending"
            | "correct"
            | "incorrect"
            | "current"
        )[];
        if (initial.length > 0) initial[0] = "current";
        return initial;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                if (currentIndex === 0) return;

                setStatus((prev) => {
                    const updated = [...prev];
                    updated[currentIndex] = "pending"; // clear current
                    updated[currentIndex - 1] = "current"; // go back
                    return updated;
                });

                setCurrentIndex((prev) => prev - 1);
                return;
            }

            if (e.key.length > 1) return; // ignore special keys

            const expectedChar = characters[currentIndex];
            const newChar = e.key;

            setStatus((prev) => {
                const updated = [...prev];
                // mark current as correct/incorrect
                updated[currentIndex] =
                    newChar === expectedChar ? "correct" : "incorrect";
                // move cursor
                if (currentIndex + 1 < characters.length) {
                    updated[currentIndex + 1] = "current";
                }
                return updated;
            });

            setCurrentIndex((prev) => prev + 1);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, characters]);

    // Get cursor position relative to container
    const getCursorPosition = () => {
        const currentSpan = spanRefs.current[currentIndex];
        const container = containerRef.current;

        if (!currentSpan || !container) {
            return { x: 0, y: 1 };
        }

        const containerRect = container.getBoundingClientRect();
        const spanRect = currentSpan.getBoundingClientRect();

        return {
            x: spanRect.left - containerRect.left,
            y: (spanRect.top - containerRect.top) + 1
        };
    };

    const cursorPosition = getCursorPosition();

    return (
        <div className={clsx(styles.textBox, "max-w-3xl mx-auto font-mono text-2xl leading-relaxed relative")} ref={containerRef}>
            <div className="relative mt-3 ">
                {characters.map((char, index) => (
                    <Char
                        key={index}
                        char={char}
                        status={status[index]}
                        spanRef={(el) => { spanRefs.current[index] = el }}
                    />
                ))}


                {/* Cursor */}
                <motion.div
                    className="absolute w-0.5 bg-blue-500"
                    style={{
                        height: "1.1em",
                    }}
                    animate={{
                        left: cursorPosition.x,
                        top: cursorPosition.y,
                        opacity: [1, 0, 1],
                    }}
                    transition={{
                        left: { type: "spring", stiffness: 300, damping: 30 },
                        top: { type: "spring", stiffness: 300, damping: 30 },
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