import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const PAD_SIZE = Math.min(width - 24, 380);

export default function NumberPad() {
  const { inputNumber, undo, redo, useHint, eraseCell, hintsLeft, history, future, noteMode, setNoteMode, gridSize = 9 } = useGame();
  const { theme } = useTheme();

  const size = gridSize || 9;
  const numbers = Array.from({ length: size }, (_, i) => i + 1);
  const BTN_SIZE = (PAD_SIZE - 8) / size;

  return (
    <View style={styles.container}>
      {/* Number buttons */}
      <View style={styles.numRow}>
        {numbers.map(n => (
          <TouchableOpacity
            key={n}
            onPress={() => inputNumber(n)}
            style={[styles.numBtn, { backgroundColor: theme.numpad, width: BTN_SIZE, height: BTN_SIZE + 4 }]}
          >
            <Text style={[styles.numText, { color: theme.numpadText, fontSize: BTN_SIZE * 0.52 }]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <ActionBtn label="↩" sublabel="Undo" onPress={undo} disabled={history.length === 0} theme={theme} color={theme.secondary} />
        <ActionBtn label="↪" sublabel="Redo" onPress={redo} disabled={future.length === 0} theme={theme} color={theme.secondary} />
        <ActionBtn label="✏️" sublabel={noteMode ? 'Notes ON' : 'Notes'} onPress={() => setNoteMode(m => !m)} theme={theme} color={noteMode ? theme.accent : theme.subtext} active={noteMode} />
        <ActionBtn label="⌫" sublabel="Erase" onPress={eraseCell} theme={theme} color={theme.error} />
        <ActionBtn label="💡" sublabel={`Hint (${hintsLeft})`} onPress={useHint} disabled={hintsLeft === 0} theme={theme} color={theme.hint} />
      </View>
    </View>
  );
}

function ActionBtn({ label, sublabel, onPress, disabled, theme, color, active }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionBtn,
        {
          backgroundColor: active ? color + '33' : theme.surface,
          borderColor: color,
          opacity: disabled ? 0.35 : 1,
        }
      ]}
    >
      <Text style={[styles.actionIcon, { color }]}>{label}</Text>
      <Text style={[styles.actionLabel, { color: theme.subtext }]}>{sublabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  numRow: {
    flexDirection: 'row',
    gap: 4,
  },
  numBtn: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  numText: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 58,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
