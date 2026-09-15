// Sudoku Engine: generate, validate, solve
// Supports 4x4 (2x2 boxes), 6x6 (2x3 boxes), 9x9 (3x3 boxes)

// boxRows x boxCols per grid size
const BOX_DIMS = { 4: [2, 2], 6: [2, 3], 9: [3, 3] };

function isValid(board, row, col, num, size) {
  const [boxR, boxC] = BOX_DIMS[size];
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const startRow = boxR * Math.floor(row / boxR);
  const startCol = boxC * Math.floor(col / boxC);
  for (let r = startRow; r < startRow + boxR; r++)
    for (let c = startCol; c < startCol + boxC; c++)
      if (board[r][c] === num) return false;
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

// clues per difficulty per grid size
const CLUES = {
  4:  { easy: 12, medium: 10, hard: 8,  expert: 6  },
  6:  { easy: 24, medium: 20, hard: 16, expert: 12 },
  9:  { easy: 46, medium: 36, hard: 28, expert: 22 },
};

export function generatePuzzle(difficulty = 'medium', gridSize = 9) {
  const solved = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  solve(solved, gridSize);

  const puzzle = deepCopy(solved);
  const clues = (CLUES[gridSize] || CLUES[9])[difficulty] || 36;
  const total = gridSize * gridSize;
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
