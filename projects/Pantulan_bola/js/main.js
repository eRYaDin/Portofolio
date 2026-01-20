// ==================== MAIN CONTROLLER ====================

// Canvas Elements
const trajectoryCanvas = document.getElementById("trajectoryCanvas");
const energyCanvas = document.getElementById("energyCanvas");
const trajCtx = trajectoryCanvas.getContext("2d");
const energyCtx = energyCanvas.getContext("2d");

// State Variables
let simulationData = [];
let isRunning = false;
let animationId = null;
let currentFrame = 0;
let isDarkTheme = false;
let currentBallIndex = 0;

// ==================== INITIALIZATION ====================

/**
 * Inisialisasi aplikasi
 */
function init() {
  // Setup UI
  initBallSelect();
  setupEventListeners();
  
  // 🔥 PERBAIKAN 1: Setup parameter listeners (INI YANG HILANG!)
  setupParameterListeners();
  
  // Setup Canvas
  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);
  
  // Setup Event Handlers
  startBtn.addEventListener("click", startSimulation);
  resetBtn.addEventListener("click", resetSimulation);
  themeBtn.addEventListener("click", () => {
    isDarkTheme = toggleTheme();
    
    // Redraw canvas jika ada data
    if (simulationData.length > 0) {
      drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme);
      drawEnergyGraph(energyCtx, simulationData, currentFrame, isDarkTheme);
    }
  });
  
  // Window resize handler
  window.addEventListener("resize", () => {
    resizeCanvas(trajectoryCanvas);
    resizeCanvas(energyCanvas);
    
    // Redraw jika ada data
    if (simulationData.length > 0) {
      drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme);
      drawEnergyGraph(energyCtx, simulationData, currentFrame, isDarkTheme);
    }
  });
}

// ==================== SIMULATION CONTROL ====================

/**
 * Mulai simulasi
 */
function startSimulation() {
  if (isRunning) return;
  
  // Resize canvas dulu
  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);
  
  // Ambil parameter dari UI
  const params = getSimulationParams();
  currentBallIndex = params.ballIndex;
  
  // 🔥 PERBAIKAN 2: Jalankan simulasi fisika dengan parameter baru
  const result = runSimulation(
    params.ballIndex, 
    params.v0, 
    params.angle, 
    params.restitution
  );
  
  simulationData = result.data;
  
  // Update summary
  updateSummary(result.summary);
  
  // Mulai animasi
  currentFrame = 0;
  isRunning = true;
  updateStartButton(true);
  
  animate();
}

/**
 * 🔥 PERBAIKAN 3: Reset simulasi yang benar (sudah sesuai dengan gambar.js)
 */
function resetSimulation() {
  // Stop animasi
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  // Reset state
  currentFrame = 0;
  simulationData = [];
  
  // Reset UI
  updateStartButton(false);
  resetStats();
  
  // Resize dan clear canvas dengan benar
  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);
  
  clearCanvas(trajCtx);
  clearCanvas(energyCtx);
}

// ==================== ANIMATION LOOP ====================

/**
 * Loop animasi utama
 */
function animate() {
  if (!isRunning) return;
  
  // Hitung frame step (untuk mempercepat animasi jika data terlalu banyak)
  const frameStep = Math.max(1, Math.floor(simulationData.length / 500));
  currentFrame += frameStep;
  
  // Cek apakah sudah selesai
  if (currentFrame >= simulationData.length) {
    currentFrame = simulationData.length - 1;
    isRunning = false;
    updateStartButton(false);
  }
  
  // Gambar trajectory dan energi
  drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme);
  drawEnergyGraph(energyCtx, simulationData, currentFrame, isDarkTheme);
  
  // Update stats
  updateStats(simulationData[currentFrame]);
  
  // Lanjut ke frame berikutnya
  if (isRunning) {
    animationId = requestAnimationFrame(animate);
  }
}

// ==================== START APPLICATION ====================

// Jalankan saat DOM sudah siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
