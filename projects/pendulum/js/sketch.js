/* ═══════════════════════════════════════════════════════════
   sketch.js — Visual Rendering
   Semua logika gambar canvas ada di sini.
   Untuk menambah visual baru, tambah method di Sketch class.
═══════════════════════════════════════════════════════════ */

class Sketch {
  constructor(canvasId, color = '#e8003d') {
    this.canvas = document.getElementById(canvasId);
    this.ctx    = this.canvas.getContext('2d');
    this.color  = color;       // warna bob / tali utama
    this.pixelsPerMeter = 160; // skala: 1 meter = 160px (akan dihitung ulang)

    // Options (dari toggle UI)
    this.showVectors    = true;
    this.showTrace      = true;
    this.showProtractor = false;

    this._resize();
  }

  // ─── Resize canvas mengikuti elemen parent ─────────────
  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width  = rect.width  || this.canvas.offsetWidth;
    this.canvas.height = rect.height || this.canvas.offsetHeight;
  }

  // ─── Hitung pivot dan skala berdasarkan ukuran canvas ──
  _layout(pendulum) {
    this._resize();
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Pivot di atas-tengah, 20% dari atas
    const px = w / 2;
    const py = h * 0.18;
    // Skala: tali harus muat di 70% tinggi canvas
    const scale = (h * 0.70) / pendulum.length;
    return { px, py, scale };
  }

  // ─── Konversi koordinat fisika → canvas ─────────────────
  _toCanvas(px, py, scale, physX, physY) {
    return {
      x: px + physX * scale,
      y: py + physY * scale,
    };
  }

  // ═══════════════════════════════════════════════════════
  // Render SINGLE pendulum
  // ═══════════════════════════════════════════════════════
  drawSingle(pendulum, options = {}) {
    const ctx = this.ctx;
    const { px, py, scale } = this._layout(pendulum);
    const pos = pendulum.bobPosition();
    const bx  = px + pos.x * scale;
    const by  = py + pos.y * scale;
    const bobR= Math.max(10, 14 * Math.sqrt(pendulum.mass));

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Busur derajat
    if (this.showProtractor) this._drawProtractor(ctx, px, py, scale, pendulum.length);

    // Jejak
    if (this.showTrace) this._drawTrace(ctx, px, py, scale, pendulum.tracePoints, this.color);

    // Tali
    this._drawRope(ctx, px, py, bx, by);

    // Vektor gaya
    if (this.showVectors) this._drawVectors(ctx, bx, by, pendulum);

    // Bob
    this._drawBob(ctx, bx, by, bobR, this.color);

    // Pivot
    this._drawPivot(ctx, px, py);
  }

  // ═══════════════════════════════════════════════════════
  // Render DOUBLE pendulum
  // ═══════════════════════════════════════════════════════
  drawDouble(dp) {
    const ctx = this.ctx;
    this._resize();
    const w = this.canvas.width;
    const h = this.canvas.height;
    const px = w / 2;
    const py = h * 0.18;
    const totalL = dp.l1 + dp.l2;
    const scale  = (h * 0.70) / totalL;

    ctx.clearRect(0, 0, w, h);

    const b1 = dp.bob1Position();
    const b2 = dp.bob2Position();
    const b1x = px + b1.x * scale;
    const b1y = py + b1.y * scale;
    const b2x = px + b2.x * scale;
    const b2y = py + b2.y * scale;

    // Jejak bob2
    if (this.showTrace) this._drawTrace(ctx, px, py, scale, dp.tracePoints, '#7c4dff', false);

    // Tali 1
    this._drawRope(ctx, px, py, b1x, b1y);
    // Tali 2
    this._drawRope(ctx, b1x, b1y, b2x, b2y, '#666');

    // Bob 1
    this._drawBob(ctx, b1x, b1y, 12, '#ff6d00');
    // Bob 2
    this._drawBob(ctx, b2x, b2y, 14, '#7c4dff');

    // Pivot
    this._drawPivot(ctx, px, py);
  }

  // ─── Pivot (titik tumpu) ─────────────────────────────────
  _drawPivot(ctx, px, py) {
    // Dudukan
    ctx.fillStyle = '#333';
    ctx.fillRect(px - 24, py - 10, 48, 10);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 24, py - 10, 48, 10);

    // Pin pivot
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // ─── Tali ───────────────────────────────────────────────
  _drawRope(ctx, x1, y1, x2, y2, color = '#333') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.stroke();
  }

  // ─── Bob ────────────────────────────────────────────────
  _drawBob(ctx, bx, by, r, color) {
    // Shadow komik
    ctx.beginPath();
    ctx.arc(bx + 4, by + 4, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Fill
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Border tebal
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.arc(bx - r*0.35, by - r*0.35, r * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();
  }

  // ─── Jejak lintasan ──────────────────────────────────────
  _drawTrace(ctx, px, py, scale, points, color, relative = true) {
    if (points.length < 2) return;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const tx = relative ? px + points[i].x * scale : px + points[i].x * scale;
      const ty = relative ? py + points[i].y * scale : py + points[i].y * scale;
      if (i === 0) ctx.moveTo(tx, ty);
      else ctx.lineTo(tx, ty);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.45;
    ctx.setLineDash([3, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  // ─── Vektor gaya ─────────────────────────────────────────
  _drawVectors(ctx, bx, by, pendulum) {
    const scale   = 18; // px per Newton
    const { gravity: Fg, tension: Ft } = pendulum.forceVectors();

    // Vektor gravitasi (ke bawah)
    const gLen = Math.min(Fg * scale, 90);
    this._drawArrow(ctx, bx, by, bx, by + gLen, '#e8003d', 'Fg');

    // Vektor tegangan (ke arah pivot)
    const angle = pendulum.angle;
    const tLen  = Math.min(Ft * scale, 80);
    const tx    = bx - Math.sin(angle) * tLen;
    const ty    = by - Math.cos(angle) * tLen;
    this._drawArrow(ctx, bx, by, tx, ty, '#00a846', 'T');
  }

  // ─── Panah vektor ────────────────────────────────────────
  _drawArrow(ctx, x1, y1, x2, y2, color, label = '') {
    const headLen = 10;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Kepala panah
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI/7),
               y2 - headLen * Math.sin(angle - Math.PI/7));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI/7),
               y2 - headLen * Math.sin(angle + Math.PI/7));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    if (label) {
      ctx.font = 'bold 11px Space Mono, monospace';
      ctx.fillStyle = color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.strokeText(label, x2 + 4, y2 + 4);
      ctx.fillText(label, x2 + 4, y2 + 4);
    }
  }

  // ─── Busur derajat ───────────────────────────────────────
  _drawProtractor(ctx, px, py, scale, length) {
    const r = length * scale * 0.9;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tick setiap 15°
    for (let deg = -90; deg <= 90; deg += 15) {
      const rad = deg * Math.PI / 180;
      const sx  = px + r * Math.sin(rad);
      const sy  = py + r * Math.cos(rad);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label derajat
      ctx.font = '9px Space Mono, monospace';
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillText(`${deg}°`, sx + 2, sy + 3);
    }
  }
}


