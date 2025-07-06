// script.js - VATЯIS Vaporwave Tetris Game Logic with Sound Effects

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 600;

// Canvas da próxima peça
const nextCanvas = document.getElementById("nextPieceCanvas");
const nextContext = nextCanvas.getContext("2d");
nextCanvas.width = 120;
nextCanvas.height = 120;

let hue = 0;
let gameStarted = false;
let startScreenFrame = 0;
let showPressEnter = true;
let lastBlink = 0;

// Variáveis para animação do pause
let pauseAnimationAlpha = 0;
let pauseDirection = 1;

// Variável de nível e linhas
let level = 1;
let lines = 0;
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");

// Sistema de próxima peça
let nextPiece = null;
let pieceQueue = [];

// Constantes
const particles = [];
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 20; // Tamanho menor para a próxima peça
const COLORS = [
  null,
  "#ff6ec7", // T - pink neon
  "#00fff7", // I - ciano elétrico
  "#7dffb3", // S - verde menta glitch
  "#ffe600", // Z - amarelo neon vibrante
  "#6a5acd", // L - roxo elétrico (blue violet)
  "#ff8c00", // J - laranja neon queimado
  "#ff0055", // O - magenta quente/rosado glitch
];

// Carregar sons
const moveSound = new Audio("sounds/move.wav");
const rotateSound = new Audio("sounds/rotate.wav");
const lockSound = new Audio("sounds/lock.wav");
const gameOverSound = new Audio("sounds/gameover.mp3");
const lineClearSound = new Audio("sounds/lineClear.wav");

// Carregar imagens
const introImage = new Image();
introImage.src = "imgs/intro.jpg";

const gameImage = new Image();
gameImage.src = "imgs/fundo.jpg";

// Tetrominos
const TETROMINOS = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  O: [
    [4, 4],
    [4, 4],
  ],
  S: [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
};

// Array com todas as peças para randomização
const PIECE_TYPES = ["I", "J", "L", "O", "S", "T", "Z"];

// Função para gerar uma sequência aleatória de peças (bag system)
function generatePieceBag() {
  const bag = [...PIECE_TYPES];
  // Embaralhar usando Fisher-Yates
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

// Função para obter a próxima peça
function getNextPiece() {
  if (pieceQueue.length === 0) {
    pieceQueue = generatePieceBag();
  }
  return pieceQueue.shift();
}

// Função para desenhar a próxima peça
function drawNextPiece() {
  if (!nextPiece || !gameStarted) return;

  // Limpar o canvas
  nextContext.fillStyle = "rgba(0, 0, 0, 0.8)";
  nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  const matrix = createPiece(nextPiece);

  // Calcular posição centralizada
  const offsetX = Math.floor(
    (nextCanvas.width / NEXT_BLOCK_SIZE - matrix[0].length) / 2
  );
  const offsetY = Math.floor(
    (nextCanvas.height / NEXT_BLOCK_SIZE - matrix.length) / 2
  );

  // Desenhar a peça
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        // Desenhar o bloco com efeito neon
        nextContext.fillStyle = COLORS[value];
        nextContext.fillRect(
          (x + offsetX) * NEXT_BLOCK_SIZE,
          (y + offsetY) * NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE
        );

        // Borda dos blocos
        nextContext.strokeStyle = "#222";
        nextContext.lineWidth = 1;
        nextContext.strokeRect(
          (x + offsetX) * NEXT_BLOCK_SIZE,
          (y + offsetY) * NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE
        );

        // Efeito de brilho
        nextContext.shadowColor = COLORS[value];
        nextContext.shadowBlur = 5;
        nextContext.fillRect(
          (x + offsetX) * NEXT_BLOCK_SIZE,
          (y + offsetY) * NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE,
          NEXT_BLOCK_SIZE
        );
        nextContext.shadowBlur = 0;
      }
    });
  });
}

// Desenhar a tela de inicio
function drawStartScreen() {
  if (introImage.complete) {
    context.drawImage(introImage, 0, 0, canvas.width, canvas.height);
  } else {
    introImage.onload = () => {
      context.drawImage(introImage, 0, 0, canvas.width, canvas.height);
    };
  }

  const title = "VATЯIS";
  const prompt = "Aperte 'Enter'";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#ff00cc");
  gradient.addColorStop(1, "#00ffff");

  const dropY = Math.min(centerY - 50, -100 + startScreenFrame * 4);
  startScreenFrame += 1;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = 'bold 50px "Courier New", monospace';

  drawGlitchText(title, centerX, dropY, gradient);

  const now = performance.now();
  if (now - lastBlink > 500) {
    showPressEnter = !showPressEnter;
    lastBlink = now;
  }

  if (showPressEnter && startScreenFrame > 20) {
    context.font = 'bold 24px "Courier New", monospace';
    drawGlitchText(prompt, centerX, centerY + 20, gradient, 1);
  }
}

