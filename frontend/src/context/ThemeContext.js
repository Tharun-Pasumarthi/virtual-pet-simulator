import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState(null);

  // Check system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => setSystemPreference(e.matches ? 'dark' : 'light');
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPreference || 'light');
    }
  }, [systemPreference]);

  // Update document theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setSystemTheme = () => {
    localStorage.removeItem('theme');
    setTheme(systemPreference);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setSystemTheme,
      isSystemTheme: !localStorage.getItem('theme')
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
