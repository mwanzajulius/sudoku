import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 24, 380);

export default function SudokuBoard() {
  const { board, given, errors, selected, setSelected, notes, gridSize = 9 } = useGame();
  const { theme } = useTheme();

  const size = gridSize || 9;
  const CELL_SIZE = BOARD_SIZE / size;

  const selectedNum = useMemo(() => {
    if (!selected || !board) return null;
    return board[selected.row][selected.col] || null;
  }, [selected, board]);

  if (!board) return null;

  return (
    <View style={[styles.board, { borderColor: theme.boxLine, width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((val, c) => {
            const key = `${r},${c}`;
            const isSelected = selected?.row === r && selected?.col === c;
            const isGiven = given?.[key];
            const isError = errors?.[key];
            const sameNum = selectedNum && val === selectedNum && val !== 0;

            const sameRowCol = selected && (selected.row === r || selected.col === c);
            const sameBox = size === 9 && selected && (
              Math.floor(selected.row / 3) === Math.floor(r / 3) &&
              Math.floor(selected.col / 3) === Math.floor(c / 3)
            );

            const cellNotes = notes?.[key];

            let bgColor = theme.surface;
            if (isSelected) bgColor = theme.selected;
            else if (sameNum) bgColor = theme.sameNumber;
            else if (sameBox || sameRowCol) bgColor = theme.highlight;

            // For 9x9: thick border on right/bottom of each 3x3 box
            const boxBorderRight = size === 9 && (c + 1) % 3 === 0 && c !== size - 1;
            const boxBorderBottom = size === 9 && (r + 1) % 3 === 0 && r !== size - 1;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSelected({ row: r, col: c })}
                style={[
                  styles.cell,
                  {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: bgColor,
                    borderRightWidth: c === size - 1 ? 0 : boxBorderRight ? 3 : 1,
                    borderBottomWidth: r === size - 1 ? 0 : boxBorderBottom ? 3 : 1,
                    borderRightColor: boxBorderRight ? theme.boxLine : theme.gridLine,
                    borderBottomColor: boxBorderBottom ? theme.boxLine : theme.gridLine,
                  },
                ]}
              >
                {val !== 0 ? (
                  <Text style={[
                    styles.cellText,
                    {
                      color: isError ? theme.error : isGiven ? theme.given : theme.user,
                      fontWeight: isGiven ? '700' : '500',
                      fontSize: CELL_SIZE * 0.52,
                    }
                  ]}>
                    {val}
                  </Text>
                ) : cellNotes && cellNotes.size > 0 ? (
                  <NoteGrid notes={cellNotes} theme={theme} cellSize={CELL_SIZE} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function NoteGrid({ notes, theme, cellSize }) {
  return (
    <View style={styles.noteGrid}>
      {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
        <Text key={n} style={[styles.noteText, {
          color: notes.has(n) ? theme.user : 'transparent',
          fontSize: cellSize * 0.22,
        }]}>
          {n}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 3,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    textAlign: 'center',
  },
  noteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 1,
  },
  noteText: {
    width: '33.33%',
    textAlign: 'center',
  },
});
