"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { dummyText } from "@/Data/dummy";


export default function TypingInterface() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedCharacters, setTypedCharacters] = useState<string[]>([]);
    const characters = dummyText.split("");
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ignore special keys
            if (e.key === "Backspace") {
                if (currentIndex === 0 || typedCharacters.length === 0) return;
                setCurrentIndex(prev => prev-1);
                setTypedCharacters(prev => prev.slice(0, -1));
            }

            if (e.key.length > 1) return;


            const expectedChar = characters[currentIndex];
            const newChar = e.key;

            setTypedCharacters((prev) => [...prev, newChar]);

            if (newChar === expectedChar) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                // handle error styling
                setCurrentIndex((prev) => prev + 1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, characters, typedCharacters.length]);

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
            y: spanRect.top - containerRect.top + 1
        };
    };

    const cursorPosition = getCursorPosition();

    return (
        <div className="font-variant-ligatures-[none] max-w-3xl mx-auto font-mono text-2xl leading-relaxed relative" ref={containerRef}>
            <div className="relative">
                {characters.map((char, index) => {
                    let style = "text-gray-400"; // default untyped

                    if (index < currentIndex) {
                        if (typedCharacters[index] === char) {
                            style = "text-foreground"; // correct
                        } else {
                            style = "text-red-500"; // incorrect with background
                        }
                    }

                    if (index === currentIndex) {
                        style = "text-foreground"; // current character
                    }

                    return (
                        <span
                            key={index}
                            className={`${style} transition-colors duration-150`}
                            ref={(el) => { spanRefs.current[index] = el }}
                        >
                            {char}
                        </span>
                    );
                })}

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