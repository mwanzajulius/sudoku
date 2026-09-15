import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, Modal, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Timer from '../components/Timer';

const DIFF_COLORS = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444', expert: '#8B5CF6' };
const DIFF_DARK = { easy: '#34D399', medium: '#FCD34D', hard: '#F87171', expert: '#C084FC' };

export default function GameScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { difficulty, completed, timer, startNewGame, errors, gridSize = 9 } = useGame();

  const diffColor = isDark ? DIFF_DARK[difficulty] : DIFF_COLORS[difficulty];
  const sizeColor = theme[`size${gridSize}`] || theme.primary;
  const errorCount = Object.keys(errors).length;

  const handleNewGame = () => {
    Alert.alert('New Game', 'Start a new game? Current progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'New Game', style: 'destructive', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.primary }]}>← Home</Text>
        </TouchableOpacity>
        <View style={[styles.diffBadge, { backgroundColor: diffColor + '22', borderColor: diffColor }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>{difficulty.toUpperCase()}</Text>
        </View>
        <View style={[styles.diffBadge, { backgroundColor: sizeColor + '22', borderColor: sizeColor }]}>
          <Text style={[styles.diffText, { color: sizeColor }]}>{gridSize}×{gridSize}</Text>
        </View>
        <TouchableOpacity onPress={handleNewGame}>
          <Text style={[styles.newGame, { color: theme.secondary }]}>New ＋</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Timer />
        <View style={[styles.errorBadge, { backgroundColor: errorCount > 0 ? theme.error + '22' : theme.surface, borderColor: errorCount > 0 ? theme.error : theme.border }]}>
          <Text style={[styles.errorText, { color: errorCount > 0 ? theme.error : theme.subtext }]}>
            ❌ {errorCount} error{errorCount !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <SudokuBoard />
      </View>

      {/* Number pad */}
      <NumberPad />

      {/* Completion Modal */}
      <Modal visible={completed} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>Puzzle Solved!</Text>
            <Text style={[styles.modalSub, { color: theme.subtext }]}>
              {difficulty.toUpperCase()} • {mins}:{secs}
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.modalBtnText}>Play Again 🎮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, fontWeight: '600' },
  diffBadge: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  diffText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  newGame: { fontSize: 15, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  errorBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  errorText: { fontSize: 13, fontWeight: '600' },
  boardContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    width: 300,
    elevation: 10,
  },
  trophy: { fontSize: 64, marginBottom: 8 },
  modalTitle: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  modalSub: { fontSize: 16, marginBottom: 24 },
  modalBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
