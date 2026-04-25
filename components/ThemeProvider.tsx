'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme | undefined;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: undefined,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  const [theme, setTheme] = useState<Theme | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return document.documentElement.getAttribute('data-theme') as Theme || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Watch for system theme changes if no preference is stored
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const stored = localStorage.getItem('wealthifyx-theme');
      if (!stored) {
        const next = mediaQuery.matches ? 'dark' : 'light';
        setTheme(next);
        root.setAttribute('data-theme', next);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('wealthifyx-theme', next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