/* ═══════════════════════════════════════════════════════════
   EnergyChart — grafik energi real-time
   Menggunakan canvas 2D manual (tidak butuh library eksternal)
═══════════════════════════════════════════════════════════ */
class EnergyChart {
  constructor(canvasId) {
    this.canvas  = document.getElementById(canvasId);
    this.ctx     = this.canvas.getContext('2d');
    this.history = [];  // { ep, ek, et }[]
    this.maxPoints = 120;
    this.visible = true;
  }

  push(ep, ek, et) {
    this.history.push({ ep, ek, et });
    if (this.history.length > this.maxPoints) this.history.shift();
  }

  draw() {
    if (!this.visible) return;
    const ctx = this.ctx;
    const w = this.canvas.width  = this.canvas.offsetWidth;
    const h = this.canvas.height = this.canvas.offsetHeight || 130;
    const pad = { t: 8, r: 8, b: 20, l: 32 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;

    ctx.clearRect(0, 0, w, h);

    if (this.history.length < 2) return;

    // Cari max energy
    let maxE = 0;
    for (const d of this.history) maxE = Math.max(maxE, d.et);
    if (maxE === 0) maxE = 1;

    const colors = {
      ep: '#e8003d',
      ek: '#00a846',
      et: '#ffd600',
    };

    // Grid garis
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.8;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + ih * (i / 4);
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + iw, y);
      ctx.stroke();
      ctx.fillStyle = '#888';
      ctx.font = '8px Space Mono, monospace';
      ctx.fillText(((1 - i/4) * maxE).toFixed(2), 0, y + 3);
    }

    // Plot tiap garis energi
    const keys = ['et', 'ep', 'ek'];
    for (const key of keys) {
      ctx.beginPath();
      for (let i = 0; i < this.history.length; i++) {
        const x = pad.l + (i / (this.maxPoints - 1)) * iw;
        const y = pad.t + ih * (1 - this.history[i][key] / maxE);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[key];
      ctx.lineWidth = key === 'et' ? 2 : 1.5;
      ctx.setLineDash(key === 'et' ? [4, 3] : []);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Axis
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, pad.t + ih);
    ctx.lineTo(pad.l + iw, pad.t + ih);
    ctx.stroke();
  }

  clear() {
    this.history = [];
  }
}
