// script.js - VATЯIS Vaporwave Tetris Game Logic

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 600;

// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
  null,
  '#f0f', // T
  '#0ff', // I
  '#0f0', // S
  '#ff0', // Z
  '#00f', // L
  '#f60', // J
  '#f00'  // O
];

const moveSound = document.getElementById('moveSound');
const rotateSound = document.getElementById('rotateSound');
const lockSound = document.getElementById('lockSound');
const gameOverSound = document.getElementById('gameOverSound');

// Tetromino shapes
const TETROMINOS = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'J': [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0]
  ],
  'L': [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0]
  ],
  'O': [
    [4, 4],
    [4, 4]
  ],
  'S': [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0]
  ],
  'T': [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  'Z': [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
};

// Arena
function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = COLORS[value];
        context.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = '#222';
        context.strokeRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    resetPlayer();
    arenaSweep();
    lockSound.play();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
  moveSound.play();
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
  rotateSound.play();
}

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;
    player.score += rowCount * 100;
    rowCount *= 2;
  }
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function updateScore() {
  document.getElementById('score').innerText = `SCORE: ${String(player.score).padStart(6, '0')}`;
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  draw();
  updateScore();
  requestAnimationFrame(update);
}

function createPiece(type) {
  return TETROMINOS[type];
}

function resetPlayer() {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  player.pos.y = 0;
  player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    gameOverSound.play();
  }
}

const arena = createMatrix(COLS, ROWS);
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0
};

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') playerMove(-1);
  else if (event.key === 'ArrowRight') playerMove(1);
  else if (event.key === 'ArrowDown') playerDrop();
  else if (event.key === 'ArrowUp') playerRotate(1);
});

resetPlayer();
update();
