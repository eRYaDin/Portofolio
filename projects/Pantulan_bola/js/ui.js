// ==================== UI INTERACTION HANDLERS ====================

// DOM Elements
const ballSelect = document.getElementById("ballSelect");
const ballIcon = document.getElementById("ballIcon");
const ballInfo = document.getElementById("ballInfo");
const v0Slider = document.getElementById("v0Slider");
const v0Input = document.getElementById("v0Input");
const v0Display = document.getElementById("v0Display");
const angleSlider = document.getElementById("angleSlider");
const angleInput = document.getElementById("angleInput");
const angleDisplay = document.getElementById("angleDisplay");
const heightSlider = document.getElementById("heightSlider");
const heightInput = document.getElementById("heightInput");
const heightDisplay = document.getElementById("heightDisplay");
const restSlider = document.getElementById("restSlider");
const restDisplay = document.getElementById("restDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const themeBtn = document.getElementById("themeBtn");
const loopCheckbox = document.getElementById("loopCheckbox");

// ==================== INITIALIZATION ====================

/**
 * Inisialisasi dropdown pilihan bola
 */
function initBallSelect() {
  balls.forEach((ball, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = ball.name;
    ballSelect.appendChild(option);
  });
  updateBallPreview();
}

/**
 * Update preview bola yang dipilih
 */
function updateBallPreview() {
  const ball = balls[ballSelect.value];
  
  // Update gambar bola
  const img = ballImages[ballSelect.value];
  if (img && img.complete) {
    ballIcon.style.backgroundImage = `url('${ball.image}')`;
    ballIcon.style.backgroundSize = 'cover';
    ballIcon.style.backgroundPosition = 'center';
  } else {
    // Fallback warna jika gambar belum load
    ballIcon.style.background = '#ffeb3b';
  }
  
  // Update info bola
  ballInfo.innerHTML = `Mass: ${ball.mass} kg<br>Diameter: ${ball.diameter} m`;
}

// ==================== SLIDER SYNCHRONIZATION ====================

/**
 * Sinkronisasi slider dan input number
 * @param {HTMLInputElement} slider 
 * @param {HTMLInputElement} input 
 * @param {HTMLElement} display 
 * @param {string} suffix 
 */
function syncSliderInput(slider, input, display, suffix = "") {
  slider.addEventListener("input", () => {
    input.value = slider.value;
    display.textContent = slider.value + suffix;
  });
  
  input.addEventListener("input", () => {
    slider.value = input.value;
    display.textContent = input.value + suffix;
  });
}

// ==================== STATS UPDATE ====================

/**
 * Update statistik real-time
 * @param {Object} dataPoint - Data pada frame tertentu
 */
function updateStats(dataPoint) {
  if (!dataPoint) return;
  
  document.getElementById("statTime").textContent = dataPoint.t.toFixed(2);
  document.getElementById("statPosX").textContent = dataPoint.x.toFixed(2);
  document.getElementById("statPosY").textContent = Math.max(0, dataPoint.y).toFixed(2);
  document.getElementById("statVelX").textContent = dataPoint.vx.toFixed(2);
  document.getElementById("statVelY").textContent = dataPoint.vy.toFixed(2);
  document.getElementById("statVelTotal").textContent = dataPoint.speed.toFixed(2);
  document.getElementById("statKE").textContent = dataPoint.ke.toFixed(4);
  document.getElementById("statPE").textContent = dataPoint.pe.toFixed(4);
  document.getElementById("statME").textContent = dataPoint.me.toFixed(4);
}

/**
 * Update ringkasan simulasi
 * @param {Object} summary 
 */
function updateSummary(summary) {
  document.getElementById("maxHeight").textContent = summary.maxHeight.toFixed(2) + " m";
  document.getElementById("totalDistance").textContent = summary.totalDistance.toFixed(2) + " m";
  document.getElementById("flightTime").textContent = summary.flightTime.toFixed(2) + " s";
  document.getElementById("bounceCount").textContent = summary.bounces;
}

/**
 * Reset semua statistik ke nilai awal
 */
function resetStats() {
  document.getElementById("statTime").textContent = "0.00";
  document.getElementById("statPosX").textContent = "0.00";
  document.getElementById("statPosY").textContent = "0.00";
  document.getElementById("statVelX").textContent = "0.00";
  document.getElementById("statVelY").textContent = "0.00";
  document.getElementById("statVelTotal").textContent = "0.00";
  document.getElementById("statKE").textContent = "0.00";
  document.getElementById("statPE").textContent = "0.00";
  document.getElementById("statME").textContent = "0.00";
  document.getElementById("maxHeight").textContent = "0.00 m";
  document.getElementById("totalDistance").textContent = "0.00 m";
  document.getElementById("flightTime").textContent = "0.00 s";
  document.getElementById("bounceCount").textContent = "0";
}

// ==================== THEME TOGGLE ====================

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  
  return isDark;
}

