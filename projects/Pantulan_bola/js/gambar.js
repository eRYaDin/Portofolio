// ==================== CANVAS RENDERING ENGINE ====================

/**
 * Mengatur ukuran canvas dengan device pixel ratio
 * @param {HTMLCanvasElement} canvas 
 */
function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);
}

/**
 * Membersihkan canvas dengan benar
 */
function clearCanvas(ctx) {
  if (!ctx) return;
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

// ==================== TRAJECTORY CANVAS ====================

/**
 * Menggambar trajectory bola dengan gambar PNG
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array} simulationData 
 * @param {number} frameIndex 
 * @param {number} ballIndex 
 * @param {boolean} isDark 
 */
function drawTrajectory(ctx, simulationData, frameIndex, ballIndex, isDark) {
  const canvas = ctx.canvas;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  const ball = balls[ballIndex];
  
  ctx.clearRect(0, 0, width, height);
  
  if (simulationData.length === 0) return;
  
  // Hitung skala
  const maxX = Math.max(...simulationData.map(d => d.x)) * 1.1 || 100;
  const maxY = Math.max(...simulationData.map(d => d.y)) * 1.2 || 50;
  
  const padding = 50;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  
  const scaleX = plotWidth / maxX;
  const scaleY = plotHeight / maxY;
  
  const toCanvasX = (x) => padding + x * scaleX;
  const toCanvasY = (y) => height - padding - y * scaleY;
  
  // Gambar komponen
  drawGrid(ctx, width, height, padding, maxX, maxY, toCanvasX, toCanvasY, isDark);
  drawGround(ctx, width, height, padding);
  drawPath(ctx, simulationData, frameIndex, toCanvasX, toCanvasY);
  
  // Gambar bola dengan gambar PNG
  if (frameIndex < simulationData.length) {
    const current = simulationData[frameIndex];
    const ballX = toCanvasX(current.x);
    const ballY = toCanvasY(current.y);
    
    gambarBola(ctx, ball, ballX, ballY, ballIndex);
    drawVelocityVector(ctx, ballX, ballY, current.vx, current.vy, isDark);
  }
}

/**
 * Menggambar grid koordinat
 */
function drawGrid(ctx, width, height, padding, maxX, maxY, toCanvasX, toCanvasY, isDark) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  
  // Grid vertikal
  for (let i = 0; i <= 5; i++) {
    const xVal = (maxX / 5) * i;
    const xPos = toCanvasX(xVal);
    ctx.beginPath();
    ctx.moveTo(xPos, padding);
    ctx.lineTo(xPos, height - padding);
    ctx.stroke();
    ctx.fillText(xVal.toFixed(0) + "m", xPos, height - padding + 18);
  }
  
  // Grid horizontal
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxY / 4) * i;
    const yPos = toCanvasY(yVal);
    ctx.beginPath();
    ctx.moveTo(padding, yPos);
    ctx.lineTo(width - padding, yPos);
    ctx.stroke();
    ctx.fillText(yVal.toFixed(0) + "m", padding - 22, yPos + 4);
  }
}

/**
 * Menggambar tanah dengan pattern
 */
function drawGround(ctx, width, height, padding) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Pattern ground
  ctx.fillStyle = "#555";
  for (let i = 0; i < width - padding * 2; i += 20) {
    ctx.fillRect(padding + i, height - padding, 10, 5);
  }
}

/**
 * Menggambar path trajectory
 */
