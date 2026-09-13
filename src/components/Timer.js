import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

export default function Timer() {
  const { timer } = useGame();
  const { theme } = useTheme();

  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');

  return (
    <View style={[styles.container, { backgroundColor: theme.timerBg }]}>
      <Text style={[styles.icon]}>⏱</Text>
      <Text style={[styles.time, { color: theme.primary }]}>{mins}:{secs}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
