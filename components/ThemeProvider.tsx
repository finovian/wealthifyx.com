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
    // We no longer watch for system theme changes to keep 'light' as default
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
