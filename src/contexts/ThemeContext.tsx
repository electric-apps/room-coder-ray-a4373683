import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface FontTheme {
  id: string
  name: string
  headingFont: string
  bodyFont: string
  description: string
}

export const FONT_THEMES: FontTheme[] = [
  {
    id: 'inter',
    name: 'Inter',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    description: 'Clean & modern',
  },
  {
    id: 'source',
    name: 'Source Serif',
    headingFont: '"Source Serif 4", serif',
    bodyFont: '"Source Sans 3", sans-serif',
    description: 'Elegant editorial',
  },
  {
    id: 'alegreya',
    name: 'Alegreya',
    headingFont: 'Alegreya, serif',
    bodyFont: '"Alegreya Sans", sans-serif',
    description: 'Literary & warm',
  },
  {
    id: 'playfair',
    name: 'Playfair + Lato',
    headingFont: '"Playfair Display", serif',
    bodyFont: 'Lato, sans-serif',
    description: 'Classic craft',
  },
  {
    id: 'fraunces',
    name: 'Fraunces + Figtree',
    headingFont: 'Fraunces, serif',
    bodyFont: 'Figtree, sans-serif',
    description: 'Modern wonky',
  },
]

interface ThemeContextValue {
  currentTheme: FontTheme
  setTheme: (themeId: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const FONT_STORAGE_KEY = 'font-theme'
const DARK_STORAGE_KEY = 'dark-mode'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<FontTheme>(FONT_THEMES[0])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedFont = localStorage.getItem(FONT_STORAGE_KEY)
    if (savedFont) {
      const theme = FONT_THEMES.find((t) => t.id === savedFont)
      if (theme) setCurrentTheme(theme)
    }

    if (localStorage.getItem(DARK_STORAGE_KEY) === 'true') setDarkMode(true)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--heading-font', currentTheme.headingFont)
    document.documentElement.style.setProperty('--body-font', currentTheme.bodyFont)
  }, [currentTheme])

  const setTheme = (themeId: string) => {
    const theme = FONT_THEMES.find((t) => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem(FONT_STORAGE_KEY, themeId)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem(DARK_STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
