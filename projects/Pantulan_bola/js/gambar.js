// ==================== CANVAS RENDERING ENGINE ====================

function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);
}

// ==================== TRAJECTORY CANVAS ====================

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} simulationData
 * @param {number} frameIndex
 * @param {number} ballIndex
 * @param {boolean} isDark
 * @param {number} v0
 * @param {number} angleDeg
 * @param {Object} options - { followCam, zoomLevel, mode, boxWidth, boxHeight }
 */
function drawTrajectory(ctx, simulationData, frameIndex, ballIndex, isDark, v0, angleDeg, options = {}) {
  const canvas = ctx.canvas;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  const ball = balls[ballIndex];

  const {
    followCam = false,
    zoomLevel = 1.0,
    mode = "projectile",
    boxWidth = 20,
    boxHeight = 15
  } = options;

  ctx.clearRect(0, 0, width, height);
  if (simulationData.length === 0) return;

  const padding = 50;
  const plotWidth  = width  - padding * 2;
  const plotHeight = height - padding * 2;

  const current = simulationData[Math.min(frameIndex, simulationData.length - 1)];

  let toCanvasX, toCanvasY, scaleX, scaleY, viewMinX, viewMinY, viewMaxX, viewMaxY;

  if (mode === "billiard") {
    // Mode biliar: tampilkan kotak penuh, zoom from center
    const bW = boxWidth  / zoomLevel;
    const bH = boxHeight / zoomLevel;

    if (followCam) {
      viewMinX = current.x - bW / 2;
      viewMinY = current.y - bH / 2;
    } else {
      viewMinX = boxWidth  / 2 - bW / 2;
      viewMinY = boxHeight / 2 - bH / 2;
    }
    viewMaxX = viewMinX + bW;
    viewMaxY = viewMinY + bH;

    scaleX = plotWidth  / bW;
    scaleY = plotHeight / bH;

    toCanvasX = (x) => padding + (x - viewMinX) * scaleX;
    toCanvasY = (y) => height - padding - (y - viewMinY) * scaleY;

    drawBilliardBox(ctx, width, height, padding, boxWidth, boxHeight, toCanvasX, toCanvasY, isDark);

  } else {
    // Mode projectile / freefall
    let maxX = Math.max(...simulationData.map(d => d.x)) * 1.1 || 10;
    let maxY = Math.max(...simulationData.map(d => d.y)) * 1.2 || 10;
    if (maxX < 1) maxX = 10;
    if (maxY < 1) maxY = 10;

    if (followCam) {
      const viewW = maxX / zoomLevel;
      const viewH = maxY / zoomLevel;
      viewMinX = current.x - viewW / 2;
      viewMinY = current.y - viewH / 2;
      viewMaxX = viewMinX + viewW;
      viewMaxY = viewMinY + viewH;
      scaleX = plotWidth  / viewW;
      scaleY = plotHeight / viewH;
      toCanvasX = (x) => padding + (x - viewMinX) * scaleX;
      toCanvasY = (y) => height - padding - (y - viewMinY) * scaleY;
    } else {
      scaleX = plotWidth  / maxX * zoomLevel;
      scaleY = plotHeight / maxY * zoomLevel;
      toCanvasX = (x) => padding + x * scaleX;
      toCanvasY = (y) => height - padding - y * scaleY;
      viewMinX = 0; viewMinY = 0;
      viewMaxX = maxX; viewMaxY = maxY;
    }

    drawGrid(ctx, width, height, padding, viewMaxX - viewMinX, viewMaxY - viewMinY, toCanvasX, toCanvasY, isDark, viewMinX, viewMinY);
    drawGround(ctx, width, height, padding);
  }

  drawPath(ctx, simulationData, frameIndex, toCanvasX, toCanvasY);

  if (frameIndex < simulationData.length) {
    const ballX = toCanvasX(current.x);
    const ballY = toCanvasY(current.y);

    if (frameIndex === 0 && mode !== "freefall") {
      const angleRad = angleDeg * Math.PI / 180;
      drawLaunchVector(ctx, ballX, ballY, v0 * Math.cos(angleRad), v0 * Math.sin(angleRad), isDark);
    }

    gambarBola(ctx, ball, ballX, ballY, ballIndex);
    drawVelocityVector(ctx, ballX, ballY, current.vx, current.vy, isDark);
  }

  // Label mode
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  const modeLabel = { projectile: "Proyektil", freefall: "Jatuh Bebas", billiard: "Biliar" };
  ctx.fillText("Mode: " + (modeLabel[mode] || mode), padding, padding - 10);
  if (followCam) ctx.fillText("📷 Follow Cam", padding + 120, padding - 10);
  ctx.fillText("🔍 " + zoomLevel.toFixed(1) + "x", padding + (followCam ? 240 : 120), padding - 10);
}

// ==================== DRAW HELPERS ====================