// ==================== BUTTON STATES ====================

/**
 * Update state tombol Start
 * @param {boolean} isRunning 
 */
function updateStartButton(isRunning) {
  if (isRunning) {
    startBtn.textContent = "⏸ Berjalan...";
    startBtn.disabled = true;
  } else {
    startBtn.textContent = "▶ Mulai";
    startBtn.disabled = false;
  }
}

// ==================== EVENT LISTENERS SETUP ====================

/**
 * Setup semua event listeners
 */
function setupEventListeners() {
  // Ball selection
  ballSelect.addEventListener("change", updateBallPreview);
  
  // Slider synchronization
  syncSliderInput(v0Slider, v0Input, v0Display, " m/s");
  syncSliderInput(angleSlider, angleInput, angleDisplay, "°");
  syncSliderInput(heightSlider, heightInput, heightDisplay, " m");
  
  // Restitusi slider (tanpa input number)
  restSlider.addEventListener("input", () => {
    restDisplay.textContent = restSlider.value;
  });
}

// ==================== GETTERS ====================

/**
 * Ambil parameter simulasi dari UI
 * @returns {Object}
 */
function getSimulationParams() {
  return {
    ballIndex: parseInt(ballSelect.value),
    v0: parseFloat(v0Input.value),
    angle: parseFloat(angleInput.value),
    height: parseFloat(heightInput.value),
    restitution: parseFloat(restSlider.value)
  };
}

/**
 * Cek apakah mode loop aktif
 * @returns {boolean}
 */
function isLoopMode() {
  return loopCheckbox.checked;
}


// ==================== NOTEBOOK: FETCH & RENDER (TAMBAHAN BARU) ====================

// Simpan raw source di sini agar bisa di-download & di-copy
let _notebookRawSource = null;

/**
 * Fetch source .py dari GitHub raw, lalu render sebagai notebook
 */
