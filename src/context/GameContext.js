import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePuzzle, checkCell, isBoardComplete, getHint } from '../utils/sudokuEngine';

const SAVE_KEY = 'sudoku_saved_game';
const GameContext = createContext();

export function GameProvider({ children }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [board, setBoard] = useState(null);
  const [given, setGiven] = useState(null); // cells that are pre-filled
  const [errors, setErrors] = useState({}); // "r,c" -> true
  const [selected, setSelected] = useState(null); // {row, col}
  const [history, setHistory] = useState([]); // undo stack
  const [future, setFuture] = useState([]); // redo stack
  const [hintsLeft, setHintsLeft] = useState(3);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState({}); // "r,c" -> Set of numbers
  const [noteMode, setNoteMode] = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (running && !completed) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, completed]);

  // Auto-save every 5 seconds when game is active
  useEffect(() => {
    if (!board || completed) return;
    const save = setTimeout(() => saveGame(), 5000);
    return () => clearTimeout(save);
  }, [board, timer]);

  const saveGame = useCallback(async () => {
    if (!board) return;
    const state = { difficulty, puzzle, solution, board, given, errors, history, future, hintsLeft, timer, notes: serializeNotes(notes) };
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [board, difficulty, puzzle, solution, given, errors, history, future, hintsLeft, timer, notes]);

  const loadSavedGame = useCallback(async () => {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    setDifficulty(state.difficulty);
    setPuzzle(state.puzzle);
    setSolution(state.solution);
    setBoard(state.board);
    setGiven(state.given);
    setErrors(state.errors || {});
    setHistory(state.history || []);
    setFuture(state.future || []);
    setHintsLeft(state.hintsLeft ?? 3);
    setTimer(state.timer || 0);
    setNotes(deserializeNotes(state.notes || {}));
    setCompleted(false);
    setRunning(true);
    return true;
  }, []);

  const startNewGame = useCallback((diff = difficulty) => {
    const { puzzle: p, solution: s } = generatePuzzle(diff);
    const givenMap = {};
    p.forEach((row, r) => row.forEach((val, c) => { if (val !== 0) givenMap[`${r},${c}`] = true; }));
    setDifficulty(diff);
    setPuzzle(p);
    setSolution(s);
    setBoard(p.map(row => [...row]));
    setGiven(givenMap);
    setErrors({});
    setSelected(null);
    setHistory([]);
    setFuture([]);
    setHintsLeft(3);
    setTimer(0);
    setNotes({});
    setNoteMode(false);
    setCompleted(false);
    setRunning(true);
    AsyncStorage.removeItem(SAVE_KEY);
  }, [difficulty]);

  const inputNumber = useCallback((num) => {
    if (!selected || !board || completed) return;
    const { row, col } = selected;
    if (given[`${row},${col}`]) return;

    if (noteMode) {
      setNotes(prev => {
        const key = `${row},${col}`;
        const set = new Set(prev[key] || []);
        set.has(num) ? set.delete(num) : set.add(num);
        return { ...prev, [key]: set };
      });
      return;
    }

    const prevBoard = board.map(r => [...r]);
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;

    const isCorrect = checkCell(solution, row, col, num);
    const newErrors = { ...errors };
    if (!isCorrect && num !== 0) {
      newErrors[`${row},${col}`] = true;
    } else {
      delete newErrors[`${row},${col}`];
    }

    // Clear notes for this cell
    const newNotes = { ...notes };
    delete newNotes[`${row},${col}`];

    setHistory(h => [...h, { board: prevBoard, errors: { ...errors }, notes: serializeNotes(notes) }]);
    setFuture([]);
    setBoard(newBoard);
    setErrors(newErrors);
    setNotes(newNotes);

    if (isBoardComplete(newBoard, solution)) {
      setCompleted(true);
      setRunning(false);
      AsyncStorage.removeItem(SAVE_KEY);
    }
  }, [selected, board, given, solution, errors, completed, noteMode, notes]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [{ board: board.map(r => [...r]), errors: { ...errors }, notes: serializeNotes(notes) }, ...f]);
    setBoard(prev.board);
    setErrors(prev.errors);
    setNotes(deserializeNotes(prev.notes));
    setHistory(h => h.slice(0, -1));
  }, [history, board, errors, notes]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, { board: board.map(r => [...r]), errors: { ...errors }, notes: serializeNotes(notes) }]);
    setBoard(next.board);
    setErrors(next.errors);
    setNotes(deserializeNotes(next.notes));
    setFuture(f => f.slice(1));
  }, [future, board, errors, notes]);

  const useHint = useCallback(() => {
    if (hintsLeft <= 0 || !board || completed) return;
    const hint = getHint(board, solution);
    if (!hint) return;
    setSelected({ row: hint.row, col: hint.col });
    const prevBoard = board.map(r => [...r]);
    const newBoard = board.map(r => [...r]);
    newBoard[hint.row][hint.col] = hint.value;
    const newErrors = { ...errors };
    delete newErrors[`${hint.row},${hint.col}`];
    const newNotes = { ...notes };
    delete newNotes[`${hint.row},${hint.col}`];
    setHistory(h => [...h, { board: prevBoard, errors: { ...errors }, notes: serializeNotes(notes) }]);
    setFuture([]);
    setBoard(newBoard);
    setErrors(newErrors);
    setNotes(newNotes);
    setHintsLeft(h => h - 1);
    if (isBoardComplete(newBoard, solution)) {
      setCompleted(true);
      setRunning(false);
      AsyncStorage.removeItem(SAVE_KEY);
    }
  }, [hintsLeft, board, solution, errors, notes, completed]);

  const eraseCell = useCallback(() => {
    if (!selected || !board || completed) return;
    const { row, col } = selected;
    if (given[`${row},${col}`]) return;
    inputNumber(0);
  }, [selected, board, given, completed, inputNumber]);

  return (
    <GameContext.Provider value={{
      difficulty, puzzle, solution, board, given, errors, selected, setSelected,
      history, future, hintsLeft, timer, running, completed, notes, noteMode,
      setNoteMode, startNewGame, inputNumber, undo, redo, useHint, eraseCell,
      loadSavedGame, saveGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);

function serializeNotes(notes) {
  const out = {};
  for (const key in notes) out[key] = [...notes[key]];
  return out;
}

function deserializeNotes(notes) {
  const out = {};
  for (const key in notes) out[key] = new Set(notes[key]);
  return out;
}
