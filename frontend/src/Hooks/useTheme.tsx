import { createContext, useContext } from "react"

export type Theme = "obsidian-dark" | "solar-night" | "forest-night" | "nordic-dark" | "dracula-dark" | "default-dark";

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "default-dark",
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
 
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
 
  return context
}