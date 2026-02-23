// ========================================
// KONSTANTA SENSOR (BERDASARKAN TEORI)
// ========================================

// Hall Effect Sensor: Moderate noise karena interferensi medan magnet
const HALL_NOISE = 50;

// TMR Sensor: Very low noise tapi ada jitter elektronik kecil
const TMR_NOISE = 5;
const TMR_JITTER_AMPLITUDE = 3;

// Analog Potentiometer: High noise + mechanical deadzone
const ANALOG_NOISE = 50;
const DEADZONE = 100; // Zona mati mekanis di pusat

// Joystick properties
const WIDTH = 300;
const HEIGHT = 300;
const RADIUS = 100;
const KNOB_SIZE = 20;
const MAX_OUTPUT = 1600;

// Mini joystick properties
const MINI_WIDTH = 150;
const MINI_HEIGHT = 150;
const MINI_RADIUS = 50;
const MINI_KNOB_SIZE = 12;

// ========================================
// GLOBAL VARIABLES
// ========================================
let hallData = [];
let tmrData = [];
let analogData = [];

// Game variables
let carX = 400;
let carY = 300;
let carSpeed = 4;
let coins = [];
let score = 0;
let gameRunning = false;

const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;

// ========================================
// UTILITY FUNCTIONS
// ========================================
function calculateAvgNoise(data, target) {
    if (data.length === 0) return 0;
    const deviations = data.map(val => Math.abs(val - target));
    return Math.round(deviations.reduce((a, b) => a + b, 0) / deviations.length);
}

function calculateAccuracy(avgNoise) {
    return Math.max(0, Math.round(100 - (avgNoise / 16)));
}

// ========================================
// JOYSTICK CREATION
// ========================================
function createJoystick(canvasId, labelId, onMove, type, isMini = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = isMini ? MINI_WIDTH : WIDTH;
    const h = isMini ? MINI_HEIGHT : HEIGHT;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = isMini ? MINI_RADIUS : RADIUS;
    const knobSize = isMini ? MINI_KNOB_SIZE : KNOB_SIZE;
    
    let knobX = centerX;
    let knobY = centerY;
    let isDragging = false;

    function drawBase() {
        // Outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Inner guide circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 8, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crosshair
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.stroke();

        // Deadzone indicator for analog
        if (type === 'analog' && !isMini) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (DEADZONE / MAX_OUTPUT) * radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    function drawKnob() {
        // Shadow
        ctx.beginPath();
        ctx.arc(knobX + 2, knobY + 2, knobSize, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        // Main knob with gradient
        const gradient = ctx.createRadialGradient(
            knobX - 4, knobY - 4, 3,
            knobX, knobY, knobSize
        );
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#C92A2A');

        ctx.beginPath();
        ctx.arc(knobX, knobY, knobSize, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(knobX - 5, knobY - 5, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }

    function redraw() {
        ctx.clearRect(0, 0, w, h);
        drawBase();
        drawKnob();
    }

    redraw();

    // Event handlers
    const handleStart = (e) => {
        isDragging = true;
        moveKnob(e.touches ? e.touches[0] : e);
    };

    const handleMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            moveKnob(e.touches ? e.touches[0] : e);
        }
    };

    const handleEnd = () => {
        isDragging = false;
        smoothReturn();
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    function moveKnob(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let dx = mouseX - centerX;
        let dy = mouseY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Limit to circle
        if (dist > radius) {
            const scale = radius / dist;
            dx *= scale;
            dy *= scale;
        }

        knobX = centerX + dx;
        knobY = centerY + dy;
        redraw();

        // Calculate normalized values
        let normX = Math.round((dx / radius) * MAX_OUTPUT);
        let normY = Math.round((dy / radius) * MAX_OUTPUT);

        // Apply deadzone for analog
        if (type === 'analog') {
            if (Math.abs(normX) < DEADZONE) normX = 0;
            if (Math.abs(normY) < DEADZONE) normY = 0;
        }

        onMove(normX, normY, type);
    }

    function smoothReturn() {
        if (isDragging) return;

        const dx = centerX - knobX;
        const dy = centerY - knobY;

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            knobX = centerX;
            knobY = centerY;
            redraw();
            onMove(0, 0, type);
            return;
        }

        knobX += dx * 0.15;
        knobY += dy * 0.15;
        redraw();
        
        // Update position during return
        const returnDx = knobX - centerX;
        const returnDy = knobY - centerY;
        let normX = Math.round((returnDx / radius) * MAX_OUTPUT);
        let normY = Math.round((returnDy / radius) * MAX_OUTPUT);
        
        if (type === 'analog') {
            if (Math.abs(normX) < DEADZONE) normX = 0;
            if (Math.abs(normY) < DEADZONE) normY = 0;
        }
        
        onMove(normX, normY, type);
        setTimeout(smoothReturn, 16);
    }
}

// ========================================
// GRAPH CREATION
// ========================================
function createGraph(canvasId, datasets) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return () => {};

    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            elements: {
                point: { radius: 0 },
                line: { borderWidth: 2, tension: 0.1 }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    grid: { display: true, color: 'rgba(0,0,0,0.05)' }
                },
                y: {
                    min: -1600,
                    max: 1600,
                    grid: { display: true, color: 'rgba(0,0,0,0.05)' }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { enabled: true }
            }
        }
    });

    let timeStep = 0;
    const maxPoints = 150;

    return function updateGraph(values) {
        timeStep++;
        chart.data.labels.push(timeStep);
        datasets.forEach((dataset, index) => {
            dataset.data.push(values[index]);
        });

        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            datasets.forEach(dataset => dataset.data.shift());
        }

        chart.update('none');
    };
}

