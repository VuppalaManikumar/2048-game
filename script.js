let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let score = 0;
let cells = [];
let board = [];

function createBoard() {
  for (let i = 0; i < 16; i++) {
    board[i] = 0;
    let cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
    cells.push(cell);
  }
  generate();
  generate();
  updateBoard();
}

function generate() {
  let empty = board
    .map((val, idx) => (val === 0 ? idx : null))
    .filter(val => val !== null);

  if (empty.length === 0) return;

  let randomIndex = empty[Math.floor(Math.random() * empty.length)];
  board[randomIndex] = 2;
}

function updateBoard() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] === 0 ? "" : board[i];
    cell.setAttribute("data-value", board[i]);
  });
  scoreDisplay.textContent = "Score: " + score;
}

function slide(row) {
  row = row.filter(val => val);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(val => val);
  while (row.length < 4) row.push(0);
  return row;
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    let row = board.slice(i * 4, i * 4 + 4);
    row = slide(row);
    for (let j = 0; j < 4; j++) {
      board[i * 4 + j] = row[j];
    }
  }
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    let row = board.slice(i * 4, i * 4 + 4).reverse();
    row = slide(row);
    row.reverse();
    for (let j = 0; j < 4; j++) {
      board[i * 4 + j] = row[j];
    }
  }
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    let col = [board[i], board[i + 4], board[i + 8], board[i + 12]];
    col = slide(col);
    for (let j = 0; j < 4; j++) {
      board[i + j * 4] = col[j];
    }
  }
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    let col = [board[i], board[i + 4], board[i + 8], board[i + 12]].reverse();
    col = slide(col);
    col.reverse();
    for (let j = 0; j < 4; j++) {
      board[i + j * 4] = col[j];
    }
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowUp") moveUp();
  if (e.key === "ArrowDown") moveDown();
  generate();
  updateBoard();
});

createBoard();
