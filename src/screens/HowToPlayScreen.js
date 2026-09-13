import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const RULES = [
  { icon: '🔢', title: 'Fill the Grid', desc: 'Fill every empty cell with a number from 1 to 9.' },
  { icon: '↔️', title: 'Rows', desc: 'Each row must contain all numbers 1–9 with no repeats.' },
  { icon: '↕️', title: 'Columns', desc: 'Each column must contain all numbers 1–9 with no repeats.' },
  { icon: '🟦', title: 'Boxes', desc: 'Each 3×3 box must contain all numbers 1–9 with no repeats.' },
  { icon: '💡', title: 'Hints', desc: 'Tap the Hint button to reveal a correct number. You get 3 hints per game.' },
  { icon: '↩️', title: 'Undo / Redo', desc: 'Made a mistake? Use Undo to go back or Redo to go forward.' },
  { icon: '✏️', title: 'Notes Mode', desc: 'Toggle Notes to write small candidate numbers in a cell.' },
  { icon: '⌫', title: 'Erase', desc: 'Clear a cell you filled in by tapping Erase.' },
  { icon: '💾', title: 'Auto-Save', desc: 'Your game is saved automatically. Resume anytime from the home screen.' },
];

export default function HowToPlayScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>📖 How to Play</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {RULES.map((r, i) => (
          <View key={i} style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
            <Text style={styles.icon}>{r.icon}</Text>
            <View style={styles.textBlock}>
              <Text style={[styles.ruleTitle, { color: theme.text }]}>{r.title}</Text>
              <Text style={[styles.ruleDesc, { color: theme.subtext }]}>{r.desc}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  back: { fontSize: 15, fontWeight: '600', width: 60 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  icon: { fontSize: 28 },
  textBlock: { flex: 1 },
  ruleTitle: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  ruleDesc: { fontSize: 14, lineHeight: 20 },
});