// ========================================
// INITIALIZE JOYSTICKS
// ========================================

// Hall Effect Joystick
const updateGraph1 = createGraph('graph-canvas1', [{
    label: 'Hall Effect X',
    data: [],
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    fill: false
}]);

createJoystick('joystick-canvas1', null, (normX, normY) => {
    // Add Hall Effect noise
    const noiseX = Math.floor(Math.random() * (HALL_NOISE * 2 + 1)) - HALL_NOISE;
    const hallX = normX + noiseX;
    
    document.getElementById('label-hall').textContent = `X=${hallX}  Y=${normY}`;
    
    hallData.push(hallX);
    if (hallData.length > 100) hallData.shift();
    
    const avgNoise = calculateAvgNoise(hallData, normX);
    const accuracy = calculateAccuracy(avgNoise);
    document.getElementById('stats-hall').textContent = `Avg Noise: ${avgNoise} | Accuracy: ${accuracy}%`;
    
    updateGraph1([hallX]);
}, 'hall');

// TMR Sensor Joystick
const updateGraph2 = createGraph('graph-canvas2', [{
    label: 'TMR Sensor X',
    data: [],
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    fill: false
}]);

createJoystick('joystick-canvas2', null, (normX, normY) => {
    // Add TMR noise + jitter
    const noiseX = Math.floor(Math.random() * (TMR_NOISE * 2 + 1)) - TMR_NOISE;
    const jitter = Math.sin(Date.now() / 50) * TMR_JITTER_AMPLITUDE;
    const tmrX = normX + noiseX + jitter;
    
    document.getElementById('label-tmr').textContent = `X=${Math.round(tmrX)}  Y=${normY}`;
    
    tmrData.push(tmrX);
    if (tmrData.length > 100) tmrData.shift();
    
    const avgNoise = calculateAvgNoise(tmrData, normX);
    const accuracy = calculateAccuracy(avgNoise);
    document.getElementById('stats-tmr').textContent = `Avg Noise: ${avgNoise} | Accuracy: ${accuracy}%`;
    
    updateGraph2([tmrX]);
}, 'tmr');

// Analog Potentiometer Joystick
const updateGraph3 = createGraph('graph-canvas3', [{
    label: 'Analog Pot X',
    data: [],
    borderColor: '#FFE66D',
    backgroundColor: 'rgba(255, 230, 109, 0.1)',
    fill: false
}]);

