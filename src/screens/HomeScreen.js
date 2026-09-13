import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Switch, Dimensions, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

const DIFFICULTIES = [
  { key: 'easy', label: '😊 Easy', desc: '46 clues' },
  { key: 'medium', label: '🤔 Medium', desc: '36 clues' },
  { key: 'hard', label: '😤 Hard', desc: '28 clues' },
  { key: 'expert', label: '🔥 Expert', desc: '22 clues' },
];

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { startNewGame, loadSavedGame } = useGame();
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    checkSave();
  }, []);

  const checkSave = async () => {
    const result = await loadSavedGame();
    setHasSave(result);
  };

  const handleStart = (diff) => {
    startNewGame(diff);
    navigation.navigate('Game');
  };

  const handleResume = () => {
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.primary }]}>🧩 Sudoku</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>Kids Edition</Text>
        </View>
        <View style={styles.themeRow}>
          <Text style={{ fontSize: 18 }}>{isDark ? '🌙' : '☀️'}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#DDD6FE', true: '#7C3AED' }}
            thumbColor={isDark ? '#A78BFA' : '#6C63FF'}
          />
        </View>
      </View>

      {/* Resume banner */}
      {hasSave && (
        <TouchableOpacity
          style={[styles.resumeBtn, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}
          onPress={handleResume}
        >
          <Text style={[styles.resumeText, { color: theme.accent }]}>▶️  Resume Last Game</Text>
        </TouchableOpacity>
      )}

      {/* Difficulty cards */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Start New Game</Text>
      <View style={styles.grid}>
        {DIFFICULTIES.map(d => (
          <TouchableOpacity
            key={d.key}
            style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme[`diff${capitalize(d.key)}`] }]}
            onPress={() => handleStart(d.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.cardLabel, { color: theme[`diff${capitalize(d.key)}`] }]}>{d.label}</Text>
            <Text style={[styles.cardDesc, { color: theme.subtext }]}>{d.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer links */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('HowToPlay')}>
          <Text style={[styles.link, { color: theme.primary }]}>📖 How to Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
          <Text style={[styles.link, { color: theme.subtext }]}>🔒 Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  title: { fontSize: 36, fontWeight: '800' },
  subtitle: { fontSize: 14, fontWeight: '500', marginTop: -4 },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resumeBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  resumeText: { fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 52) / 2,
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLabel: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 13 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  link: { fontSize: 14, fontWeight: '500' },
});
