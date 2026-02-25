let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let highScoreDisplay = document.getElementById("highScore");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = "High Score: " + highScore;

let cells = [];
let board = [];

function createBoard() {
    grid.innerHTML = "";
    cells = [];
    board = [];
    score = 0;

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

        cell.classList.add("pop");
        setTimeout(() => cell.classList.remove("pop"), 100);
    });

    scoreDisplay.textContent = "Score: " + score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.textContent = "High Score: " + highScore;
    }
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
    handleMove(e.key);
});

// Swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].screenX - touchStartX;
    let dy = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) handleMove("ArrowRight");
        else handleMove("ArrowLeft");
    } else {
        if (dy > 0) handleMove("ArrowDown");
        else handleMove("ArrowUp");
    }
});

function handleMove(direction) {
    if (direction === "ArrowLeft") moveLeft();
    if (direction === "ArrowRight") moveRight();
    if (direction === "ArrowUp") moveUp();
    if (direction === "ArrowDown") moveDown();
    generate();
    updateBoard();
}

function restartGame() {
    createBoard();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

createBoard();