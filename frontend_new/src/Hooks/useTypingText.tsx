import { createContext, useContext } from "react";

type TypingTextContextType = {
  typingText: string;
  setTypingText: (text: string) => void;
  
};

export const TypingTextContext = createContext<TypingTextContextType | undefined>(undefined);

export function useTypingText() {
    const ctx = useContext(TypingTextContext);
    if (!ctx) throw new Error("useTypingText must be used inside TypingTextProvider");
    return ctx;
}