function drawPath(ctx, simulationData, frameIndex, toCanvasX, toCanvasY) {
  ctx.strokeStyle = "#2196f3";
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  const endFrame = Math.min(frameIndex, simulationData.length - 1);
  for (let i = 0; i <= endFrame; i++) {
    const d = simulationData[i];
    const cx = toCanvasX(d.x);
    const cy = toCanvasY(d.y);
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

/**
 * FUNGSI KUNCI: Menggambar bola dengan gambar PNG
 * PNG tetap 500×500px, tapi scale di canvas beda-beda
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} ball - Data bola
 * @param {number} x - Posisi X di canvas
 * @param {number} y - Posisi Y di canvas
 * @param {number} ballIndex - Index bola
 */
function gambarBola(ctx, ball, x, y, ballIndex) {
  const ukuranDasar = 40; // Ukuran standar di canvas
  const ukuran = ukuranDasar * ball.scale; // Scale sesuai jenis bola (KUNCI!)
  
  const img = ballImages[ballIndex];
  
  if (img && img.complete) {
    // Gambar bola dengan ukuran sesuai scale
    ctx.drawImage(
      img,
      x - ukuran / 2,
      y - ukuran / 2,
      ukuran,
      ukuran
    );
  } else {
    // Fallback: gambar lingkaran polos jika gambar belum load
    ctx.fillStyle = "#ffeb3b";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, ukuran / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

/**
 * Menggambar vektor kecepatan
 */
function drawVelocityVector(ctx, x, y, vx, vy, isDark) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.lineWidth = 2;
  const velScale = 2;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx * velScale, y - vy * velScale);
  ctx.stroke();
  
  // Arrow head
  const arrowX = x + vx * velScale;
  const arrowY = y - vy * velScale;
  const angle = Math.atan2(-vy, vx);
  
  ctx.fillStyle = "#ff9800";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - 8 * Math.cos(angle - Math.PI / 6), arrowY + 8 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(arrowX - 8 * Math.cos(angle + Math.PI / 6), arrowY + 8 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// ==================== ENERGY CANVAS ====================

/**
 * Menggambar grafik energi
 */
function drawEnergyGraph(ctx, simulationData, frameIndex, isDark) {
  const canvas = ctx.canvas;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  
  ctx.clearRect(0, 0, width, height);
  
  if (simulationData.length === 0) return;
  
  const padding = 50;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  
  const maxT = simulationData[simulationData.length - 1].t;
  const maxE = Math.max(...simulationData.map(d => d.me)) * 1.1;
  
  const scaleX = plotWidth / maxT;
  const scaleY = plotHeight / maxE;
  
  const toCanvasX = (t) => padding + t * scaleX;
  const toCanvasY = (e) => height - padding - e * scaleY;
  
  // Gambar grid energi
  drawEnergyGrid(ctx, width, height, padding, maxT, maxE, toCanvasX, toCanvasY, isDark);
  
  // Gambar grafik energi
  const endFrame = Math.min(frameIndex, simulationData.length - 1);
  
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.ke, "#f44336");
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.pe, "#2196f3");
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.me, "#4caf50");
  
  // Gambar indicator current frame
  if (frameIndex < simulationData.length) {
    const current = simulationData[frameIndex];
    const cx = toCanvasX(current.t);
    
    drawEnergyIndicator(ctx, cx, height, padding, current, toCanvasY, isDark);
  }
}

/**
 * Menggambar grid untuk grafik energi
 */
function drawEnergyGrid(ctx, width, height, padding, maxT, maxE, toCanvasX, toCanvasY, isDark) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  
  // Grid vertikal (waktu)
  for (let i = 0; i <= 5; i++) {
    const tVal = (maxT / 5) * i;
    const xPos = toCanvasX(tVal);
    ctx.beginPath();
    ctx.moveTo(xPos, padding);
    ctx.lineTo(xPos, height - padding);
    ctx.stroke();
    ctx.fillText(tVal.toFixed(1) + "s", xPos, height - padding + 15);
  }
  
  // Grid horizontal (energi)
  for (let i = 0; i <= 4; i++) {
    const eVal = (maxE / 4) * i;
    const yPos = toCanvasY(eVal);
    ctx.beginPath();
    ctx.moveTo(padding, yPos);
    ctx.lineTo(width - padding, yPos);
    ctx.stroke();
    ctx.fillText(eVal.toFixed(1) + "J", padding - 25, yPos + 4);
  }
  
  // Label sumbu
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.font = "11px sans-serif";
  ctx.fillText("Waktu (s)", width / 2, height - 10);
  
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Energi (J)", 0, 0);
  ctx.restore();
}

/**
 * Menggambar satu garis energi
 */
function drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, getData, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i <= endFrame; i++) {
    const d = simulationData[i];
    const cx = toCanvasX(d.t);
    const cy = toCanvasY(getData(d));
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.stroke();
}

/**
 * Menggambar indicator frame saat ini
 */
function drawEnergyIndicator(ctx, cx, height, padding, current, toCanvasY, isDark) {
  // Vertical line
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(cx, padding);
  ctx.lineTo(cx, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Titik pada grafik
  const drawDot = (value, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, toCanvasY(value), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  
  drawDot(current.ke, "#f44336");
  drawDot(current.pe, "#2196f3");
  drawDot(current.me, "#4caf50");
}

// ==================== PARAMETER CHANGE HANDLERS ====================

/**
 * Handler saat parameter berubah
 * Membatalkan simulasi yang sedang berjalan dan reset data
 */
function parameterBerubah() {
  console.log("🔄 Parameter berubah - Reset simulasi");
  
  // Hentikan animasi jika sedang berjalan
  if (typeof isRunning !== 'undefined' && isRunning) {
    isRunning = false;
    if (typeof animationId !== 'undefined' && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (typeof startBtn !== 'undefined' && startBtn) {
      startBtn.textContent = "▶ Mulai";
      startBtn.disabled = false;
    }
  }
  
  // Invalidate data lama
  if (typeof simulationData !== 'undefined') {
    simulationData = [];
  }
  if (typeof currentFrame !== 'undefined') {
    currentFrame = 0;
  }
  
  // Bersihkan canvas
  if (typeof trajCtx !== 'undefined') {
    clearCanvas(trajCtx);
  }
  if (typeof energyCtx !== 'undefined') {
    clearCanvas(energyCtx);
  }
}

/**
 * Setup event listeners untuk perubahan parameter
 */
function setupParameterListeners() {
  console.log("✅ Setting up parameter listeners");
  
  // Sudut - reset simulasi saat berubah
  if (typeof angleSlider !== 'undefined' && angleSlider) {
    angleSlider.addEventListener("input", () => {
      console.log("📐 Sudut berubah ke:", angleSlider.value, "°");
      parameterBerubah();
    });
  }
  if (typeof angleInput !== 'undefined' && angleInput) {
    angleInput.addEventListener("input", () => {
      console.log("📐 Sudut input berubah ke:", angleInput.value, "°");
      parameterBerubah();
    });
  }
  
  // Kecepatan awal - reset simulasi saat berubah
  if (typeof v0Slider !== 'undefined' && v0Slider) {
    v0Slider.addEventListener("input", () => {
      console.log("🚀 V0 berubah ke:", v0Slider.value, "m/s");
      parameterBerubah();
    });
  }
  if (typeof v0Input !== 'undefined' && v0Input) {
    v0Input.addEventListener("input", () => {
      console.log("🚀 V0 input berubah ke:", v0Input.value, "m/s");
      parameterBerubah();
    });
  }
  
  // Restitusi - reset simulasi saat berubah
  if (typeof restSlider !== 'undefined' && restSlider) {
    restSlider.addEventListener("input", () => {
      console.log("⚡ Restitusi berubah ke:", restSlider.value);
      parameterBerubah();
    });
  }
  
  // Height - reset simulasi saat berubah (jika ada)
  const heightSlider = document.getElementById("heightSlider");
  const heightInput = document.getElementById("heightInput");
  
  if (heightSlider) {
    heightSlider.addEventListener("input", () => {
      console.log("📏 Height berubah ke:", heightSlider.value, "m");
      parameterBerubah();
    });
  }
  if (heightInput) {
    heightInput.addEventListener("input", () => {
      console.log("📏 Height input berubah ke:", heightInput.value, "m");
      parameterBerubah();
    });
  }
  
  // Jenis bola - reset dan preview
  if (typeof ballSelect !== 'undefined' && ballSelect) {
    ballSelect.addEventListener("change", () => {
      console.log("⚽ Bola berubah ke index:", ballSelect.value);
      parameterBerubah();
    });
  }
  
  console.log("✅ Parameter listeners setup complete!");
}
