/* ═══════════════════════════════════════════════════════════
   ui.js — User Interface Handlers
   Semua event listener & DOM update ada di sini.
   Untuk menambah kontrol baru, tambah binding di initUI().
═══════════════════════════════════════════════════════════ */

const UI = (() => {

  // ─── Referensi elemen DOM ─────────────────────────────
  const el = {
    // Sliders A
    slLength:   () => document.getElementById('sl-length'),
    slMass:     () => document.getElementById('sl-mass'),
    slAngle:    () => document.getElementById('sl-angle'),
    slDamping:  () => document.getElementById('sl-damping'),
    valLength:  () => document.getElementById('val-length'),
    valMass:    () => document.getElementById('val-mass'),
    valAngle:   () => document.getElementById('val-angle'),
    valDamping: () => document.getElementById('val-damping'),

    // Sliders B (compare mode)
    slLengthB:  () => document.getElementById('sl-length-b'),
    slAngleB:   () => document.getElementById('sl-angle-b'),
    valLengthB: () => document.getElementById('val-length-b'),
    valAngleB:  () => document.getElementById('val-angle-b'),

    // Toggles
    togVectors:    () => document.getElementById('tog-vectors'),
    togTrace:      () => document.getElementById('tog-trace'),
    togProtractor: () => document.getElementById('tog-protractor'),
    togEnergy:     () => document.getElementById('tog-energy'),

    // Gravity buttons
    gravityBtns: () => document.querySelectorAll('.gravity-btn'),

    // Controls
    btnPlay:       () => document.getElementById('btn-play'),
    btnReset:      () => document.getElementById('btn-reset'),
    btnClearTrace: () => document.getElementById('btn-clear-trace'),

    // Mode tabs
    modeTabs: () => document.querySelectorAll('.mode-tab'),

    // Canvas elements
    canvasB:       () => document.getElementById('canvas-b'),
    sectionCompare:() => document.getElementById('section-compare-b'),

    // Stopwatch
    swTime:   () => document.getElementById('sw-time'),
    swPeriod: () => document.getElementById('sw-period'),

    // Readout bar
    rdAngle: () => document.getElementById('rd-angle'),
    rdOmega: () => document.getElementById('rd-omega'),
    rdVel:   () => document.getElementById('rd-vel'),
    rdEp:    () => document.getElementById('rd-ep'),
    rdEk:    () => document.getElementById('rd-ek'),
    rdG:     () => document.getElementById('rd-g'),

    // Formula box
    fPeriod:  () => document.getElementById('f-period'),
    fFreq:    () => document.getElementById('f-freq'),
    fLength:  () => document.getElementById('f-length'),
    fMass:    () => document.getElementById('f-mass'),
    fGravity: () => document.getElementById('f-gravity'),
    fEtotal:  () => document.getElementById('f-etotal'),

    // Chart panel
    panelChart: () => document.getElementById('panel-chart'),
  };

  // ─── Init semua event listeners ──────────────────────
  function init(appCallbacks) {
    _bindSliders(appCallbacks);
    _bindGravity(appCallbacks);
    _bindToggles(appCallbacks);
    _bindButtons(appCallbacks);
    _bindModeTabs(appCallbacks);
  }

  function _bindSliders(cb) {
    // Slider A
    el.slLength().addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      el.valLength().textContent = v.toFixed(2) + ' m';
      cb.onParamChange('length', v);
    });
    el.slMass().addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      el.valMass().textContent = v.toFixed(1) + ' kg';
      cb.onParamChange('mass', v);
    });
    el.slAngle().addEventListener('input', e => {
      const v = parseInt(e.target.value);
      el.valAngle().textContent = v + '°';
      cb.onParamChange('angle', v * Math.PI / 180);
    });
    el.slDamping().addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      let label = 'Ideal';
      if (v > 0.035) label = 'Berat';
      else if (v > 0.01) label = 'Sedang';
      else if (v > 0) label = 'Ringan';
      el.valDamping().textContent = label;
      cb.onParamChange('damping', v);
    });

    // Slider B (compare)
    el.slLengthB().addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      el.valLengthB().textContent = v.toFixed(2) + ' m';
      cb.onParamChangeB('length', v);
    });
    el.slAngleB().addEventListener('input', e => {
      const v = parseInt(e.target.value);
      el.valAngleB().textContent = v + '°';
      cb.onParamChangeB('angle', v * Math.PI / 180);
    });
  }

  function _bindGravity(cb) {
    el.gravityBtns().forEach(btn => {
      btn.addEventListener('click', () => {
        el.gravityBtns().forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cb.onGravityChange(parseFloat(btn.dataset.g), btn.dataset.label);
      });
    });
  }

  function _bindToggles(cb) {
    el.togVectors().addEventListener('change',    e => cb.onToggle('vectors',    e.target.checked));
    el.togTrace().addEventListener('change',      e => cb.onToggle('trace',      e.target.checked));
    el.togProtractor().addEventListener('change', e => cb.onToggle('protractor', e.target.checked));
    el.togEnergy().addEventListener('change',     e => cb.onToggle('energy',     e.target.checked));
  }

  function _bindButtons(cb) {
    el.btnPlay().addEventListener('click',       () => cb.onPlayPause());
    el.btnReset().addEventListener('click',      () => cb.onReset());
    el.btnClearTrace().addEventListener('click', () => cb.onClearTrace());
  }

  function _bindModeTabs(cb) {
    el.modeTabs().forEach(tab => {
      tab.addEventListener('click', () => {
        el.modeTabs().forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        cb.onModeChange(tab.dataset.mode);
      });
    });
  }

  // ─── Update display functions ─────────────────────────
  function setPlayState(running) {
    const btn = el.btnPlay();
    btn.textContent = running ? '⏸ Pause' : '▶ Mulai';
    btn.classList.toggle('running', running);
  }

  function updateStopwatch(time, period) {
    el.swTime().textContent = time.toFixed(3) + ' s';
    el.swPeriod().textContent = period
      ? period.toFixed(3) + ' s/siklus'
      : '— s/siklus';
  }

  function updateReadout(pendulum) {
    el.rdAngle().textContent = (pendulum.angle * 180 / Math.PI).toFixed(2) + '°';
    el.rdOmega().textContent = pendulum.omega.toFixed(3) + ' rad/s';
    el.rdVel().textContent   = pendulum.velocity().toFixed(3) + ' m/s';
    el.rdEp().textContent    = pendulum.potentialEnergy().toFixed(3) + ' J';
    el.rdEk().textContent    = pendulum.kineticEnergy().toFixed(3) + ' J';
    el.rdG().textContent     = pendulum.gravity.toFixed(2) + ' m/s²';
  }

  function updateFormulaBox(pendulum) {
    const T = pendulum.theoreticalPeriod();
    el.fPeriod().textContent  = T.toFixed(4) + ' s';
    el.fFreq().textContent    = (1/T).toFixed(4) + ' Hz';
    el.fLength().textContent  = pendulum.length.toFixed(2) + ' m';
    el.fMass().textContent    = pendulum.mass.toFixed(1) + ' kg';
    el.fGravity().textContent = pendulum.gravity.toFixed(2) + ' m/s²';
    el.fEtotal().textContent  = pendulum.totalEnergy().toFixed(4) + ' J';
  }

  function showComparePanel(show) {
    el.sectionCompare().classList.toggle('hidden', !show);
    el.canvasB().classList.toggle('hidden', !show);
  }

  function showChartPanel(show) {
    el.panelChart().style.display = show ? '' : 'none';
  }

  return { init, setPlayState, updateStopwatch, updateReadout, updateFormulaBox, showComparePanel, showChartPanel };
})();
