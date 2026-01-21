// ==================== UI INTERACTION HANDLERS ====================

// DOM Elements
const ballSelect = document.getElementById("ballSelect");
const ballIcon = document.getElementById("ballIcon");
const ballInfo = document.getElementById("ballInfo");
const v0Slider = document.getElementById("v0Slider");
const v0Input = document.getElementById("v0Input");
const v0Display = document.getElementById("v0Display");
const angleSlider = document.getElementById("angleSlider");
const angleInput = document.getElementById("angleInput");
const angleDisplay = document.getElementById("angleDisplay");
const restSlider = document.getElementById("restSlider");
const restDisplay = document.getElementById("restDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const themeBtn = document.getElementById("themeBtn");

// ==================== INITIALIZATION ====================

/**
 * Inisialisasi dropdown pilihan bola
 */
function initBallSelect() {
  balls.forEach((ball, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = ball.name;
    ballSelect.appendChild(option);
  });
  updateBallPreview();
}

/**
 * Update preview bola yang dipilih
 */
function updateBallPreview() {
  const ball = balls[ballSelect.value];
  
  // Update gambar bola
  const img = ballImages[ballSelect.value];
  if (img && img.complete) {
    ballIcon.style.backgroundImage = `url('${ball.image}')`;
    ballIcon.style.backgroundSize = 'cover';
    ballIcon.style.backgroundPosition = 'center';
  } else {
    // Fallback warna jika gambar belum load
    ballIcon.style.background = '#ffeb3b';
  }
  
  // Update info bola
  ballInfo.innerHTML = `Mass: ${ball.mass} kg<br>Diameter: ${ball.diameter} m`;
}

// ==================== SLIDER SYNCHRONIZATION ====================

/**
 * Sinkronisasi slider dan input number (TANPA reset otomatis)
 * Reset dihandle oleh setupParameterListeners() di gambar.js
 * @param {HTMLInputElement} slider 
 * @param {HTMLInputElement} input 
 * @param {HTMLElement} display 
 * @param {string} suffix 
 */
function syncSliderInput(slider, input, display, suffix = "") {
  slider.addEventListener("input", () => {
    input.value = slider.value;
    display.textContent = slider.value + suffix;
  });
  
  input.addEventListener("input", () => {
    slider.value = input.value;
    display.textContent = input.value + suffix;
  });
}

// ==================== STATS UPDATE ====================

/**
 * Update statistik real-time
 * @param {Object} dataPoint - Data pada frame tertentu
 */
function updateStats(dataPoint) {
  if (!dataPoint) return;
  
  document.getElementById("statTime").textContent = dataPoint.t.toFixed(2);
  document.getElementById("statPosX").textContent = dataPoint.x.toFixed(2);
  document.getElementById("statPosY").textContent = Math.max(0, dataPoint.y).toFixed(2);
  document.getElementById("statVelX").textContent = dataPoint.vx.toFixed(2);
  document.getElementById("statVelY").textContent = dataPoint.vy.toFixed(2);
  document.getElementById("statVelTotal").textContent = dataPoint.speed.toFixed(2);
  document.getElementById("statKE").textContent = dataPoint.ke.toFixed(4);
  document.getElementById("statPE").textContent = dataPoint.pe.toFixed(4);
  document.getElementById("statME").textContent = dataPoint.me.toFixed(4);
}

/**
 * Update ringkasan simulasi
 * @param {Object} summary 
 */
function updateSummary(summary) {
  document.getElementById("maxHeight").textContent = summary.maxHeight.toFixed(2) + " m";
  document.getElementById("totalDistance").textContent = summary.totalDistance.toFixed(2) + " m";
  document.getElementById("flightTime").textContent = summary.flightTime.toFixed(2) + " s";
  document.getElementById("bounceCount").textContent = summary.bounces;
}

/**
 * Reset semua statistik ke nilai awal
 */
function resetStats() {
  document.getElementById("statTime").textContent = "0.00";
  document.getElementById("statPosX").textContent = "0.00";
  document.getElementById("statPosY").textContent = "0.00";
  document.getElementById("statVelX").textContent = "0.00";
  document.getElementById("statVelY").textContent = "0.00";
  document.getElementById("statVelTotal").textContent = "0.00";
  document.getElementById("statKE").textContent = "0.00";
  document.getElementById("statPE").textContent = "0.00";
  document.getElementById("statME").textContent = "0.00";
  document.getElementById("maxHeight").textContent = "0.00 m";
  document.getElementById("totalDistance").textContent = "0.00 m";
  document.getElementById("flightTime").textContent = "0.00 s";
  document.getElementById("bounceCount").textContent = "0";
}

// ==================== THEME TOGGLE ====================

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  
  return isDark;
}

// ==================== BUTTON STATES ====================

/**
 * Update state tombol Start
 * @param {boolean} isRunning 
 */
function updateStartButton(isRunning) {
  if (isRunning) {
    startBtn.textContent = "⏸ Berjalan...";
    startBtn.disabled = true;
  } else {
    startBtn.textContent = "▶ Mulai";
    startBtn.disabled = false;
  }
}

// ==================== EVENT LISTENERS SETUP ====================

/**
 * Setup semua event listeners untuk UI
 * TIDAK termasuk parameter change - itu dihandle oleh setupParameterListeners() di gambar.js
 */
function setupEventListeners() {
  // Ball selection - hanya update preview, reset dihandle gambar.js
  ballSelect.addEventListener("change", updateBallPreview);
  
  // Slider synchronization (HANYA sync display, TIDAK reset simulasi)
  syncSliderInput(v0Slider, v0Input, v0Display, " m/s");
  syncSliderInput(angleSlider, angleInput, angleDisplay, "°");
  
  // Restitusi slider (tanpa input number)
  restSlider.addEventListener("input", () => {
    restDisplay.textContent = restSlider.value;
  });
  
  // Height slider (jika ada)
  const heightSlider = document.getElementById("heightSlider");
  const heightInput = document.getElementById("heightInput");
  const heightDisplay = document.getElementById("heightDisplay");
  
  if (heightSlider && heightInput && heightDisplay) {
    syncSliderInput(heightSlider, heightInput, heightDisplay, " m");
  }
}

// ==================== GETTERS ====================

/**
 * Ambil parameter simulasi dari UI
 * @returns {Object}
 */
function getSimulationParams() {
  const params = {
    ballIndex: parseInt(ballSelect.value),
    v0: parseFloat(v0Input.value),
    angle: parseFloat(angleInput.value),
    restitution: parseFloat(restSlider.value),
    height: 0
  };
  
  // Cek apakah ada input height
  const heightInput = document.getElementById("heightInput");
  if (heightInput && heightInput.value) {
    params.height = parseFloat(heightInput.value);
  }
  
  return params;
}
