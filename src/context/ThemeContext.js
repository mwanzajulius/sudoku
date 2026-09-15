import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'sudoku_theme';

export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#111111',
    secondary: '#444444',
    accent: '#444444',
    text: '#111111',
    subtext: '#666666',
    border: '#DDDDDD',
    given: '#111111',
    user: '#222222',
    error: '#CC0000',
    hint: '#888888',
    selected: '#E8E8E8',
    highlight: '#F4F4F4',
    sameNumber: '#DDDDDD',
    gridLine: '#CCCCCC',
    boxLine: '#333333',
    numpad: '#111111',
    numpadText: '#FFFFFF',
    success: '#222222',
    timerBg: '#F0F0F0',
    diffEasy: '#16A34A',
    diffMedium: '#D97706',
    diffHard: '#DC2626',
    diffExpert: '#7C3AED',
    cardBg: '#F9F9F9',
    shadow: '#000000',
    size4: '#0284C7',
    size6: '#059669',
    size9: '#111111',
  },
  dark: {
    background: '#111111',
    surface: '#1C1C1C',
    primary: '#EEEEEE',
    secondary: '#AAAAAA',
    accent: '#AAAAAA',
    text: '#EEEEEE',
    subtext: '#888888',
    border: '#333333',
    given: '#EEEEEE',
    user: '#CCCCCC',
    error: '#FF4444',
    hint: '#AAAAAA',
    selected: '#2E2E2E',
    highlight: '#222222',
    sameNumber: '#2A2A2A',
    gridLine: '#444444',
    boxLine: '#AAAAAA',
    numpad: '#EEEEEE',
    numpadText: '#111111',
    success: '#EEEEEE',
    timerBg: '#222222',
    diffEasy: '#4ADE80',
    diffMedium: '#FBBF24',
    diffHard: '#F87171',
    diffExpert: '#C084FC',
    cardBg: '#1C1C1C',
    shadow: '#000000',
    size4: '#38BDF8',
    size6: '#34D399',
    size9: '#EEEEEE',
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