createJoystick('joystick-canvas3', null, (normX, normY) => {
    // Add analog noise
    const noiseX = Math.floor(Math.random() * (ANALOG_NOISE * 2 + 1)) - ANALOG_NOISE;
    const analogX = normX + noiseX;
    
    document.getElementById('label-analog').textContent = `X=${analogX}  Y=${normY}`;
    
    analogData.push(analogX);
    if (analogData.length > 100) analogData.shift();
    
    const avgNoise = calculateAvgNoise(analogData, normX);
    const accuracy = calculateAccuracy(avgNoise);
    document.getElementById('stats-analog').textContent = `Avg Noise: ${avgNoise} | Accuracy: ${accuracy}%`;
    
    updateGraph3([analogX]);
}, 'analog');

// Comparison Joystick
const updateGraph4 = createGraph('graph-canvas4', [
    { label: 'Hall', data: [], borderColor: '#FF6B6B', fill: false },
    { label: 'TMR', data: [], borderColor: '#4ECDC4', fill: false },
    { label: 'Analog', data: [], borderColor: '#FFE66D', fill: false }
]);

createJoystick('joystick-canvas4', null, (normX, normY) => {
    // Hall
    const hallNoise = Math.floor(Math.random() * (HALL_NOISE * 2 + 1)) - HALL_NOISE;
    const hallX = normX + hallNoise;
    document.getElementById('label-comp-hall').textContent = `Hall: X=${hallX} Y=${normY}`;
    
    // TMR
    const tmrNoise = Math.floor(Math.random() * (TMR_NOISE * 2 + 1)) - TMR_NOISE;
    const jitter = Math.sin(Date.now() / 50) * TMR_JITTER_AMPLITUDE;
    const tmrX = normX + tmrNoise + jitter;
    document.getElementById('label-comp-tmr').textContent = `TMR: X=${Math.round(tmrX)} Y=${normY}`;
    
    // Analog
    const analogNoise = Math.floor(Math.random() * (ANALOG_NOISE * 2 + 1)) - ANALOG_NOISE;
    const analogX = normX + analogNoise;
    document.getElementById('label-comp-analog').textContent = `Analog: X=${analogX} Y=${normY}`;
    
    const hallAvg = calculateAvgNoise([hallX], normX);
    const tmrAvg = calculateAvgNoise([tmrX], normX);
    const analogAvg = calculateAvgNoise([analogX], normX);
    document.getElementById('stats-comp').textContent = `Hall: ${hallAvg} | TMR: ${tmrAvg} | Analog: ${analogAvg}`;
    
    updateGraph4([hallX, tmrX, analogX]);
    
    // Update game car position
    if (gameRunning) {
        carX += (normX / MAX_OUTPUT) * carSpeed;
        carY += (normY / MAX_OUTPUT) * carSpeed;
        carX = Math.max(20, Math.min(780, carX));
        carY = Math.max(20, Math.min(580, carY));
    }
}, 'comparison');

// ========================================
// MINI JOYSTICKS (FOR GAME)
// ========================================
createJoystick('mini-joystick1', null, (normX, normY) => {
    if (gameRunning) {
        carX += (normX / MAX_OUTPUT) * carSpeed;
        carY += (normY / MAX_OUTPUT) * carSpeed;
        carX = Math.max(20, Math.min(780, carX));
        carY = Math.max(20, Math.min(580, carY));
    }
}, 'hall', true);

createJoystick('mini-joystick2', null, (normX, normY) => {
    if (gameRunning) {
        carX += (normX / MAX_OUTPUT) * carSpeed;
        carY += (normY / MAX_OUTPUT) * carSpeed;
        carX = Math.max(20, Math.min(780, carX));
        carY = Math.max(20, Math.min(580, carY));
    }
}, 'tmr', true);

