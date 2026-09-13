import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 24, 380);
const CELL_SIZE = BOARD_SIZE / 9;

export default function SudokuBoard() {
  const { board, given, errors, selected, setSelected, notes, solution } = useGame();
  const { theme } = useTheme();

  const selectedNum = useMemo(() => {
    if (!selected || !board) return null;
    return board[selected.row][selected.col] || null;
  }, [selected, board]);

  if (!board) return null;

  return (
    <View style={[styles.board, { borderColor: theme.boxLine, backgroundColor: theme.surface }]}>
      {board.map((row, r) =>
        row.map((val, c) => {
          const key = `${r},${c}`;
          const isSelected = selected?.row === r && selected?.col === c;
          const isGiven = given?.[key];
          const isError = errors?.[key];
          const sameNum = selectedNum && val === selectedNum && val !== 0;
          const sameBox = selected && (
            Math.floor(selected.row / 3) === Math.floor(r / 3) &&
            Math.floor(selected.col / 3) === Math.floor(c / 3)
          );
          const sameRowCol = selected && (selected.row === r || selected.col === c);
          const cellNotes = notes?.[key];

          let bgColor = theme.surface;
          if (isSelected) bgColor = theme.selected;
          else if (sameNum) bgColor = theme.sameNumber;
          else if (sameBox || sameRowCol) bgColor = theme.highlight;

          const borderRight = (c + 1) % 3 === 0 && c !== 8;
          const borderBottom = (r + 1) % 3 === 0 && r !== 8;

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
                  borderRightWidth: borderRight ? 2 : 0.5,
                  borderBottomWidth: borderBottom ? 2 : 0.5,
                  borderRightColor: borderRight ? theme.boxLine : theme.gridLine,
                  borderBottomColor: borderBottom ? theme.boxLine : theme.gridLine,
                  borderTopWidth: r === 0 ? 0 : 0,
                  borderLeftWidth: c === 0 ? 0 : 0,
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
        })
      )}
    </View>
  );
}

function NoteGrid({ notes, theme, cellSize }) {
  return (
    <View style={styles.noteGrid}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <Text key={n} style={[styles.noteText, { color: notes.has(n) ? theme.user : 'transparent', fontSize: cellSize * 0.22 }]}>
          {n}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2.5,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
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
    lineHeight: undefined,
  },
});
