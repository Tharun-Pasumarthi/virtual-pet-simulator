import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, setSystemTheme, isSystemTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button 
        className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      <button
        className={`system-theme-button ${isSystemTheme ? 'active' : ''}`}
        onClick={setSystemTheme}
        aria-label="Use system theme"
      >
        💻
      </button>
    </div>
  );
};

export default ThemeToggle;
