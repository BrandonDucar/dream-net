import React, { createContext, useContext, useState, useEffect } from 'react';

interface DreamNetThemeContextType {
  dreamNetMode: boolean;
  toggleDreamNetMode: () => void;
}

const DreamNetThemeContext = createContext<DreamNetThemeContextType | undefined>(undefined);

export function DreamNetThemeProvider({ children }: { children: React.ReactNode }) {
  const [dreamNetMode, setDreamNetMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dreamnet-mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dreamnet-mode', dreamNetMode.toString());
      const root = document.documentElement;
      if (dreamNetMode) {
        root.classList.add('dreamnet-mode');
      } else {
        root.classList.remove('dreamnet-mode');
      }
    }
  }, [dreamNetMode]);

  const toggleDreamNetMode = () => {
    setDreamNetMode(prev => !prev);
  };

  return (
    <DreamNetThemeContext.Provider value={{ dreamNetMode, toggleDreamNetMode }}>
      {children}
    </DreamNetThemeContext.Provider>
  );
}

export function useDreamNetTheme() {
  const context = useContext(DreamNetThemeContext);
  if (context === undefined) {
    throw new Error('useDreamNetTheme must be used within a DreamNetThemeProvider');
  }
  return context;
}

