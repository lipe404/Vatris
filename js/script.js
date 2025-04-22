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

// Variáveis para animação do pause
let pauseAnimationAlpha = 0;
let pauseDirection = 1;

// Variável de nível
let level = 1;
const levelElement = document.getElementById('level');

// Constantes
const particles = [];
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

    const dropY = Math.min(centerY - 50, -100 + startScreenFrame * 4);
    startScreenFrame += 1;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
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
    context.shadowColor = '#ff00cc';
    context.shadowBlur = shadowBlur;
    context.fillText(text, x, y);

    context.shadowBlur = 0;
    context.fillStyle = 'rgba(255, 0, 255, 0.4)';
    context.fillText(text, x + 2, y - 1);

    context.fillStyle = 'rgba(0, 255, 255, 0.4)';
    context.fillText(text, x - 2, y + 1);
}

// Partículas de distorção
// Partículas de distorção mais estilizadas
function createGlitchParticles(x, y) {
  const numParticles = 30;  // Aumentar o número de partículas para mais intensidade visual
  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * Math.PI * 2; // Adicionando uma direção aleatória para cada partícula
    const speed = Math.random() * 2 + 1; // Variedade de velocidades para dar mais imprevisibilidade
    const size = Math.random() * 3 + 2; // Variar o tamanho para dar mais dinamicidade

    particles.push({
      x: x * BLOCK_SIZE + Math.cos(angle) * Math.random() * BLOCK_SIZE,
      y: y * BLOCK_SIZE + Math.sin(angle) * Math.random() * BLOCK_SIZE,
      size: size,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      life: Math.random() * 40 + 20, // Tempo de vida mais variado
      color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 30}%)`, // Cores mais suaves para um efeito mais estético
      alpha: 1,
      glow: Math.random() * 2 + 0.5  // Adicionando um efeito de brilho
    });
  }
}

// Atualizar e desenhar as partículas com novos efeitos
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.size *= 0.97;  // Diminuição mais suave para um efeito gradual de encolhimento
    particle.alpha -= 0.03;  // Efeito de desvanecimento mais suave
    particle.glow -= 0.05; // O brilho das partículas vai diminuindo com o tempo

    if (particle.alpha <= 0 || particle.size <= 0 || particle.glow <= 0) {
      particles.splice(i, 1);  // Remove as partículas que morreram
    }
  }
}

// Desenhar as partículas com um efeito de brilho dinâmico
function drawParticles() {
  particles.forEach(particle => {
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

    // Efeito de brilho nas partículas
    context.shadowBlur = 15; // Brilho suave
    context.shadowColor = particle.color; // Cor do brilho da partícula
    context.fillStyle = particle.color;

    // Desenha a partícula com transparência variável
    context.globalAlpha = particle.alpha;

    context.fill();
  });
  context.globalAlpha = 1; // Resetando o alpha após desenhar as partículas
  context.shadowBlur = 0; // Resetando o brilho
  context.shadowColor = 'transparent'; // Resetando a cor do brilho
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

    // Gerar partículas de glitch na linha que foi apagada
    createGlitchParticles(0, y);

    setTimeout(() => {
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
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

    if (player.score >= level * 1000) {
      level++;
      dropInterval = Math.max(100, dropInterval - 100);
      updateLevel();
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
    updateParticles();
    drawParticles();
    updateScore();

    if (player.score < 0 || collide(arena, player)) {
        gameOver();
    } else {
        requestAnimationFrame(update);
    }
}

// Função para desenhar a tela de pause
function drawPauseScreen() {
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff00cc');
    gradient.addColorStop(1, '#3333ff');

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

    context.fillStyle = gradient;
    context.font = 'bold 48px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#ff00cc';
    context.shadowBlur = 15;

    context.fillText('⏸ PAUSADO', canvas.width / 2, canvas.height / 2);

    context.shadowColor = '#00ffff';
    context.shadowBlur = 10;
    context.font = '16px monospace';
    context.fillText('Pressione P para continuar', canvas.width / 2, canvas.height / 2 + 50);

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
    gameOverSound.play();
    saveHighScore();
    gameStarted = false;
  }
}

// Inicializar o jogo
let arena = createMatrix(COLS, ROWS);
let player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0
};

//Função para desenhar a tela de Game Over
function drawGameOverScreen() {
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff00cc');
    gradient.addColorStop(1, '#3333ff');

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

    context.fillStyle = gradient;
    context.font = 'bold 48px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#ff00cc';
    context.shadowBlur = 15;

    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    const currentScoreText = `Sua Pontuação: ${player.score}`;
    const highScoreText = `Pontuação Mais Alta: ${highScore}`;

    context.shadowColor = '#00ffff';
    context.shadowBlur = 10;
    context.font = 'bold 24px "Courier New", monospace';
    context.fillText(currentScoreText, canvas.width / 2, canvas.height / 2 + 30);
    context.fillText(highScoreText, canvas.width / 2, canvas.height / 2 + 70);

    context.shadowBlur = 0;
    context.fillStyle = '#ffffff';
    context.font = '16px "Courier New", monospace';
    context.fillText("Aperte 'Enter' para reiniciar", canvas.width / 2, canvas.height / 2 + 120);
}

function startGame() {
    gameStarted = true;
    player.score = 0;
    arena.forEach(row => row.fill(0));
    resetPlayer();
    update();
}

function restartGame() {
    player.score = 0;
    arena.forEach(row => row.fill(0));
    resetPlayer();
    update();
}

function gameOver() {
    gameOverSound.play();
    saveHighScore();
    drawGameOverScreen();
    gameStarted = false;
}

function saveHighScore() {
    const currentScore = player.score;
    let highScore = localStorage.getItem('highScore') || 0;

    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
    }
}

// Sistema de Highscore com LocalStorage
let highScore = localStorage.getItem('vatrisHighScore') || 0;
if (player.score > highScore) {
  localStorage.setItem('vatrisHighScore', player.score);
}

// Adicionar evento de teclado para alternar pausa
document.addEventListener('keydown', (event) => {
  if (event.key === 'p' || event.key === 'P') {
      isPaused = !isPaused;
      if (!isPaused) {
          // Se o jogo foi despausado, continue com o fluxo normal
          lastTime = performance.now();
          requestAnimationFrame(update);
      }
  }
});

// Adicionar eventos de teclado
document.addEventListener('keydown', event => {
    if (!gameStarted && event.key === 'Enter') {
        startGame();
    }
    else if (gameStarted && !isPaused) {
        if (event.key === 'ArrowLeft') playerMove(-1);
        else if (event.key === 'ArrowRight') playerMove(1);
        else if (event.key === 'ArrowDown') playerDrop();
        else if (event.key === 'ArrowUp') playerRotate(1);
    }
    else if (!gameStarted && event.key === 'Enter') {
        restartGame();
    }
});

// Iniciar o jogo
resetPlayer();
update();