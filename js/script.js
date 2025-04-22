// script.js - VATЯIS Vaporwave Tetris Game Logic with Sound Effects

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 600;
let hue = 0;
let gameStarted = false;
let startScreenFrame = 0;
let showPressEnter = true;
let lastBlink = 0;

//Variáveis para animação do pause
let pauseAnimationAlpha = 0;
let pauseDirection = 1;

// Variável de nível
let level = 1;
const levelElement = document.getElementById('level'); // Pegue o elemento do nível no HTML

// Constantes
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    null,
    '#ff6ec7', // T - pink neon
    '#00fff7', // I - ciano elétrico
    '#7dffb3', // S - verde menta glitch
    '#ffe600', // Z - amarelo neon vibrante
    '#6a5acd', // L - roxo elétrico (blue violet)
    '#ff8c00', // J - laranja neon queimado
    '#ff0055'  // O - magenta quente/rosado glitch
];

// Carregar sons
const moveSound = new Audio('sounds/move.wav');
const rotateSound = new Audio('sounds/rotate.wav');
const lockSound = new Audio('sounds/lock.wav');
const gameOverSound = new Audio('sounds/gameover.mp3');
const lineClearSound = new Audio('sounds/lineClear.wav');

// Carregar imagens
const introImage = new Image();
introImage.src = 'imgs/intro.jpg';

const gameImage = new Image();
gameImage.src = 'imgs/fundo.jpg';


// Tetrominos
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
    gradient.addColorStop(0, '#ff00cc');
    gradient.addColorStop(1, '#00ffff');

    const dropY = Math.min(centerY - 50, -100 + startScreenFrame * 4); // "queda"
    startScreenFrame += 1;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 50px "Courier New", monospace';

    drawGlitchText(title, centerX, dropY, gradient);

    // Efeito de piscar no "Aperte Enter"
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

// Efeito glitch: múltiplas camadas ligeiramente deslocadas
function drawGlitchText(text, x, y, fillStyle, shadowBlur = 20) {
    context.fillStyle = fillStyle;
    context.shadowColor = '#ff00cc';
    context.shadowBlur = shadowBlur;

    // Camada principal
    context.fillText(text, x, y);

    // Camadas RGB deslocadas (efeito glitch leve)
    context.shadowBlur = 0;
    context.fillStyle = 'rgba(255, 0, 255, 0.4)'; // magenta
    context.fillText(text, x + 2, y - 1);

    context.fillStyle = 'rgba(0, 255, 255, 0.4)'; // ciano
    context.fillText(text, x - 2, y + 1);
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
        context.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = '#222';
        context.strokeRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
    matrix.forEach(row => row.reverse());
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

// Funções de movimento do jogador
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

// Limpar linhas completas
function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) continue outer;
    }
    // Animação para linhas eliminadas
    setTimeout(() => {
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      y++;
      lineClearSound.play();
    }, 100);

    player.score += rowCount * 100;
    rowCount *= 2;
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

    if (isPaused) {
    drawPauseScreen();
    }
}

// Atualizar a pontuação e o nível
function updateScore() {
    document.getElementById('score').innerText = `SCORE: ${String(player.score).padStart(6, '0')}`;

    // Incrementar nível a cada 1000 pontos
    if (player.score >= level * 1000) {
      level++;
      dropInterval = Math.max(100, dropInterval - 100);  // Diminui a velocidade (aumenta a dificuldade)
      updateLevel();  // Atualiza o nível na tela
    }
}

// Função para atualizar o nível na interface HTML
function updateLevel() {
    levelElement.innerText = `LEVEL: ${level}`;
}

// Atualizar a tela
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let isPaused = false;

// Função de atualização
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
            dropCounter = 0;
        }
    }

    draw();
    updateScore();
    requestAnimationFrame(update);
}

// Função para desenhar a tela de pause
function drawPauseScreen() {
    // Fundo translúcido
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Criar gradiente no texto
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff00cc'); // rosa neon
    gradient.addColorStop(1, '#3333ff'); // azul neon

    // Desenhar linhas decorativas estilo vaporwave
    context.strokeStyle = '#ff00cc';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(40, canvas.height / 2 - 70);
    context.lineTo(canvas.width - 40, canvas.height / 2 - 70);
    context.stroke();

    context.strokeStyle = '#3333ff';
    context.beginPath();
    context.moveTo(40, canvas.height / 2 + 70);
    context.lineTo(canvas.width - 40, canvas.height / 2 + 70);
    context.stroke();

    // Configurar estilo do texto
    context.fillStyle = gradient;
    context.font = 'bold 48px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#ff00cc';
    context.shadowBlur = 15;

    // Texto principal
    context.fillText('⏸ PAUSADO', canvas.width / 2, canvas.height / 2);

    // Texto complementar em estilo glitch
    context.shadowColor = '#00ffff';
    context.shadowBlur = 10;
    context.font = '16px monospace';
    context.fillText('Pressione P para continuar', canvas.width / 2, canvas.height / 2 + 50);

    // Resetar sombra
    context.shadowBlur = 0;
}

// Criar a matriz do tetromino
function createPiece(type) {
  return TETROMINOS[type];
}

// Resetar o jogador
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

// Inicializar o jogo
const arena = createMatrix(COLS, ROWS);
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0
};

// Adicionar eventos de teclado
document.addEventListener('keydown', event => {
    if (!gameStarted && event.key === 'Enter') {
      gameStarted = true;
      resetPlayer();
      update(); // Inicia a animação do jogo
    } else if (gameStarted) {
      if (event.key === 'ArrowLeft') playerMove(-1);
      else if (event.key === 'ArrowRight') playerMove(1);
      else if (event.key === 'ArrowDown') playerDrop();
      else if (event.key === 'ArrowUp') playerRotate(1);
      else if (event.key === 'p' || event.key === 'P') isPaused = !isPaused;
      else if (event.key === 'r' || event.key === 'R') resetPlayer();
    }
});

// Sistema de Highscore com LocalStorage
let highScore = localStorage.getItem('vatrisHighScore') || 0;
if (player.score > highScore) {
  localStorage.setItem('vatrisHighScore', player.score);
}

// Iniciar o jogo
resetPlayer();
update();
