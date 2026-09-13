import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'sudoku_theme';

export const colors = {
  light: {
    background: '#F0F4FF',
    surface: '#FFFFFF',
    primary: '#6C63FF',
    secondary: '#FF6584',
    accent: '#43C6AC',
    text: '#1A1A2E',
    subtext: '#6B7280',
    border: '#E5E7EB',
    given: '#1A1A2E',
    user: '#6C63FF',
    error: '#EF4444',
    hint: '#F59E0B',
    selected: '#EDE9FE',
    highlight: '#F3F0FF',
    sameNumber: '#DDD6FE',
    gridLine: '#C4B5FD',
    boxLine: '#6C63FF',
    numpad: '#6C63FF',
    numpadText: '#FFFFFF',
    success: '#10B981',
    timerBg: '#EDE9FE',
    diffEasy: '#10B981',
    diffMedium: '#F59E0B',
    diffHard: '#EF4444',
    diffExpert: '#8B5CF6',
    cardBg: '#FFFFFF',
    shadow: '#6C63FF',
  },
  dark: {
    background: '#0F0E17',
    surface: '#1E1B2E',
    primary: '#A78BFA',
    secondary: '#F472B6',
    accent: '#34D399',
    text: '#F9FAFB',
    subtext: '#9CA3AF',
    border: '#374151',
    given: '#F9FAFB',
    user: '#A78BFA',
    error: '#F87171',
    hint: '#FCD34D',
    selected: '#2D2B4E',
    highlight: '#1E1B2E',
    sameNumber: '#312E5A',
    gridLine: '#4C1D95',
    boxLine: '#7C3AED',
    numpad: '#A78BFA',
    numpadText: '#0F0E17',
    success: '#34D399',
    timerBg: '#2D2B4E',
    diffEasy: '#34D399',
    diffMedium: '#FCD34D',
    diffHard: '#F87171',
    diffExpert: '#C084FC',
    cardBg: '#1E1B2E',
    shadow: '#000000',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(val => {
      if (val !== null) setIsDark(val === 'dark');
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  const theme = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
