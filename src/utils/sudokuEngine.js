// Sudoku Engine: generate, validate, solve

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
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

const CLUES = { easy: 46, medium: 36, hard: 28, expert: 22 };

export function generatePuzzle(difficulty = 'medium') {
  // Build a full solved board
  const solved = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solved);

  // Remove cells
  const puzzle = deepCopy(solved);
  const clues = CLUES[difficulty] || 36;
  const toRemove = 81 - clues;
  const positions = shuffle([...Array(81).keys()]);

  for (let i = 0; i < toRemove; i++) {
    const pos = positions[i];
    puzzle[Math.floor(pos / 9)][pos % 9] = 0;
  }

  return { puzzle, solution: solved };
}

export function checkCell(solution, row, col, value) {
  return solution[row][col] === value;
}

export function isBoardComplete(board, solution) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] !== solution[r][c]) return false;
  return true;
}

export function getHint(board, solution) {
  const empties = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] === 0) empties.push({ r, c });
  if (empties.length === 0) return null;
  const pick = empties[Math.floor(Math.random() * empties.length)];
  return { row: pick.r, col: pick.c, value: solution[pick.r][pick.c] };
}
