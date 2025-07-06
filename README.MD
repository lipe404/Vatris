
VATЯIS - Vaporwave Tetris Game

🌈 Um Tetris com estética Vaporwave desenvolvido com HTML5, CSS3 e JavaScript puro
📋 Índice

    🎯 Sobre o Projeto
    ✨ Funcionalidades
    🎨 Design e Estética
    🎮 Como Jogar
    🛠️ Tecnologias Utilizadas
    📁 Estrutura do Projeto
    🚀 Como Executar
    🎵 Recursos de Áudio
    📱 Responsividade
    🏆 Sistema de Pontuação
    🔧 Funcionalidades Técnicas
    🎯 Próximas Funcionalidades
    🤝 Contribuindo
    📄 Licença
    👨‍💻 Desenvolvedor

🎯 Sobre o Projeto

VATЯIS é uma reimaginação moderna do clássico jogo Tetris, desenvolvido com uma estética Vaporwave única. O jogo combina a jogabilidade tradicional do Tetris com elementos visuais futuristas, cores neon vibrantes e efeitos especiais que criam uma experiência nostálgica e imersiva.
🌟 Destaques

    🎨 Estética Vaporwave completa com cores neon e efeitos glitch
    🎵 Efeitos sonoros imersivos para cada ação
    ⚡ Performance otimizada usando Canvas HTML5
    🎮 Jogabilidade clássica com melhorias modernas
    📱 Design responsivo para diferentes dispositivos
    💾 Sistema de high score com localStorage

✨ Funcionalidades
🎮 Gameplay Core

    ✅ Mecânicas clássicas do Tetris - Movimento, rotação e queda das peças
    ✅ 7 tipos de Tetrominos - I, J, L, O, S, T, Z com cores únicas
    ✅ Sistema de níveis - Velocidade aumenta progressivamente
    ✅ Contador de linhas - Acompanhe seu progresso
    ✅ Preview da próxima peça - Planeje suas jogadas
    ✅ Sistema de pause - Pause/despause com a tecla 'P'

🎨 Efeitos Visuais

    🌈 Animações neon - Texto e bordas com brilho pulsante
    ⚡ Partículas de glitch - Efeitos especiais ao eliminar linhas
    🎭 Animações de transição - Movimentos suaves e fluidos
    🌟 Efeitos de fundo - Estrelas animadas e gradientes dinâmicos
    🔮 Tela de início estilizada - Com animações de entrada

🎵 Sistema de Áudio

    🔊 Efeitos sonoros para movimento, rotação e travamento
    🎶 Som de linha eliminada - Feedback auditivo satisfatório
    💀 Som de game over - Áudio dramático para o fim do jogo
    🔇 Carregamento otimizado - Preload de todos os áudios

🎨 Design e Estética
🌈 Paleta de Cores Vaporwave

css

/_ Cores principais _/
#ff6ec7 /_ T-piece - Pink Neon _/
#00fff7 /_ I-piece - Cyan Elétrico _/
#7dffb3 /_ S-piece - Verde Menta _/
#ffe600 /_ Z-piece - Amarelo Neon _/
#6a5acd /_ L-piece - Roxo Elétrico _/
#ff8c00 /_ J-piece - Laranja Neon _/
#ff0055 /_ O-piece - Magenta Quente _/

🎭 Elementos Visuais

    Fonte: Press Start 2P (estilo retrô pixelado)
    Animações: Glitch effects, neon glow, border pulsing
    Backgrounds: Gradientes radiais com efeito de profundidade
    Partículas: Sistema de partículas para feedback visual

🎮 Como Jogar
🕹️ Controles
Tecla Ação
← Mover peça para esquerda
→ Mover peça para direita
↓ Acelerar queda da peça
↑ Rotacionar peça
P Pausar/Despausar jogo
Enter Iniciar jogo / Reiniciar
🎯 Objetivos

    Elimine linhas - Complete linhas horizontais para pontuar
    Suba de nível - A cada 10 linhas eliminadas
    Bata recordes - Seu high score é salvo automaticamente
    Sobreviva - Evite que as peças cheguem ao topo

📊 Sistema de Pontuação

    1 linha: 100 × nível atual
    2 linhas: 200 × nível atual
    3 linhas: 300 × nível atual
    4 linhas (Tetris): 400 × nível atual

🛠️ Tecnologias Utilizadas
Tecnologia Versão Uso
HTML5 Latest Estrutura e Canvas
CSS3 Latest Estilização e Animações
JavaScript ES6+ Lógica do jogo
Canvas API HTML5 Renderização gráfica
Web Audio API HTML5 Efeitos sonoros
LocalStorage HTML5 Persistência de dados
🔧 APIs Utilizadas

    Canvas 2D Context - Renderização de gráficos
    RequestAnimationFrame - Loop de animação otimizado
    LocalStorage - Salvamento de high scores
    Audio API - Reprodução de efeitos sonoros

📁 Estrutura do Projeto

VATRIS/
├── 📄 index.html # Página principal
├── 📄 README.md # Documentação
├── 📁 styles/
│ └── 📄 style.css # Estilos e animações
├── 📁 js/
│ └── 📄 script.js # Lógica do jogo
├── 📁 sounds/
│ ├── 🔊 move.wav # Som de movimento
│ ├── 🔊 rotate.wav # Som de rotação
│ ├── 🔊 lock.wav # Som de travamento
│ ├── 🔊 lineClear.wav # Som de linha eliminada
│ └── 🔊 gameover.mp3 # Som de game over
└── 📁 imgs/
├── 🖼️ intro.jpg # Imagem da tela inicial
├── 🖼️ fundo.jpg # Imagem de fundo do jogo
└── 🖼️ stars-pixelated.png # Textura de estrelas

