import { ThemeProviderContext, type Theme } from "@/Hooks/useTheme"
import { useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export default function ThemeProvider({
  children,
  defaultTheme = "default-dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("default-dark", "obsidian-dark", "solar-night", "forest-night", "nordic-dark", "dracula-dark")
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      const root = window.document.documentElement
      root.classList.remove("default-dark", "obsidian-dark", "solar-night", "forest-night", "nordic-dark", "dracula-dark")
      root.classList.add(newTheme)
      setTheme(newTheme)
    },
  }


  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}