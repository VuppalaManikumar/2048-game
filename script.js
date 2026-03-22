// FIREBASE CDN IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// FIREBASE CONFIG
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

// AUTH
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Account created! You're logged in."))
    .catch(err => alert(err.message));
};

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .catch(err => alert(err.message));
};

window.logout = function () {
  if (confirm("Logout?")) signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";
    initGame();
  } else {
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";
  }
});

// THEME
window.toggleTheme = function () {
  document.body.classList.toggle("light");
};

// ── GAME STATE ──
let board = Array(16).fill(0);
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore2048") || "0");
let cells = [];
let gameOver = false;

function initGame() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  cells = [];

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
    cells.push(cell);
  }

  restartGame();
}

window.restartGame = function () {
  board = Array(16).fill(0);
  score = 0;
  gameOver = false;
  document.getElementById("gameOverOverlay").classList.remove("show");
  spawn();
  spawn();
  render();
};

function spawn() {
  const empty = board.reduce((acc, v, i) => v === 0 ? [...acc, i] : acc, []);
  if (!empty.length) return;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  board[idx] = Math.random() < 0.85 ? 2 : 4;
}

function render() {
  cells.forEach((cell, i) => {
    const val = board[i];
    cell.textContent = val || "";
    cell.dataset.value = val || "";
  });
  document.getElementById("scoreVal").textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore2048", highScore);
  }
  document.getElementById("highScoreVal").textContent = highScore;
}

function slideRow(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(v => v);
  while (arr.length < 4) arr.push(0);
  return arr;
}

window.move = function (dir) {
  if (gameOver) return;

  const prev = [...board];
  const b = board;

  for (let i = 0; i < 4; i++) {
    let row;
    if (dir === "left")  row = [b[i*4], b[i*4+1], b[i*4+2], b[i*4+3]];
    if (dir === "right") row = [b[i*4+3], b[i*4+2], b[i*4+1], b[i*4]];
    if (dir === "up")    row = [b[i], b[i+4], b[i+8], b[i+12]];
    if (dir === "down")  row = [b[i+12], b[i+8], b[i+4], b[i]];

    const slid = slideRow(row);

    for (let j = 0; j < 4; j++) {
      if (dir === "left")  b[i*4+j] = slid[j];
      if (dir === "right") b[i*4+(3-j)] = slid[j];
      if (dir === "up")    b[i+j*4] = slid[j];
      if (dir === "down")  b[i+(3-j)*4] = slid[j];
    }
  }

  const changed = board.some((v, i) => v !== prev[i]);
  if (changed) {
    spawn();
    render();
    popNewCells(prev);
    checkGameOver();
  }
};

function popNewCells(prev) {
  cells.forEach((cell, i) => {
    if (board[i] !== 0 && board[i] !== prev[i]) {
      cell.classList.remove("pop");
      void cell.offsetWidth;
      cell.classList.add("pop");
    }
  });
}

function checkGameOver() {
  if (board.includes(0)) return;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const idx = i * 4 + j;
      if (j < 3 && board[idx] === board[idx + 1]) return;
      if (i < 3 && board[idx] === board[idx + 4]) return;
    }
  }
  gameOver = true;
  document.getElementById("gameOverScore").textContent = `Final Score: ${score}`;
  document.getElementById("gameOverOverlay").classList.add("show");
}

// ── KEYBOARD ──
document.addEventListener("keydown", e => {
  const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
  if (map[e.key]) {
    e.preventDefault();
    move(map[e.key]);
  }
});

// ── TOUCH SWIPE ──
let touchStartX = 0, touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) < 30) return; // too small

  if (absDx > absDy) {
    move(dx > 0 ? "right" : "left");
  } else {
    move(dy > 0 ? "down" : "up");
  }
}, { passive: true });
