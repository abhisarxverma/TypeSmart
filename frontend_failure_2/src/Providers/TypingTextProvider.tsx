import { dummyText } from "@/Data/dummy";
import { TypingTextContext } from "@/Hooks/useTypingText";
import { useState } from "react";


export default function TypingTextProvider({ children }: {children : React.ReactNode}) {
    const [ typingText, setTypingText ] = useState<string>(dummyText);

    return (
        <TypingTextContext.Provider value={{ typingText, setTypingText }}>
            { children }
        </TypingTextContext.Provider>
    )

}