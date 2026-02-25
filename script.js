// FIREBASE CDN IMPORTS (required for GitHub Pages)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDDWJPoReIvNaxn85d9voPYxMm5uats0EU",
    authDomain: "pro-703ce.firebaseapp.com",
    projectId: "pro-703ce",
    storageBucket: "pro-703ce.firebasestorage.app",
    messagingSenderId: "811826144635",
    appId: "1:811826144635:web:23c27994e99553c97bc9de"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// AUTH FUNCTIONS
window.signup = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => alert("Signup successful!"))
        .catch(error => alert(error.message));
};

window.login = function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .catch(error => alert(error.message));
};

window.logout = function() {
    signOut(auth);
};

onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("gamePage").style.display = "block";
        createBoard();
    } else {
        document.getElementById("gamePage").style.display = "none";
        document.getElementById("loginPage").style.display = "block";
    }
});

// 2048 GAME LOGIC
let grid = document.getElementById("grid");
let scoreDisplay = document.getElementById("score");
let highScoreDisplay = document.getElementById("highScore");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

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
    let empty = board.map((val, i) => val === 0 ? i : null).filter(v => v !== null);
    if (empty.length === 0) return;
    board[empty[Math.floor(Math.random() * empty.length)]] = 2;
}

function updateBoard() {
    cells.forEach((cell, i) => {
        cell.textContent = board[i] === 0 ? "" : board[i];
    });

    scoreDisplay.textContent = "Score: " + score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    highScoreDisplay.textContent = "High Score: " + highScore;
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

function move(direction) {
    for (let i = 0; i < 4; i++) {
        let row;
        if (direction === "left") row = board.slice(i * 4, i * 4 + 4);
        if (direction === "right") row = board.slice(i * 4, i * 4 + 4).reverse();
        if (direction === "up") row = [board[i], board[i + 4], board[i + 8], board[i + 12]];
        if (direction === "down") row = [board[i], board[i + 4], board[i + 8], board[i + 12]].reverse();

        row = slide(row);
        if (direction === "right" || direction === "down") row.reverse();

        for (let j = 0; j < 4; j++) {
            if (direction === "left" || direction === "right")
                board[i * 4 + j] = row[j];
            else
                board[i + j * 4] = row[j];
        }
    }
    generate();
    updateBoard();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") move("left");
    if (e.key === "ArrowRight") move("right");
    if (e.key === "ArrowUp") move("up");
    if (e.key === "ArrowDown") move("down");
});

window.restartGame = function() {
    createBoard();
};

window.toggleDarkMode = function() {
    document.body.classList.toggle("dark");
};