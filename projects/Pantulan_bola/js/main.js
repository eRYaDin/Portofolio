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
  
  // 🔥 PERBAIKAN: Setup parameter listeners dari gambar.js
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
  
  // 🔥 HAPUS event listener ganda di sini - sudah ada di setupParameterListeners()
  // JANGAN pakai resetSimulation() langsung, pakai parameterBerubah() dari gambar.js
  
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
  
  // 🔥 PERBAIKAN: Pastikan semua parameter terkirim dengan benar
  console.log("🚀 Starting simulation with params:", params);
  
  // Jalankan simulasi fisika
  const result = runSimulation(
    params.ballIndex, 
    params.v0, 
    params.angle,      // Sudut dari UI
    params.restitution,
    params.height || 0  // Default height = 0 jika tidak ada
  );
  
  simulationData = result.data;
  
  console.log("✅ Simulation data points:", simulationData.length);
  console.log("📊 First point:", simulationData[0]);
  
  // Update summary
  updateSummary(result.summary);
  
  // Mulai animasi
  currentFrame = 0;
  isRunning = true;
  updateStartButton(true);
  
  animate();
}

/**
 * Reset simulasi ke kondisi awal
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
  
  // Clear canvas dengan benar
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
  
  // 🔥 PERBAIKAN: Gambar tanpa parameter extra yang tidak perlu
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
