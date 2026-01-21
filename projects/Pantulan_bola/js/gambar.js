// ==================== CANVAS RENDERING ENGINE ====================

/
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

// ==================== TRAJECTORY CANVAS ====================

/**
 * Menggambar trajectory bola dengan gambar PNG
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array} simulationData 
 * @param {number} frameIndex 
 * @param {number} ballIndex 
 * @param {boolean} isDark 
 * @param {number} v0 - Kecepatan awal
 * @param {number} angleDeg - Sudut peluncuran
 */
function drawTrajectory(ctx, simulationData, frameIndex, ballIndex, isDark, v0, angleDeg) {
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
    
    // Gambar panah arah lemparan di frame pertama
    if (frameIndex === 0) {
      const angleRad = angleDeg * Math.PI / 180;
      drawLaunchVector(ctx, ballX, ballY, v0 * Math.cos(angleRad), v0 * Math.sin(angleRad), isDark);
    }
    
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
 * Menggambar vektor kecepatan (ORANYE)
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

/**
 * Menggambar panah arah lemparan awal (MERAH)
 */
function drawLaunchVector(ctx, x, y, vx, vy, isDark) {
  const scale = 4;
  
  ctx.strokeStyle = "#ff5722";
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx * scale, y - vy * scale);
  ctx.stroke();
  
  // Arrow head
  const arrowX = x + vx * scale;
  const arrowY = y - vy * scale;
  const angle = Math.atan2(-vy, vx);
  
  ctx.fillStyle = "#ff5722";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX - 10 * Math.cos(angle - Math.PI / 6), arrowY + 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(arrowX - 10 * Math.cos(angle + Math.PI / 6), arrowY + 10 * Math.sin(angle + Math.PI / 6));
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