🚀 Como Executar
📋 Pré-requisitos

    Navegador web moderno (Chrome, Firefox, Safari, Edge)
    Servidor web local (opcional, mas recomendado)

🔧 Instalação

    Clone o repositório

bash

git clone https://github.com/lipe404/vatris.git
cd vatris

    Opção 1: Servidor local simples

bash

# Com Python 3

python -m http.server 8000

# Com Node.js (http-server)

npx http-server

# Com PHP

php -S localhost:8000

    Opção 2: Abrir diretamente

bash

# Abra o arquivo index.html no navegador

open index.html # macOS
start index.html # Windows
xdg-open index.html # Linux

    Acesse o jogo

http://localhost:8000

⚡ Execução Rápida

Para testar rapidamente, você pode abrir o arquivo index.html diretamente no navegador, mas algumas funcionalidades podem não funcionar corretamente devido às políticas de CORS.
🎵 Recursos de Áudio
🔊 Efeitos Sonoros Incluídos
Arquivo Evento Descrição
move.wav Movimento Som ao mover peça
rotate.wav Rotação Som ao rotacionar peça
lock.wav Travamento Som ao fixar peça
lineClear.wav Linha eliminada Som ao completar linha
gameover.mp3 Game Over Som de fim de jogo
🎛️ Configuração de Áudio

    Preload: Todos os áudios são pré-carregados
    Formato: WAV para efeitos curtos, MP3 para áudios longos
    Volume: Otimizado para não ser intrusivo

📱 Responsividade
📐 Breakpoints
Dispositivo Largura Ajustes
Desktop > 500px Layout completo
Tablet ≤ 500px HUD reduzido (85%)
Mobile ≤ 400px Next piece oculto
🎨 Adaptações Mobile

    Fontes redimensionadas automaticamente
    HUD compacto para telas pequenas
    Elementos não essenciais ocultados quando necessário

🏆 Sistema de Pontuação
📊 Mecânicas de Pontuação

javascript

// Fórmula de pontuação
pontos = linhas_eliminadas × 100 × nível_atual

// Progressão de nível
novo_nível = Math.floor(total_linhas / 10) + 1

// Velocidade
velocidade = Math.max(50, 1000 - (nível - 1) × 100)

🎯 Exemplos de Pontuação
Linhas Nível 1 Nível 5 Nível 10
1 linha 100 pts 500 pts 1000 pts
2 linhas 200 pts 1000 pts 2000 pts
3 linhas 300 pts 1500 pts 3000 pts
4 linhas 400 pts 2000 pts 4000 pts
🔧 Funcionalidades Técnicas
⚙️ Otimizações Implementadas

    RequestAnimationFrame - Loop de jogo otimizado
    Canvas separado - Preview da próxima peça em canvas dedicado
    Bag System - Distribuição equilibrada de peças
    Particle System - Efeitos visuais eficientes
    LocalStorage - Persistência de high scores

🎮 Algoritmos Principais

javascript

// Sistema de colisão
function collide(arena, player) {
// Detecção pixel-perfect de colisão
}

// Rotação com Wall Kick
function playerRotate(dir) {
// Rotação inteligente com correção de posição
}

// Limpeza de linhas otimizada
function arenaSweep() {
// Algoritmo eficiente para detectar e remover linhas
}

🎯 Próximas Funcionalidades
🚀 Roadmap de Desenvolvimento

    Sistema de Hold - Guardar peça para usar depois
    Ghost Piece - Sombra mostrando onde a peça vai cair
    Modos de jogo - Sprint, Marathon, Puzzle
    Multiplayer local - Dois jogadores simultâneos
    Conquistas - Sistema de achievements
    Temas alternativos - Outras paletas de cores
    Controles touch - Suporte para dispositivos móveis
    Replay system - Salvar e reproduzir partidas
    Estatísticas detalhadas - Gráficos de performance
    PWA - Funcionalidade offline

💡 Ideias Futuras

    Modo Zen - Jogo relaxante sem pressão de tempo
    Modo Caos - Peças especiais e efeitos malucosos
    Editor de níveis - Criar situações customizadas
    Integração social - Compartilhar pontuações
    Trilha sonora - Música de fundo dinâmica

🤝 Contribuindo
🛠️ Como Contribuir

    Fork o projeto
    Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
    Commit suas mudanças (git commit -m 'Add some AmazingFeature')
    Push para a branch (git push origin feature/AmazingFeature)
    Abra um Pull Request

📝 Diretrizes de Contribuição

    Mantenha o código limpo e comentado
    Siga o padrão de nomenclatura existente
    Teste suas mudanças antes de submeter
    Atualize a documentação quando necessário

🐛 Reportando Bugs

Use as para reportar bugs, incluindo:

    Descrição detalhada do problema
    Passos para reproduzir
    Comportamento esperado vs atual
    Screenshots (se aplicável)

📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

MIT License

Copyright (c) 2024 Felipe Toledo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

👨‍💻 Desenvolvedor
Generated Felipe Toledo

🎮 Divirta-se jogando VATЯIS! 🌈

Se você gostou do projeto, não esqueça de dar uma ⭐!
Feito com ❤️ e muito ☕ por Felipe Toledo.