async function fetchAndRenderNotebook() {
  const loading = document.getElementById("notebookLoading");
  const error   = document.getElementById("notebookError");
  const cells   = document.getElementById("notebookCells");

  // Reset state
  loading.style.display = "flex";
  error.style.display   = "none";
  cells.innerHTML       = "";

  try {
    const res = await fetch(NOTEBOOK_CONFIG.rawUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const pySource = await res.text();
    _notebookRawSource = pySource;           // simpan untuk download

    // Sembunyikan loading
    loading.style.display = "none";

    // Render intro markdown (dari NOTEBOOK_CONFIG)
    const introHtml = markdownToHtml(NOTEBOOK_CONFIG.introMarkdown.join("\n"));
    cells.appendChild(createMarkdownCell(introHtml));

    // Parsing .py → cells (markdown comment-block & code)
    const parsed = parsePythonToCells(pySource);
    parsed.forEach((cell, idx) => {
      if (cell.type === "markdown") {
        cells.appendChild(createMarkdownCell(markdownToHtml(cell.content)));
      } else {
        cells.appendChild(createCodeCell(cell.content, idx + 1));
      }
    });

  } catch (err) {
    loading.style.display = "none";
    error.style.display   = "flex";
    document.getElementById("errorMessage").textContent = err.message || "Periksa koneksi internet Anda.";
  }
}

// ==================== NOTEBOOK: PARSING ====================

/**
 * Parsing isi .py menjadi array cell { type, content }
 * Aturan:
 *   - Block """ ... """ atau ''' ... ''' → markdown cell
 *   - Baris kosong beruntun (2+) → pemisah cell baru
 *   - Sisanya → code cell
 */
function parsePythonToCells(source) {
  const lines  = source.split("\n");
  const cells  = [];
  let buffer   = [];
  let inTriple = false;    // sedang di dalam """ / '''
  let tripleChar = null;   // """ atau '''
  let mdBuffer = [];       // buffer untuk markdown (isi triple-quote)

  function flushCode() {
    // Buang trailing blank lines
    while (buffer.length && buffer[buffer.length - 1].trim() === "") buffer.pop();
    if (buffer.length) {
      cells.push({ type: "code", content: buffer.join("\n") });
      buffer = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- Masuk / keluar triple-quote ---
    if (!inTriple) {
      // Cek opening triple-quote (standalone atau di awal variabel = """...""")
      const openMatch = trimmed.match(/^(?:\w+\s*=\s*)?("""|''')/);
      if (openMatch) {
        tripleChar = openMatch[1];
        // Cek apakah closing ada di baris yang sama (single-line docstring)
        const afterOpen = trimmed.slice(trimmed.indexOf(tripleChar) + 3);
        if (afterOpen.includes(tripleChar)) {
          // Single-line triple-quote → ambil isi
          flushCode();
          const inner = afterOpen.slice(0, afterOpen.indexOf(tripleChar)).trim();
          if (inner) cells.push({ type: "markdown", content: inner });
          continue;
        }
        // Multi-line: masuk mode triple
        flushCode();
        inTriple = true;
        mdBuffer = [];
        continue;
      }

      // Bukan triple-quote → tambah ke code buffer
      buffer.push(line);

    } else {
      // --- Di dalam triple-quote ---
      if (trimmed.includes(tripleChar)) {
        // Closing line
        const before = trimmed.slice(0, trimmed.indexOf(tripleChar));
        if (before.trim()) mdBuffer.push(before);
        // Flush sebagai markdown cell
        cells.push({ type: "markdown", content: mdBuffer.join("\n").trim() });
        mdBuffer = [];
        inTriple = false;
        tripleChar = null;
      } else {
        mdBuffer.push(line);
      }
    }
  }

  // Flush sisa
  if (inTriple && mdBuffer.length) {
    cells.push({ type: "markdown", content: mdBuffer.join("\n").trim() });
  }
  flushCode();

  // Gabungkan code cells yang kosong / terlalu pendek jika ada
  return cells.filter(c => c.content.trim().length > 0);
}

// ==================== NOTEBOOK: MARKDOWN RENDERER ====================

/**
 * Simple markdown → HTML
 * Mendukung: heading, bold, italic, inline code, code block, list, blockquote, link
 */
function markdownToHtml(md) {
  let lines = md.split("\n");
  let html  = "";
  let inList = false;
  let listTag = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Heading
    if (line.startsWith("### ")) { closeLst(); html += `<h3>${inlineFormat(line.slice(4))}</h3>`; continue; }
    if (line.startsWith("## "))  { closeLst(); html += `<h2>${inlineFormat(line.slice(3))}</h2>`; continue; }
    if (line.startsWith("# "))   { closeLst(); html += `<h1>${inlineFormat(line.slice(2))}</h1>`; continue; }

    // Blockquote
    if (line.startsWith("> ")) {
      closeLst();
      html += `<blockquote style="border-left:4px solid #ff9800;margin:8px 0;padding:6px 14px;background:rgba(255,152,0,0.08);border-radius:0 4px 4px 0;font-style:italic;color:#555;">${inlineFormat(line.slice(2))}</blockquote>`;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      if (!inList || listTag !== "ol") { closeLst(); html += "<ol>"; inList = true; listTag = "ol"; }
      html += `<li>${inlineFormat(line.replace(/^\d+\.\s/, ""))}</li>`;
      continue;
    }

    // Unordered list  (-, *, or •)
    if (/^[-*•]\s/.test(line)) {
      if (!inList || listTag !== "ul") { closeLst(); html += "<ul>"; inList = true; listTag = "ul"; }
      html += `<li>${inlineFormat(line.replace(/^[-*•]\s/, ""))}</li>`;
      continue;
    }

    // Kosong → tutup list, buat <br> ringan
    if (line.trim() === "") {
      closeLst();
      html += "<br>";
      continue;
    }

    // Paragraph biasa
    closeLst();
    html += `<p>${inlineFormat(line)}</p>`;
  }

  closeLst();
  return html;

  function closeLst() {
    if (inList) { html += `</${listTag}>`; inList = false; listTag = ""; }
  }
}

/**
 * Inline formatting: bold, italic, inline code, link
 */
function inlineFormat(text) {
  // Escape HTML entities dulu
  text = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  // Inline code  `...`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Link [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#2196f3;">$1</a>');
  // Bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}

// ==================== NOTEBOOK: DOM BUILDERS ====================

let _cellCounter = 0;

/**
 * Buat elemen DOM untuk markdown cell
 */
function createMarkdownCell(htmlContent) {
  const cell = document.createElement("div");
  cell.className = "nb-cell cell-markdown";

  cell.innerHTML = `
    <div class="nb-gutter"></div>
    <div class="nb-body">${htmlContent}</div>
  `;
  return cell;
}

/**
 * Buat elemen DOM untuk code cell
 * @param {string} code
 * @param {number} num — nomor cell (untuk gutter)
 */
function createCodeCell(code, num) {
  _cellCounter++;

  const cell = document.createElement("div");
  cell.className = "nb-cell cell-code";

  // Escape HTML di dalam code
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  cell.innerHTML = `
    <div class="nb-gutter">In [${num}]</div>
    <div class="nb-body"><pre>${escaped}</pre></div>
    <button class="nb-cell-copy" data-code="${escapeAttr(code)}">Copy</button>
  `;

  // Event: copy single cell
  cell.querySelector(".nb-cell-copy").addEventListener("click", function(e) {
    e.stopPropagation();
    copySingleCell(this);
  });

  return cell;
}

/**
 * Escape untuk attribute HTML
 */
function escapeAttr(str) {
  return str.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"&#10;");
}

// ==================== NOTEBOOK: COPY HELPERS ====================

/**
 * Copy kode satu cell
 */
function copySingleCell(btn) {
  const code = btn.getAttribute("data-code");
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = "✓ Copied";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1400);
  });
}

/**
 * Copy SEMUA kode (source .py asli)
 */
function copyAllCode() {
  if (!_notebookRawSource) return;
  navigator.clipboard.writeText(_notebookRawSource).then(() => {
    const btn = document.getElementById("copyAllBtn");
    const orig = btn.textContent;
    btn.textContent = "✓ Copied!";
    btn.style.background = "#4caf50";
    setTimeout(() => { btn.textContent = orig; btn.style.background = ""; }, 1400);
  });
}

// ==================== NOTEBOOK: DOWNLOAD .ipynb ====================

/**
 * Buat struktur JSON .ipynb dari source .py dan trigger download
 */
function downloadAsIpynb() {
  if (!_notebookRawSource) return;

  // Parse ulang menjadi cells
  const parsed = parsePythonToCells(_notebookRawSource);

  // Intro markdown cell
  const introCellMd = {
    cell_type: "markdown",
    metadata: {},
    source: NOTEBOOK_CONFIG.introMarkdown.map((l, i, a) => i < a.length - 1 ? l + "\n" : l)
  };

  const nbCells = [introCellMd];

  parsed.forEach(cell => {
    if (cell.type === "markdown") {
      nbCells.push({
        cell_type: "markdown",
        metadata: {},
        source: cell.content.split("\n").map((l, i, a) => i < a.length - 1 ? l + "\n" : l)
      });
    } else {
      nbCells.push({
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: cell.content.split("\n").map((l, i, a) => i < a.length - 1 ? l + "\n" : l)
      });
    }
  });

  // Struktur .ipynb lengkap (Notebook format v4)
  const notebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        name: "python",
        version: "3.10.0"
      }
    },
    cells: nbCells
  };

  // Trigger download
  const blob = new Blob([JSON.stringify(notebook, null, 1)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = NOTEBOOK_CONFIG.downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