createJoystick('mini-joystick3', null, (normX, normY) => {
    if (gameRunning) {
        carX += (normX / MAX_OUTPUT) * carSpeed;
        carY += (normY / MAX_OUTPUT) * carSpeed;
        carX = Math.max(20, Math.min(780, carX));
        carY = Math.max(20, Math.min(580, carY));
    }
}, 'analog', true);

createJoystick('mini-joystick4', null, (normX, normY) => {
    if (gameRunning) {
        carX += (normX / MAX_OUTPUT) * carSpeed;
        carY += (normY / MAX_OUTPUT) * carSpeed;
        carX = Math.max(20, Math.min(780, carX));
        carY = Math.max(20, Math.min(580, carY));
    }
}, 'comparison', true);

// ========================================
// NAVIGATION
// ========================================
document.getElementById('desktop-mode-start').addEventListener('click', () => {
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});

document.getElementById('mobile-mode-start').addEventListener('click', () => {
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});

document.getElementById('mini-game-btn').addEventListener('click', () => {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('mini-game').classList.remove('hidden');
    startGame();
});

document.getElementById('back-to-main').addEventListener('click', () => {
    stopGame();
    document.getElementById('mini-game').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
});

document.getElementById('reset-btn').addEventListener('click', () => {
    hallData = [];
    tmrData = [];
    analogData = [];
    location.reload();
});

// ========================================
// GAME LOGIC
// ========================================
function startGame() {
    gameRunning = true;
    score = 0;
    carX = 400;
    carY = 300;
    coins = [];
    
    // Spawn initial coins
    for (let i = 0; i < 8; i++) {
        coins.push({
            x: Math.random() * 760 + 20,
            y: Math.random() * 560 + 20,
            radius: 12
        });
    }
    
    gameLoop();
}

function stopGame() {
    gameRunning = false;
}

function gameLoop() {
    if (!gameRunning || !gameCtx) return;

    gameCtx.clearRect(0, 0, 800, 600);

    // Draw player (blue square with eyes)
    gameCtx.fillStyle = '#4ECDC4';
    gameCtx.strokeStyle = '#000';
    gameCtx.lineWidth = 4;
    gameCtx.fillRect(carX - 20, carY - 20, 40, 40);
    gameCtx.strokeRect(carX - 20, carY - 20, 40, 40);
    
    // Eyes
    gameCtx.fillStyle = '#000';
    gameCtx.beginPath();
    gameCtx.arc(carX - 8, carY - 5, 4, 0, 2 * Math.PI);
    gameCtx.arc(carX + 8, carY - 5, 4, 0, 2 * Math.PI);
    gameCtx.fill();

    // Draw coins
    coins.forEach((coin, index) => {
        gameCtx.fillStyle = '#FFE66D';
        gameCtx.strokeStyle = '#000';
        gameCtx.lineWidth = 3;
        gameCtx.beginPath();
        gameCtx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI);
        gameCtx.fill();
        gameCtx.stroke();

        // Sparkle
        gameCtx.fillStyle = '#FFF';
        gameCtx.beginPath();
        gameCtx.arc(coin.x - 4, coin.y - 4, 3, 0, 2 * Math.PI);
        gameCtx.fill();

        // Check collision
        const dx = carX - coin.x;
        const dy = carY - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20 + coin.radius) {
            coins.splice(index, 1);
            score += 10;
            
            // Spawn new coin
            coins.push({
                x: Math.random() * 760 + 20,
                y: Math.random() * 560 + 20,
                radius: 12
            });
        }
    });

    // Update stats
    document.getElementById('game-stats').textContent = 
        `Score: ${score} | Coins Collected: ${Math.floor(score / 10)}`;

    requestAnimationFrame(gameLoop);
}

console.log('🎮 Joystick Sensor Comparison Tool Loaded!');
console.log('Hall Effect Noise: ±' + HALL_NOISE);
console.log('TMR Noise: ±' + TMR_NOISE + ' + jitter');
console.log('Analog Noise: ±' + ANALOG_NOISE + ' + deadzone: ±' + DEADZONE);
