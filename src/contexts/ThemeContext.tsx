import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  actualTheme: 'light' | 'dark'
  accentColor: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [accentColor, setAccentColor] = useState('#8b5cf6')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const savedAccent = localStorage.getItem('accentColor')
    
    if (savedTheme) setTheme(savedTheme)
    if (savedAccent) setAccentColor(savedAccent)
  }, [])

  useEffect(() => {
    // Determine actual theme
    let resolvedTheme: 'light' | 'dark' = 'light'
    
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolvedTheme = theme
    }
    
    setActualTheme(resolvedTheme)
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    localStorage.setItem('accentColor', accentColor)
  }, [theme, accentColor])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        const newTheme = mediaQuery.matches ? 'dark' : 'light'
        setActualTheme(newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const value: ThemeContextType = {
    theme,
    actualTheme,
    accentColor,
    setTheme,
    setAccentColor
  }

  return (
    <ThemeContext.Provider value={value}>
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