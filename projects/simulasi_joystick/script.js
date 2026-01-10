// ===== DARK MODE TOGGLE (In-Memory State) =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
let currentTheme = 'light';

body.setAttribute('data-theme', currentTheme);
updateButtonText(currentTheme);

themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', currentTheme);
  updateButtonText(currentTheme);
});

function updateButtonText(theme) {
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

// ===== NAVIGATION CONTROLS =====
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
const gameSection = document.getElementById('game-section');
const btnDesktop = document.getElementById('btn-desktop');
const btnMobile = document.getElementById('btn-mobile');
const btnShowGame = document.getElementById('btn-show-game');
const btnBackSimulator = document.getElementById('btn-back-simulator');

btnDesktop?.addEventListener('click', () => {
  startScreen?.classList.add('hidden');
  mainContent?.classList.remove('hidden');
  body.classList.remove('mobile-mode');
});

btnMobile?.addEventListener('click', () => {
  startScreen?.classList.add('hidden');
  mainContent?.classList.remove('hidden');
  body.classList.add('mobile-mode');
});

btnShowGame?.addEventListener('click', () => {
  mainContent?.classList.add('hidden');
  gameSection?.classList.remove('hidden');
  startMiniGame();
});

btnBackSimulator?.addEventListener('click', () => {
  gameSection?.classList.add('hidden');
  mainContent?.classList.remove('hidden');
  stopMiniGame();
});

// ===== CONSTANTS & STATE =====
const CONFIG = {
  WIDTH: 350,
  HEIGHT: 350,
  RADIUS: 120,
  KNOB_SIZE: 25,
  MAX_OUTPUT: 1600,
  HALL_NOISE: 50,
  TMR_NOISE: 10,
  DEADZONE: 100,
  ANALOG_NOISE: 50,
  MINI_WIDTH: 150,
  MINI_HEIGHT: 150,
  MINI_RADIUS: 50,
  MINI_KNOB_SIZE: 15,
  MAX_DATA_POINTS: 200,
  SMOOTHING_FACTOR: 0.2,
  GAME_CAR_SPEED: 5,
  GAME_CANVAS_WIDTH: 800,
  GAME_CANVAS_HEIGHT: 600
};

const sensorData = {
  hall: [],
  tmr: [],
  analog: []
};

const gameState = {
  carX: 400,
  carY: 300,
  coins: [],
  score: 0,
  running: false,
  animationFrame: null
};

// ===== UTILITY FUNCTIONS =====
function calculateAvgNoise(data, target) {
  if (data.length === 0) return 0;
  const deviations = data.map(val => Math.abs(val - target));
  return Math.round(deviations.reduce((a, b) => a + b, 0) / deviations.length);
}

function calculateAccuracy(avgNoise) {
  return Math.max(0, Math.round(100 - (avgNoise / 16)));
}

function addDataPoint(array, value, maxLength = 100) {
  array.push(value);
  if (array.length > maxLength) array.shift();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ===== JOYSTICK CREATOR =====
function createJoystick(canvasId, labelId, onMove, type, isMini = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas ${canvasId} not found`);
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const width = isMini ? CONFIG.MINI_WIDTH : CONFIG.WIDTH;
  const height = isMini ? CONFIG.MINI_HEIGHT : CONFIG.HEIGHT;
  const radius = isMini ? CONFIG.MINI_RADIUS : CONFIG.RADIUS;
  const knobSize = isMini ? CONFIG.MINI_KNOB_SIZE : CONFIG.KNOB_SIZE;
  const maxOutput = CONFIG.MAX_OUTPUT;
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  let knobX = centerX;
  let knobY = centerY;
  let isDragging = false;
  let animationFrame = null;

  function drawOuterCircle() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const borderColor = getComputedStyle(document.body).getPropertyValue('--border-color') || '#2c3e50';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawKnob() {
    ctx.beginPath();
    ctx.arc(knobX, knobY, knobSize, 0, 2 * Math.PI);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function redraw() {
    ctx.clearRect(0, 0, width, height);
    drawOuterCircle();
    drawKnob();
  }

  function moveKnob(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius) {
      const scale = radius / dist;
      dx *= scale;
      dy *= scale;
    }

    knobX = centerX + dx;
    knobY = centerY + dy;

    redraw();

    let normX = Math.round((dx / radius) * maxOutput);
    let normY = Math.round((dy / radius) * maxOutput);

    if (type === 'analog') {
      if (Math.abs(normX) < CONFIG.DEADZONE) normX = 0;
      if (Math.abs(normY) < CONFIG.DEADZONE) normY = 0;
    }

    onMove(normX, normY, type);
  }

  function smoothCenter() {
    if (isDragging) return;

    const dx = centerX - knobX;
    const dy = centerY - knobY;

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      knobX = centerX;
      knobY = centerY;
      redraw();
      return;
    }

    knobX += dx * CONFIG.SMOOTHING_FACTOR;
    knobY += dy * CONFIG.SMOOTHING_FACTOR;

    redraw();
    animationFrame = requestAnimationFrame(smoothCenter);
  }

  const handleStart = (e) => {
    isDragging = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    const touch = e.touches ? e.touches[0] : e;
    moveKnob(touch.clientX, touch.clientY);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    moveKnob(touch.clientX, touch.clientY);
  };

  const handleEnd = () => {
    isDragging = false;
    smoothCenter();
  };

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', handleEnd);
  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  canvas.addEventListener('touchend', handleEnd);

  redraw();
}

// ===== GRAPH CREATOR =====
function createGraph(canvasId, datasets) {
  const graphCanvas = document.getElementById(canvasId);
  if (!graphCanvas) {
    console.warn(`Graph canvas ${canvasId} not found`);
    return () => {};
  }
  
  const chart = new Chart(graphCanvas, {
    type: 'line',
    data: {
      labels: [],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      elements: {
        point: { radius: 0 },
        line: { borderWidth: 2, tension: 0.1 }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid: { display: true, color: 'rgba(128,128,128,0.2)' },
          ticks: { display: false }
        },
        y: {
          min: -1600,
          max: 1600,
          grid: { display: true, color: 'rgba(128,128,128,0.2)' }
        }
      },
      plugins: {
        tooltip: { enabled: true, mode: 'index', intersect: false },
        legend: { display: true, position: 'top' },
        zoom: {
          zoom: { 
            wheel: { enabled: true }, 
            pinch: { enabled: true }, 
            mode: 'xy' 
          },
          pan: { enabled: true, mode: 'xy' }
        }
      }
    }
  });

  let timeStep = 0;

  return function updateGraph(values) {
    timeStep++;
    chart.data.labels.push(timeStep);
    
    datasets.forEach((dataset, index) => {
      if (values[index] !== undefined) {
        dataset.data.push(values[index]);
      }
    });

    if (chart.data.labels.length > CONFIG.MAX_DATA_POINTS) {
      chart.data.labels.shift();
      datasets.forEach(dataset => dataset.data.shift());
    }

    chart.update('none');
  };
}

// ===== SENSOR HANDLERS =====
function createSensorHandler(type, labelId, statsId, updateGraphFn) {
  return (normX, normY) => {
    const label = document.getElementById(labelId);
    const stats = document.getElementById(statsId);
    
    let outputX = normX;
    let originalX = normX;
    
    if (type === 'hall') {
      outputX += Math.floor(Math.random() * (CONFIG.HALL_NOISE * 2 + 1)) - CONFIG.HALL_NOISE;
    } else if (type === 'tmr') {
      const jitter = Math.sin(Date.now() / 100) * 5;
      outputX += Math.floor(Math.random() * (CONFIG.TMR_NOISE * 2 + 1)) - CONFIG.TMR_NOISE + jitter;
    } else if (type === 'analog') {
      if (Math.abs(normX) < CONFIG.DEADZONE) {
        originalX = 0;
        normX = 0;
      }
      outputX = normX + Math.floor(Math.random() * (CONFIG.ANALOG_NOISE * 2 + 1)) - CONFIG.ANALOG_NOISE;
    }
    
    if (label) {
      const displayX = type === 'tmr' ? Math.round(outputX) : outputX;
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      label.textContent = `${typeLabel}: X=${displayX}  Y=${normY}`;
    }
    
    addDataPoint(sensorData[type], outputX);
    
    if (stats) {
      const avgNoise = calculateAvgNoise(sensorData[type], originalX);
      const accuracy = calculateAccuracy(avgNoise);
      stats.textContent = `Avg Noise: ${avgNoise} | Accuracy: ${accuracy}%`;
    }
    
    if (updateGraphFn) updateGraphFn([outputX]);
  };
}

// ===== INITIALIZE SENSORS =====
const updateGraph1 = createGraph('graph-canvas1', [
  { label: 'Hall X', data: [], borderColor: '#3498db', fill: false }
]);
createJoystick('joystick-canvas1', 'label-hall', 
  createSensorHandler('hall', 'label-hall', 'stats-hall', updateGraph1), 'hall');

const updateGraph2 = createGraph('graph-canvas2', [
  { label: 'TMR X', data: [], borderColor: '#2ecc71', fill: false }
]);
createJoystick('joystick-canvas2', 'label-tmr',
  createSensorHandler('tmr', 'label-tmr', 'stats-tmr', updateGraph2), 'tmr');

const updateGraph3 = createGraph('graph-canvas3', [
  { label: 'Analog X', data: [], borderColor: '#e67e22', fill: false }
]);
createJoystick('joystick-canvas3', 'label-analog',
  createSensorHandler('analog', 'label-analog', 'stats-analog', updateGraph3), 'analog');

// ===== COMPARISON JOYSTICK =====
const updateGraph4 = createGraph('graph-canvas4', [
  { label: 'Hall X', data: [], borderColor: '#3498db', fill: false },
  { label: 'TMR X', data: [], borderColor: '#2ecc71', fill: false },
  { label: 'Analog X', data: [], borderColor: '#e67e22', fill: false }
]);

createJoystick('joystick-canvas4', 'label-comp-hall', (normX, normY) => {
  // Hall sensor
  const hallX = normX + Math.floor(Math.random() * (CONFIG.HALL_NOISE * 2 + 1)) - CONFIG.HALL_NOISE;
  const hallLabel = document.getElementById('label-comp-hall');
  if (hallLabel) hallLabel.textContent = `Hall: X=${hallX}  Y=${normY}`;
  addDataPoint(sensorData.hall, hallX);
  const hallAvgNoise = calculateAvgNoise(sensorData.hall, normX);

  // TMR sensor
  const jitter = Math.sin(Date.now() / 100) * 5;
  const tmrX = normX + Math.floor(Math.random() * (CONFIG.TMR_NOISE * 2 + 1)) - CONFIG.TMR_NOISE + jitter;
  const tmrLabel = document.getElementById('label-comp-tmr');
  if (tmrLabel) tmrLabel.textContent = `TMR: X=${Math.round(tmrX)}  Y=${normY}`;
  addDataPoint(sensorData.tmr, tmrX);
  const tmrAvgNoise = calculateAvgNoise(sensorData.tmr, normX);

  // Analog sensor
  let analogNormX = normX;
  if (Math.abs(analogNormX) < CONFIG.DEADZONE) analogNormX = 0;
  const analogX = analogNormX + Math.floor(Math.random() * (CONFIG.ANALOG_NOISE * 2 + 1)) - CONFIG.ANALOG_NOISE;
  const analogLabel = document.getElementById('label-comp-analog');
  if (analogLabel) analogLabel.textContent = `Analog: X=${analogX}  Y=${normY}`;
  addDataPoint(sensorData.analog, analogX);
  const analogAvgNoise = calculateAvgNoise(sensorData.analog, analogNormX);

  // Update stats
  const statsComp = document.getElementById('stats-comp');
  if (statsComp) {
    statsComp.textContent = `Hall Noise: ${hallAvgNoise} | TMR Noise: ${tmrAvgNoise} | Analog Noise: ${analogAvgNoise}`;
  }

  // Update graph
  updateGraph4([hallX, tmrX, analogX]);

  // Update game car if running
  if (gameState.running) {
    gameState.carX += (normX / CONFIG.MAX_OUTPUT) * CONFIG.GAME_CAR_SPEED;
    gameState.carY += (normY / CONFIG.MAX_OUTPUT) * CONFIG.GAME_CAR_SPEED;
    gameState.carX = clamp(gameState.carX, 20, CONFIG.GAME_CANVAS_WIDTH - 20);
    gameState.carY = clamp(gameState.carY, 20, CONFIG.GAME_CANVAS_HEIGHT - 20);
  }
}, 'comparison');

// ===== MINI JOYSTICKS FOR GAME =====
function createGameJoystick(canvasId, applyDeadzone = false) {
  createJoystick(canvasId, null, (normX, normY) => {
    if (!gameState.running) return;
    
    let x = normX, y = normY;
    if (applyDeadzone) {
      if (Math.abs(x) < CONFIG.DEADZONE) x = 0;
      if (Math.abs(y) < CONFIG.DEADZONE) y = 0;
    }
    
    gameState.carX += (x / CONFIG.MAX_OUTPUT) * CONFIG.GAME_CAR_SPEED;
    gameState.carY += (y / CONFIG.MAX_OUTPUT) * CONFIG.GAME_CAR_SPEED;
    gameState.carX = clamp(gameState.carX, 20, CONFIG.GAME_CANVAS_WIDTH - 20);
    gameState.carY = clamp(gameState.carY, 20, CONFIG.GAME_CANVAS_HEIGHT - 20);
  }, applyDeadzone ? 'analog' : 'hall', true);
}

createGameJoystick('mini-joystick1', false); // Hall
createGameJoystick('mini-joystick2', false); // TMR
createGameJoystick('mini-joystick3', true);  // Analog
createGameJoystick('mini-joystick4', false); // Comparison

// ===== GAME LOGIC =====
const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas?.getContext('2d');

function startMiniGame() {
  gameState.running = true;
  gameState.score = 0;
  gameState.carX = 400;
  gameState.carY = 300;
  gameState.coins = [];
  spawnCoins();
  updateScoreDisplay();
  gameLoop();
}

function stopMiniGame() {
  gameState.running = false;
  if (gameState.animationFrame) {
    cancelAnimationFrame(gameState.animationFrame);
    gameState.animationFrame = null;
  }
}

function spawnCoins() {
  for (let i = 0; i < 5; i++) {
    gameState.coins.push({
      x: Math.random() * 760 + 20,
      y: Math.random() * 560 + 20,
      radius: 10
    });
  }
}

function updateScoreDisplay() {
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = `Score: ${gameState.score}`;
}

function gameLoop() {
  if (!gameState.running || !gameCtx) return;

  // Clear canvas
  gameCtx.clearRect(0, 0, CONFIG.GAME_CANVAS_WIDTH, CONFIG.GAME_CANVAS_HEIGHT);

  // Draw car
  gameCtx.fillStyle = '#3498db';
  gameCtx.fillRect(gameState.carX - 15, gameState.carY - 15, 30, 30);
  gameCtx.strokeStyle = '#2980b9';
  gameCtx.lineWidth = 2;
  gameCtx.strokeRect(gameState.carX - 15, gameState.carY - 15, 30, 30);

  // Draw coins and check collisions
  gameCtx.fillStyle = '#f39c12';
  for (let i = gameState.coins.length - 1; i >= 0; i--) {
    const coin = gameState.coins[i];
    
    // Draw coin
    gameCtx.beginPath();
    gameCtx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI);
    gameCtx.fill();
    gameCtx.strokeStyle = '#e67e22';
    gameCtx.lineWidth = 2;
    gameCtx.stroke();

    // Check collision
    const dx = gameState.carX - coin.x;
    const dy = gameState.carY - coin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 25) {
      gameState.coins.splice(i, 1);
      gameState.score += 10;
      updateScoreDisplay();
      
      // Spawn new coin
      gameState.coins.push({
        x: Math.random() * 760 + 20,
        y: Math.random() * 560 + 20,
        radius: 10
      });
    }
  }

  gameState.animationFrame = requestAnimationFrame(gameLoop);
}

// ===== INITIALIZATION LOG =====
console.log('🕹️ Joystick Simulator initialized successfully!');
console.log('📊 Sensors: Hall Effect, TMR, Analog');
console.log('🎮 Mini game ready!');
