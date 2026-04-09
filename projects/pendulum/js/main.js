/* ═══════════════════════════════════════════════════════════
   main.js — App Entry Point & Animation Loop
   Menghubungkan pendulum.js + sketch.js + ui.js
   Untuk menambah mode/fitur baru, extend bagian APP._modes
═══════════════════════════════════════════════════════════ */

const APP = (() => {

  // ── State ──────────────────────────────────────────────
  let mode    = 'single';   // 'single' | 'compare' | 'double'
  let running = false;
  let lastTime = null;
  let rafId    = null;

  // ── Pendulum instances ─────────────────────────────────
  let pendA, pendB, doublePend;

  // ── Sketch (renderer) instances ───────────────────────
  let sketchA, sketchB;

  // ── Energy chart ──────────────────────────────────────
  let energyChart;

  // ── Konstanta default ──────────────────────────────────
  const DEFAULTS = {
    length:  1.5,
    mass:    1.0,
    angle:   30 * Math.PI / 180,
    gravity: 9.81,
    damping: 0,
    lengthB: 2.0,
    angleB:  30 * Math.PI / 180,
  };

  // ── Current params ──────────────────────────────────────
  const params = { ...DEFAULTS };

  // ── Inisialisasi ─────────────────────────────────────────
  function init() {
    pendA = new Pendulum({
      length:  params.length,
      mass:    params.mass,
      angle:   params.angle,
      gravity: params.gravity,
      damping: params.damping,
    });
    pendB = new Pendulum({
      length:  params.lengthB,
      mass:    1.0,
      angle:   params.angleB,
      gravity: params.gravity,
      damping: params.damping,
    });
    doublePend = new DoublePendulum({ gravity: params.gravity });

    sketchA = new Sketch('canvas-a', '#e8003d');
    sketchB = new Sketch('canvas-b', '#e65100');
    energyChart = new EnergyChart('energy-chart');

    // Init UI bindings
    UI.init({
      onParamChange:  _onParamChange,
      onParamChangeB: _onParamChangeB,
      onGravityChange:_onGravityChange,
      onToggle:       _onToggle,
      onPlayPause:    _onPlayPause,
      onReset:        _onReset,
      onClearTrace:   _onClearTrace,
      onModeChange:   _onModeChange,
    });

    // Resize observer — redraw saat ukuran berubah
    const resizeOb = new ResizeObserver(() => _drawFrame());
    resizeOb.observe(document.getElementById('canvas-wrapper'));

    // Initial draw
    _drawFrame();
    UI.updateReadout(pendA);
    UI.updateFormulaBox(pendA);
  }

  // ── Animation Loop ────────────────────────────────────
  function _loop(timestamp) {
    if (!running) return;
    if (!lastTime) lastTime = timestamp;

    let dt = (timestamp - lastTime) / 1000; // detik
    lastTime = timestamp;

    // Batasi dt agar tidak meledak saat tab background
    dt = Math.min(dt, 0.05);

    // Substep untuk akurasi fisika
    const substeps = 4;
    const subDt    = dt / substeps;

    for (let i = 0; i < substeps; i++) {
      if (mode === 'double') {
        doublePend.step(subDt);
      } else {
        pendA.step(subDt);
        if (mode === 'compare') pendB.step(subDt);
      }
    }

    // Update energy chart
    energyChart.push(
      pendA.potentialEnergy(),
      pendA.kineticEnergy(),
      pendA.totalEnergy()
    );

    _drawFrame();

    // Update UI readout
    UI.updateStopwatch(pendA.time, pendA.measuredPeriod);
    UI.updateReadout(pendA);
    UI.updateFormulaBox(pendA);

    rafId = requestAnimationFrame(_loop);
  }

  // ── Render satu frame ──────────────────────────────────
  function _drawFrame() {
    if (mode === 'double') {
      sketchA.drawDouble(doublePend);
    } else {
      sketchA.drawSingle(pendA);
      if (mode === 'compare') sketchB.drawSingle(pendB);
    }
    energyChart.draw();
  }

  // ── Callbacks dari UI ─────────────────────────────────

  function _onParamChange(key, value) {
    params[key] = value;
    pendA.setParam(key, value);
    // Reset angle saat slider angle diubah dan tidak running
    if (key === 'angle' && !running) {
      pendA.reset(value);
      energyChart.clear();
    }
    if (!running) _drawFrame();
    UI.updateFormulaBox(pendA);
  }

  function _onParamChangeB(key, value) {
    params[key + 'B'] = value;
    pendB.setParam(key, value);
    if (key === 'angle' && !running) {
      pendB.reset(value);
    }
    if (!running) _drawFrame();
  }

  function _onGravityChange(g, label) {
    params.gravity = g;
    pendA.setParam('gravity', g);
    pendB.setParam('gravity', g);
    doublePend.gravity = g;
    if (!running) _drawFrame();
    UI.updateFormulaBox(pendA);
    UI.updateReadout(pendA);
  }

  function _onToggle(key, value) {
    switch (key) {
      case 'vectors':
        sketchA.showVectors = value;
        sketchB.showVectors = value;
        break;
      case 'trace':
        sketchA.showTrace = value;
        sketchB.showTrace = value;
        break;
      case 'protractor':
        sketchA.showProtractor = value;
        sketchB.showProtractor = value;
        break;
      case 'energy':
        energyChart.visible = value;
        UI.showChartPanel(value);
        break;
    }
    if (!running) _drawFrame();
  }

  function _onPlayPause() {
    running = !running;
    UI.setPlayState(running);
    if (running) {
      lastTime = null;
      rafId = requestAnimationFrame(_loop);
    } else {
      cancelAnimationFrame(rafId);
    }
  }

  function _onReset() {
    running = false;
    cancelAnimationFrame(rafId);
    UI.setPlayState(false);

    pendA.reset(params.angle);
    pendB.reset(params.angleB);
    doublePend.reset();
    energyChart.clear();

    lastTime = null;
    _drawFrame();
    UI.updateStopwatch(0, null);
    UI.updateReadout(pendA);
    UI.updateFormulaBox(pendA);
  }

  function _onClearTrace() {
    pendA.clearTrace();
    pendB.clearTrace();
    doublePend.clearTrace();
    energyChart.clear();
    if (!running) _drawFrame();
  }

  function _onModeChange(newMode) {
    mode = newMode;

    // Tampilkan / sembunyikan canvas B & panel compare
    UI.showComparePanel(mode === 'compare');

    // Reset semua saat ganti mode
    _onReset();
  }

  return { init };
})();

// ── Jalankan saat DOM siap ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => APP.init());