function drawBilliardBox(ctx, width, height, padding, boxW, boxH, toCanvasX, toCanvasY, isDark) {
  const x0 = toCanvasX(0);
  const y0 = toCanvasY(0);
  const x1 = toCanvasX(boxW);
  const y1 = toCanvasY(boxH);

  // Background
  ctx.fillStyle = isDark ? "#1a3a1a" : "#d4edda";
  ctx.fillRect(x0, y1, x1 - x0, y0 - y1);

  // Border dinding
  ctx.strokeStyle = isDark ? "#66bb6a" : "#2e7d32";
  ctx.lineWidth = 4;
  ctx.strokeRect(x0, y1, x1 - x0, y0 - y1);

  // Grid tipis dalam kotak
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const gx = toCanvasX(boxW / 4 * i);
    ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke();
  }
  for (let i = 1; i < 4; i++) {
    const gy = toCanvasY(boxH / 4 * i);
    ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke();
  }

  // Label ukuran
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(boxW + " m", (x0 + x1) / 2, y0 + 18);
  ctx.save();
  ctx.translate(x0 - 18, (y0 + y1) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(boxH + " m", 0, 0);
  ctx.restore();
}

function drawGrid(ctx, width, height, padding, rangeX, rangeY, toCanvasX, toCanvasY, isDark, minX = 0, minY = 0) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";

  for (let i = 0; i <= 5; i++) {
    const xVal = minX + (rangeX / 5) * i;
    const xPos = toCanvasX(xVal);
    ctx.beginPath(); ctx.moveTo(xPos, padding); ctx.lineTo(xPos, height - padding); ctx.stroke();
    ctx.fillText(xVal.toFixed(0) + "m", xPos, height - padding + 18);
  }

  for (let i = 0; i <= 4; i++) {
    const yVal = minY + (rangeY / 4) * i;
    const yPos = toCanvasY(yVal);
    ctx.beginPath(); ctx.moveTo(padding, yPos); ctx.lineTo(width - padding, yPos); ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(yVal.toFixed(0) + "m", padding - 5, yPos + 4);
    ctx.textAlign = "center";
  }
}

function drawGround(ctx, width, height, padding) {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.fillStyle = "#888";
  for (let i = 0; i < width - padding * 2; i += 20) {
    ctx.fillRect(padding + i, height - padding, 10, 4);
  }
}

function drawPath(ctx, simulationData, frameIndex, toCanvasX, toCanvasY) {
  ctx.strokeStyle = "#2196f3";
  ctx.lineWidth = 2;
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

function gambarBola(ctx, ball, x, y, ballIndex) {
  const ukuranDasar = 40;
  const ukuran = ukuranDasar * ball.scale;
  const img = ballImages[ballIndex];

  if (img && img.complete) {
    ctx.drawImage(img, x - ukuran / 2, y - ukuran / 2, ukuran, ukuran);
  } else {
    ctx.fillStyle = "#ffeb3b";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, ukuran / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function drawVelocityVector(ctx, x, y, vx, vy, isDark) {
  const velScale = 2;
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed < 0.01) return;

  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx * velScale, y - vy * velScale);
  ctx.stroke();

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

function drawLaunchVector(ctx, x, y, vx, vy, isDark) {
  const scale = 4;
  ctx.strokeStyle = "#ff5722";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx * scale, y - vy * scale);
  ctx.stroke();

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

function drawEnergyGraph(ctx, simulationData, frameIndex, isDark) {
  const canvas = ctx.canvas;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  ctx.clearRect(0, 0, width, height);
  if (simulationData.length === 0) return;

  const padding = 50;
  const plotWidth  = width  - padding * 2;
  const plotHeight = height - padding * 2;

  const maxT = simulationData[simulationData.length - 1].t;
  const maxE = Math.max(...simulationData.map(d => d.me)) * 1.1 || 1;

  const toCanvasX = (t) => padding + (t / maxT) * plotWidth;
  const toCanvasY = (e) => height - padding - (e / maxE) * plotHeight;

  drawEnergyGrid(ctx, width, height, padding, maxT, maxE, toCanvasX, toCanvasY, isDark);

  const endFrame = Math.min(frameIndex, simulationData.length - 1);
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.ke, "#f44336");
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.pe, "#2196f3");
  drawEnergyLine(ctx, simulationData, endFrame, toCanvasX, toCanvasY, d => d.me, "#4caf50");

  if (frameIndex < simulationData.length) {
    const current = simulationData[frameIndex];
    drawEnergyIndicator(ctx, toCanvasX(current.t), height, padding, current, toCanvasY, isDark);
  }
}

function drawEnergyGrid(ctx, width, height, padding, maxT, maxE, toCanvasX, toCanvasY, isDark) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";

  for (let i = 0; i <= 5; i++) {
    const tVal = (maxT / 5) * i;
    const xPos = toCanvasX(tVal);
    ctx.beginPath(); ctx.moveTo(xPos, padding); ctx.lineTo(xPos, height - padding); ctx.stroke();
    ctx.fillText(tVal.toFixed(1) + "s", xPos, height - padding + 15);
  }

  for (let i = 0; i <= 4; i++) {
    const eVal = (maxE / 4) * i;
    const yPos = toCanvasY(eVal);
    ctx.beginPath(); ctx.moveTo(padding, yPos); ctx.lineTo(width - padding, yPos); ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(eVal.toFixed(2) + "J", padding - 3, yPos + 4);
    ctx.textAlign = "center";
  }

  ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  ctx.font = "11px sans-serif";
  ctx.fillText("Waktu (s)", width / 2, height - 5);
  ctx.save();
  ctx.translate(12, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Energi (J)", 0, 0);
  ctx.restore();
}

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

function drawEnergyIndicator(ctx, cx, height, padding, current, toCanvasY, isDark) {
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(cx, padding);
  ctx.lineTo(cx, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);

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
