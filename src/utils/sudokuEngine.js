// Sudoku Engine: generate, validate, solve
// 3x3: 9 cells, numbers 1-3, no repeats in rows/cols
// 9x9: 81 cells, numbers 1-9, no repeats in rows/cols/3x3 boxes

function isValid(board, row, col, num, size) {
  // Check row
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num) return false;
  }
  // Check column
  for (let i = 0; i < size; i++) {
    if (board[i][col] === num) return false;
  }
  // Check box (only for 9x9)
  if (size === 9) {
    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
    for (let r = startRow; r < startRow + 3; r++)
      for (let c = startCol; c < startCol + 3; c++)
        if (board[r][c] === num) return false;
  }
  return true;
}

function solve(board, size) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
        for (const num of nums) {
          if (isValid(board, row, col, num, size)) {
            board[row][col] = num;
            if (solve(board, size)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deepCopy(board) {
  return board.map(row => [...row]);
}

const CLUES = {
  3: { easy: 7, medium: 6, hard: 5, expert: 4 },
  9: { easy: 46, medium: 36, hard: 28, expert: 22 },
};

export function generatePuzzle(difficulty = 'medium', gridSize = 9) {
  const solved = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  solve(solved, gridSize);

  const puzzle = deepCopy(solved);
  const total = gridSize * gridSize;
  const clues = Math.min((CLUES[gridSize] || CLUES[9])[difficulty] || 36, total - 1);
  const toRemove = total - clues;
  const positions = shuffle([...Array(total).keys()]);

  for (let i = 0; i < toRemove; i++) {
    const pos = positions[i];
    puzzle[Math.floor(pos / gridSize)][pos % gridSize] = 0;
  }

  return { puzzle, solution: solved, gridSize };
}

export function checkCell(solution, row, col, value) {
  return solution[row][col] === value;
}

export function isBoardComplete(board, solution) {
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length; c++)
      if (board[r][c] !== solution[r][c]) return false;
  return true;
}

export function getHint(board, solution) {
  const empties = [];
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length; c++)
      if (board[r][c] === 0) empties.push({ r, c });
  if (empties.length === 0) return null;
  const pick = empties[Math.floor(Math.random() * empties.length)];
  return { row: pick.r, col: pick.c, value: solution[pick.r][pick.c] };
}
