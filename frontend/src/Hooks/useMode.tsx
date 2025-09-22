import { createContext, useContext } from "react";

export type AppMode = "demo" | "main";

export const ModeContext = createContext<{ mode: AppMode }>({ mode: "demo" });

export function useMode() {
    const ctx = useContext(ModeContext);
    return ctx
}


