import { ModeContext, type AppMode } from "@/Hooks/useMode";

export default function ModeProvider({ mode, children }: { mode: string, children: React.ReactNode }) {
    return (
        <ModeContext.Provider value={{ mode: mode as AppMode }}>
            {children}
        </ModeContext.Provider>
    )
}