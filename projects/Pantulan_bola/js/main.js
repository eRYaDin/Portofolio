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
let currentV0 = 20;
let currentAngle = 45;

// ==================== INITIALIZATION ====================

/**
 * Inisialisasi aplikasi
 */
function init() {
  // Setup UI
  initBallSelect();
  setupEventListeners();
  
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
      drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme, currentV0, currentAngle);
      drawEnergyGraph(energyCtx, simulationData, currentFrame, isDarkTheme);
    }
  });
  
  // Reset otomatis saat parameter berubah
  v0Slider.addEventListener("input", resetSimulation);
  v0Input.addEventListener("input", resetSimulation);
  angleSlider.addEventListener("input", resetSimulation);
  angleInput.addEventListener("input", resetSimulation);
  heightSlider.addEventListener("input", resetSimulation);
  heightInput.addEventListener("input", resetSimulation);
  restSlider.addEventListener("input", resetSimulation);
  ballSelect.addEventListener("change", resetSimulation);
  
  // Window resize handler
  window.addEventListener("resize", () => {
    resizeCanvas(trajectoryCanvas);
    resizeCanvas(energyCanvas);
    
    // Redraw jika ada data
    if (simulationData.length > 0) {
      drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme, currentV0, currentAngle);
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
  
  // PERBAIKAN: Update semua variabel state dengan nilai dari UI
  currentBallIndex = params.ballIndex;
  currentV0 = params.v0;
  currentAngle = params.angle; // INI YANG PENTING! Update angle dari input
  
  // Jalankan simulasi fisika
  const result = runSimulation(
    params.ballIndex, 
    params.v0, 
    params.angle,      // Gunakan params.angle (dari UI)
    params.restitution,
    params.height
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
 * Reset simulasi ke kondisi awal
 */
function resetSimulation() {
  // Stop animasi
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // Reset state
  currentFrame = 0;
  simulationData = [];
  
  // Reset UI
  updateStartButton(false);
  resetStats();
  
  // Clear canvas
  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);
  trajCtx.clearRect(0, 0, trajectoryCanvas.offsetWidth, trajectoryCanvas.offsetHeight);
  energyCtx.clearRect(0, 0, energyCanvas.offsetWidth, energyCanvas.offsetHeight);
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
    if (isLoopMode()) {
      // Loop mode: mulai dari awal
      currentFrame = 0;
    } else {
      // Normal mode: stop
      currentFrame = simulationData.length - 1;
      isRunning = false;
      updateStartButton(false);
    }
  }
  
  // Gambar trajectory dan energi (gunakan currentV0 dan currentAngle yang sudah diupdate)
  drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme, currentV0, currentAngle);
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