function drawGlitchText(text, x, y, fillStyle, shadowBlur = 20) {
  context.fillStyle = fillStyle;
  context.shadowColor = "#ff00cc";
  context.shadowBlur = shadowBlur;
  context.fillText(text, x, y);

  context.shadowBlur = 0;
  context.fillStyle = "rgba(255, 0, 255, 0.4)";
  context.fillText(text, x + 2, y - 1);

  context.fillStyle = "rgba(0, 255, 255, 0.4)";
  context.fillText(text, x - 2, y + 1);
}

// Partículas de distorção mais estilizadas
function createGlitchParticles(x, y) {
  const numParticles = 30;
  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    const size = Math.random() * 3 + 2;

    particles.push({
      x: x * BLOCK_SIZE + Math.cos(angle) * Math.random() * BLOCK_SIZE,
      y: y * BLOCK_SIZE + Math.sin(angle) * Math.random() * BLOCK_SIZE,
      size: size,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      life: Math.random() * 40 + 20,
      color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 30}%)`,
      alpha: 1,
      glow: Math.random() * 2 + 0.5,
    });
  }
}

// Atualizar e desenhar as partículas com novos efeitos
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.97;
    particle.alpha -= 0.03;
    particle.glow -= 0.05;

    if (particle.alpha <= 0 || particle.size <= 0 || particle.glow <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Desenhar as partículas com um efeito de brilho dinâmico
function drawParticles() {
  particles.forEach((particle) => {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

    context.shadowBlur = 15;
    context.shadowColor = particle.color;
    context.fillStyle = particle.color;

    context.globalAlpha = particle.alpha;

    context.fill();
  });
  context.globalAlpha = 1;
  context.shadowBlur = 0;
  context.shadowColor = "transparent";
}

// Arena
function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}

// Desenhar a matriz
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = COLORS[value];
        context.fillRect(
          (x + offset.x) * BLOCK_SIZE,
          (y + offset.y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        context.strokeStyle = "#222";
        context.strokeRect(
          (x + offset.x) * BLOCK_SIZE,
          (y + offset.y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    });
  });
}

// Mesclar a matriz do jogador com a arena
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

// Colisão
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

// Rotacionar a matriz
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

// Funções de movimento do jogador
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
  else moveSound.play();
}

// Rotacionar o jogador
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

// Limpar linhas completas - CORRIGIDO
function arenaSweep() {
  let linesCleared = 0;

  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) continue outer;
    }

    // Gerar partículas de glitch na linha que foi apagada
    createGlitchParticles(5, y);

    // Remover a linha completa
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);

    linesCleared++;
    y++; // Verificar a mesma linha novamente
  }

  if (linesCleared > 0) {
    lines += linesCleared;
    player.score += linesCleared * 100 * level;
    lineClearSound.play();
    updateLines();
  }
}

// Desenhar a tela
function draw() {
  if (gameImage.complete) {
    context.drawImage(gameImage, 0, 0, canvas.width, canvas.height);
  } else {
    gameImage.onload = () => {
      context.drawImage(gameImage, 0, 0, canvas.width, canvas.height);
    };
  }
  hue = (hue + 0.5) % 360;

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);

  // Desenhar a próxima peça
  drawNextPiece();

  if (isPaused) {
    drawPauseScreen();
  }
}

// Atualizar a pontuação e o nível - CORRIGIDO
function updateScore() {
  document.getElementById("score").innerText = `SCORE: ${String(
    player.score
  ).padStart(6, "0")}`;

  // Aumentar nível a cada 10 linhas
  const newLevel = Math.floor(lines / 10) + 1;
  if (newLevel > level) {
    level = newLevel;
    // Aumentar velocidade: diminuir o intervalo de queda
    dropInterval = Math.max(50, 1000 - (level - 1) * 100);
    updateLevel();
  }
}

// Função para atualizar o nível na interface HTML
function updateLevel() {
  levelElement.innerText = `LEVEL: ${level}`;
}

// Função para atualizar as linhas na interface HTML - NOVA
function updateLines() {
  linesElement.innerText = `LINES: ${lines}`;
}

// Atualizar a tela
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isPaused = false;

// Função de atualização - CORRIGIDA
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  if (!gameStarted) {
    drawStartScreen();
    requestAnimationFrame(update);
    return;
  }

  if (!isPaused) {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      playerDrop();
    }

    draw();
    updateParticles();
    drawParticles();
    updateScore();

    // Verificar game over
    if (collide(arena, player)) {
      gameOver();
      return;
    }
  } else {
    // Mesmo pausado, ainda desenha a tela
    draw();
    updateParticles();
    drawParticles();
  }

  requestAnimationFrame(update);
}

// Função para desenhar a tela de pause
function drawPauseScreen() {
  context.fillStyle = "rgba(0, 0, 0, 0.6)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#ff00cc");
  gradient.addColorStop(1, "#3333ff");

  context.strokeStyle = "#ff00cc";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(40, canvas.height / 2 - 70);
  context.lineTo(canvas.width - 40, canvas.height / 2 - 70);
  context.stroke();

  context.strokeStyle = "#3333ff";
  context.beginPath();
  context.moveTo(40, canvas.height / 2 + 70);
  context.lineTo(canvas.width - 40, canvas.height / 2 + 70);
  context.stroke();

  context.fillStyle = gradient;
  context.font = 'bold 48px "Courier New", monospace';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "#ff00cc";
  context.shadowBlur = 15;

  context.fillText("⏸ PAUSADO", canvas.width / 2, canvas.height / 2);

  context.shadowColor = "#00ffff";
  context.shadowBlur = 10;
  context.font = "16px monospace";
  context.fillText(
    "Pressione P para continuar",
    canvas.width / 2,
    canvas.height / 2 + 50
  );

  context.shadowBlur = 0;
}

// Criar a matriz do tetromino
function createPiece(type) {
  return TETROMINOS[type];
}

// Resetar o jogador - MODIFICADO
function resetPlayer() {
  // Se não há próxima peça, gerar uma
  if (!nextPiece) {
    nextPiece = getNextPiece();
  }

  // A peça atual se torna a próxima peça
  player.matrix = createPiece(nextPiece);

  // Gerar nova próxima peça
  nextPiece = getNextPiece();

  player.pos.y = 0;
  player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);

  if (collide(arena, player)) {
    gameOver();
  }
}

// Inicializar o jogo
let arena = createMatrix(COLS, ROWS);
let player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

// Função para desenhar a tela de Game Over
function drawGameOverScreen() {
  context.fillStyle = "rgba(0, 0, 0, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#ff00cc");
  gradient.addColorStop(1, "#3333ff");

  context.strokeStyle = "#ff00cc";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(40, canvas.height / 2 - 70);
  context.lineTo(canvas.width - 40, canvas.height / 2 - 70);
  context.stroke();

  context.strokeStyle = "#3333ff";
  context.beginPath();
  context.moveTo(40, canvas.height / 2 + 70);
  context.lineTo(canvas.width - 40, canvas.height / 2 + 70);
  context.stroke();

  context.fillStyle = gradient;
  context.font = 'bold 32px "Courier New", monospace';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "#ff00cc";
  context.shadowBlur = 15;

  context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

  const currentScoreText = `Score: ${player.score}`;
  const linesText = `Lines: ${lines}`;
  const levelText = `Level: ${level}`;
  const highScoreText = `High Score: ${highScore}`;

  context.shadowColor = "#00ffff";
  context.shadowBlur = 10;
  context.font = 'bold 16px "Courier New", monospace';
  context.fillText(currentScoreText, canvas.width / 2, canvas.height / 2 + 10);
  context.fillText(linesText, canvas.width / 2, canvas.height / 2 + 30);
  context.fillText(levelText, canvas.width / 2, canvas.height / 2 + 50);
  context.fillText(highScoreText, canvas.width / 2, canvas.height / 2 + 70);

  context.shadowBlur = 0;
  context.fillStyle = "#ffffff";
  context.font = '12px "Courier New", monospace';
  context.fillText(
    "Aperte 'Enter' para reiniciar",
    canvas.width / 2,
    canvas.height / 2 + 100
  );
}

function startGame() {
  gameStarted = true;
  player.score = 0;
  level = 1;
  lines = 0;
  dropInterval = 1000;

  // Resetar sistema de peças
  pieceQueue = [];
  nextPiece = null;

  arena.forEach((row) => row.fill(0));
  resetPlayer();
  updateLevel();
  updateLines();
}

function restartGame() {
  startGame();
}

function gameOver() {
  gameOverSound.play();
  saveHighScore();
  drawGameOverScreen();
  gameStarted = false;
  isPaused = false;

  // Limpar o canvas da próxima peça
  nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
}

function saveHighScore() {
  const currentScore = player.score;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("vatrisHighScore", highScore);
  }
}

// Sistema de Highscore com LocalStorage - CORRIGIDO
let highScore = localStorage.getItem("vatrisHighScore") || 0;

// Eventos de teclado - CORRIGIDOS
document.addEventListener("keydown", (event) => {
  // Pausar/Despausar
  if ((event.key === "p" || event.key === "P") && gameStarted) {
    isPaused = !isPaused;
    return;
  }

  // Tela inicial
  if (!gameStarted && event.key === "Enter") {
    startGame();
    return;
  }

  // Controles do jogo (apenas quando não pausado)
  if (gameStarted && !isPaused) {
    switch (event.key) {
      case "ArrowLeft":
        playerMove(-1);
        break;
      case "ArrowRight":
        playerMove(1);
        break;
      case "ArrowDown":
        playerDrop();
        break;
      case "ArrowUp":
        playerRotate(1);
        break;
    }
  }
});

// Iniciar o jogo
resetPlayer();
update();
