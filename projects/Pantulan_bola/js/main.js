// ==================== MAIN CONTROLLER ====================

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

// Kamera & Zoom
let followCam = false;
let zoomLevel = 1.0;

// Mode & hasil simulasi
let currentMode = "projectile";
let currentBoxWidth = 20;
let currentBoxHeight = 15;

// ==================== DRAW OPTIONS HELPER ====================

function getDrawOptions() {
  return {
    followCam,
    zoomLevel,
    mode: currentMode,
    boxWidth: currentBoxWidth,
    boxHeight: currentBoxHeight
  };
}

// ==================== INITIALIZATION ====================

function init() {
  initBallSelect();
  setupEventListeners();

  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);

  // Tombol utama
  startBtn.addEventListener("click", startSimulation);
  resetBtn.addEventListener("click", resetSimulation);
  themeBtn.addEventListener("click", () => {
    isDarkTheme = toggleTheme();
    if (simulationData.length > 0) redraw();
  });

  // Reset otomatis saat parameter berubah
  const resetTriggers = [v0Slider, v0Input, angleSlider, angleInput, heightSlider, heightInput, restSlider];
  resetTriggers.forEach(el => el.addEventListener("input", resetSimulation));
  ballSelect.addEventListener("change", resetSimulation);

  // ===== DRAG LISTENERS =====
  document.getElementById("airResistanceCheckbox").addEventListener("change", function () {
    document.getElementById("dragGroup").style.display = this.checked ? "block" : "none";
    resetSimulation();
  });
  document.getElementById("dragSlider").addEventListener("input", function () {
    document.getElementById("dragDisplay").textContent = parseFloat(this.value).toFixed(2);
    resetSimulation();
  });
  ballSelect.addEventListener("change", function () {
    const ball = balls[parseInt(this.value)];
    if (ball && ball.Cd !== undefined) {
      document.getElementById("dragSlider").value = ball.Cd;
      document.getElementById("dragDisplay").textContent = ball.Cd.toFixed(2);
    }
  });

  // ===== MODE SELECTOR =====
  document.querySelectorAll('input[name="simMode"]').forEach(radio => {
    radio.addEventListener("change", function () {
      currentMode = this.value;
      // Sembunyikan/tampilkan kontrol yang relevan
      const showAngle  = currentMode !== "freefall";
      const showBox    = currentMode === "billiard";
      document.getElementById("angleGroup").style.display    = showAngle ? "" : "none";
      document.getElementById("billiardGroup").style.display = showBox   ? "" : "none";
      resetSimulation();
    });
  });

  // Ukuran kotak biliar
  document.getElementById("boxWidthSlider").addEventListener("input", function () {
    currentBoxWidth = parseFloat(this.value);
    document.getElementById("boxWidthDisplay").textContent = currentBoxWidth + " m";
    resetSimulation();
  });
  document.getElementById("boxHeightSlider").addEventListener("input", function () {
    currentBoxHeight = parseFloat(this.value);
    document.getElementById("boxHeightDisplay").textContent = currentBoxHeight + " m";
    resetSimulation();
  });

  // ===== KAMERA & ZOOM =====
  document.getElementById("followCamCheckbox").addEventListener("change", function () {
    followCam = this.checked;
    if (simulationData.length > 0) redraw();
  });
  document.getElementById("zoomInBtn").addEventListener("click", () => {
    zoomLevel = Math.min(5.0, parseFloat((zoomLevel + 0.5).toFixed(1)));
    document.getElementById("zoomDisplay").textContent = zoomLevel.toFixed(1) + "x";
    if (simulationData.length > 0) redraw();
  });
  document.getElementById("zoomOutBtn").addEventListener("click", () => {
    zoomLevel = Math.max(0.5, parseFloat((zoomLevel - 0.5).toFixed(1)));
    document.getElementById("zoomDisplay").textContent = zoomLevel.toFixed(1) + "x";
    if (simulationData.length > 0) redraw();
  });
  document.getElementById("zoomResetBtn").addEventListener("click", () => {
    zoomLevel = 1.0;
    document.getElementById("zoomDisplay").textContent = "1.0x";
    if (simulationData.length > 0) redraw();
  });

  // Resize
  window.addEventListener("resize", () => {
    resizeCanvas(trajectoryCanvas);
    resizeCanvas(energyCanvas);
    if (simulationData.length > 0) redraw();
  });

  initTabs();
}

// ==================== SIMULATION CONTROL ====================

function startSimulation() {
  if (isRunning) return;

  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);

  const params = getSimulationParams();
  currentBallIndex = params.ballIndex;
  currentV0  = params.v0;
  currentAngle = params.angle;

  const result = runSimulation(
    params.ballIndex,
    params.v0,
    params.angle,
    params.restitution,
    params.height,
    currentMode,
    currentBoxWidth,
    currentBoxHeight
  );

  simulationData   = result.data;
  currentMode      = result.mode;
  currentBoxWidth  = result.boxWidth;
  currentBoxHeight = result.boxHeight;

  updateSummary(result.summary);

  currentFrame = 0;
  isRunning = true;
  updateStartButton(true);
  animate();
}

function resetSimulation() {
  isRunning = false;
  if (animationId) cancelAnimationFrame(animationId);
  currentFrame = 0;
  simulationData = [];
  updateStartButton(false);
  resetStats();
  resizeCanvas(trajectoryCanvas);
  resizeCanvas(energyCanvas);
  trajCtx.clearRect(0, 0, trajectoryCanvas.offsetWidth, trajectoryCanvas.offsetHeight);
  energyCtx.clearRect(0, 0, energyCanvas.offsetWidth, energyCanvas.offsetHeight);
}

function redraw() {
  drawTrajectory(trajCtx, simulationData, currentFrame, currentBallIndex, isDarkTheme, currentV0, currentAngle, getDrawOptions());
  drawEnergyGraph(energyCtx, simulationData, currentFrame, isDarkTheme);
}

// ==================== ANIMATION LOOP ====================

function animate() {
  if (!isRunning) return;

  const frameStep = Math.max(1, Math.floor(simulationData.length / 500));
  currentFrame += frameStep;

  if (currentFrame >= simulationData.length) {
    if (isLoopMode()) {
      currentFrame = 0;
    } else {
      currentFrame = simulationData.length - 1;
      isRunning = false;
      updateStartButton(false);
    }
  }

  redraw();
  updateStats(simulationData[currentFrame]);

  if (isRunning) animationId = requestAnimationFrame(animate);
}

// ==================== TAB SWITCHING ====================

let _notebookFetched = false;

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-simulasi").style.display = target === "simulasi" ? "block" : "none";
      document.getElementById("tab-notebook").style.display  = target === "notebook"  ? "block" : "none";

      if (target === "notebook" && !_notebookFetched) {
        _notebookFetched = true;
        fetchAndRenderNotebook();
      }
      if (target === "simulasi") {
        resizeCanvas(trajectoryCanvas);
        resizeCanvas(energyCanvas);
        if (simulationData.length > 0) redraw();
      }
    });
  });

  document.getElementById("copyAllBtn").addEventListener("click", copyAllCode);
  document.getElementById("downloadBtn").addEventListener("click", downloadAsIpynb);
}

// ==================== START ====================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
