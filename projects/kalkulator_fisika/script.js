// ==================== UNIT DEFINITIONS ====================
const units = {
    panjang: {
        base: "m",
        units: {
            m: 1,
            km: 1000,
            cm: 0.01,
            mm: 0.001,
            µm: 0.000001,
            nm: 0.000000001,
            mi: 1609.34,
            yd: 0.9144,
            ft: 0.3048,
            in: 0.0254
        }
    },
    massa: {
        base: "kg",
        units: {
            kg: 1,
            g: 0.001,
            mg: 0.000001,
            ton: 1000,
            lb: 0.453592,
            oz: 0.0283495,
            slug: 14.5939
        }
    },
    waktu: {
        base: "s",
        units: {
            s: 1,
            min: 60,
            h: 3600,
            day: 86400,
            week: 604800,
            ms: 0.001,
            µs: 0.000001,
            ns: 0.000000001
        }
    },
    kecepatan: {
        base: "m/s",
        units: {
            "m/s": 1,
            "km/h": 1/3.6,
            "mph": 0.44704,
            "ft/s": 0.3048,
            "knot": 0.514444
        }
    },
    percepatan: {
        base: "m/s²",
        units: {
            "m/s²": 1,
            "ft/s²": 0.3048,
            "g": 9.80665
        }
    },
    gaya: {
        base: "N",
        units: {
            N: 1,
            kN: 1000,
            dyne: 0.00001,
            lbf: 4.44822,
            kgf: 9.80665
        }
    },
    arus: {
        base: "A",
        units: {
            A: 1,
            mA: 0.001,
            µA: 0.000001,
            kA: 1000
        }
    },
    tegangan: {
        base: "V",
        units: {
            V: 1,
            mV: 0.001,
            kV: 1000,
            MV: 1000000
        }
    },
    hambatan: {
        base: "Ω",
        units: {
            Ω: 1,
            kΩ: 1000,
            MΩ: 1000000,
            mΩ: 0.001
        }
    },
    daya: {
        base: "W",
        units: {
            W: 1,
            kW: 1000,
            MW: 1000000,
            hp: 745.7,
            mW: 0.001
        }
    },
    energi: {
        base: "J",
        units: {
            J: 1,
            kJ: 1000,
            MJ: 1000000,
            cal: 4.184,
            kcal: 4184,
            Wh: 3600,
            kWh: 3600000,
            eV: 1.60218e-19
        }
    },
    muatan: {
        base: "C",
        units: {
            C: 1,
            mC: 0.001,
            µC: 0.000001,
            nC: 0.000000001
        }
    },
    kapasitansi: {
        base: "F",
        units: {
            F: 1,
            mF: 0.001,
            µF: 0.000001,
            nF: 0.000000001,
            pF: 0.000000000001
        }
    },
    induktansi: {
        base: "H",
        units: {
            H: 1,
            mH: 0.001,
            µH: 0.000001,
            nH: 0.000000001
        }
    },
    suhu: {
        base: "K",
        units: {
            K: 1,
            "°C": 1,
            "°F": 1
        }
    },
    tekanan: {
        base: "Pa",
        units: {
            Pa: 1,
            kPa: 1000,
            MPa: 1000000,
            atm: 101325,
            bar: 100000,
            psi: 6894.76,
            mmHg: 133.322,
            torr: 133.322
        }
    },
    frekuensi: {
        base: "Hz",
        units: {
            Hz: 1,
            kHz: 1000,
            MHz: 1000000,
            GHz: 1000000000,
            THz: 1000000000000
        }
    },
    luas: {
        base: "m²",
        units: {
            "m²": 1,
            "km²": 1000000,
            "cm²": 0.0001,
            "mm²": 0.000001,
            "ha": 10000,
            "acre": 4046.86,
            "ft²": 0.092903,
            "in²": 0.00064516
        }
    },
    volume: {
        base: "m³",
        units: {
            "m³": 1,
            "L": 0.001,
            "mL": 0.000001,
            "cm³": 0.000001,
            "ft³": 0.0283168,
            "in³": 0.0000163871,
            "gal": 0.00378541
        }
    }
};

// ==================== GLOBAL VARIABLES ====================
let currentCategory = 'panjang';
let conversionHistory = [];
let lastResult = '';
let resistorCount = 1;

// ==================== DOM ELEMENTS ====================
const inputUnitSelect = document.getElementById('input-unit');
const outputUnitSelect = document.getElementById('output-unit');
const inputValue = document.getElementById('input-value');
const convertBtn = document.getElementById('convert-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const swapBtn = document.getElementById('swap-btn');
const resultP = document.getElementById('result');
const equivalenceP = document.getElementById('equivalence');
const formulaContainer = document.getElementById('formula-container');
const themeToggle = document.getElementById('theme-toggle');
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistory = document.getElementById('clear-history');
const searchBar = document.getElementById('search-bar');

// ==================== INITIALIZATION ====================
function init() {
    initBackground();
    updateUnits(currentCategory);
    renderHistory();
    loadTheme();
    attachEventListeners();
    initCalculators();
}

// ==================== BACKGROUND SYMBOLS ====================
function initBackground() {
    const layer = document.getElementById('background-layer');
    const formulas = [
        '∫ f(x) dx', 'dE/dt', '∂ψ/∂t', '∇·E', '∇×B', 'F = ma', 'v = dx/dt', 
        'a = d²x/dt²', 'V = IR', 'I = dq/dt', 'U = ½CV²', 'E = mc²', 'F = qE',
        'P = IV', 'c = λν', 'ω = 2πf', 'k = 2π/λ', 'α', 'β', 'γ', 'τ', 'ρ', 
        'ε₀', 'μ₀', 'ħ', 'ψ', '∇', '∂', '∮', '→', '⊗', '≈', '≠', '∞', '∝'
    ];
    
    for (let i = 0; i < 60; i++) {
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = formulas[Math.floor(Math.random() * formulas.length)];
        div.style.left = `${Math.random() * 120 - 10}%`;
        div.style.top = `${Math.random() * 120 - 10}%`;
        div.style.fontSize = `${Math.random() * 2 + 0.5}rem`;
        div.style.animationDuration = `${Math.random() * 20 + 30}s`;
        div.style.animationDelay = `${Math.random() * 10}s`;
        layer.appendChild(div);
    }
}

// ==================== UNIT UPDATES ====================
function updateUnits(category) {
    const unitOptions = Object.keys(units[category].units);
    inputUnitSelect.innerHTML = '';
    outputUnitSelect.innerHTML = '';
    
    unitOptions.forEach(unit => {
        inputUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        outputUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    if (unitOptions.length > 1) {
        outputUnitSelect.value = unitOptions[1];
    }
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            document.getElementById(`${tabName}-section`).classList.add('active');
        });
    });

    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const active = document.querySelector('.menu-item.active');
            if (active) active.classList.remove('active');
            item.classList.add('active');
            currentCategory = item.dataset.category;
            updateUnits(currentCategory);
            clearResults();
        });
    });

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });

    // Conversion buttons
    convertBtn.addEventListener('click', performConversion);
    resetBtn.addEventListener('click', resetForm);
    copyBtn.addEventListener('click', copyResult);
    swapBtn.addEventListener('click', swapUnits);

    // History
    historyToggle.addEventListener('click', toggleHistory);
    clearHistory.addEventListener('click', clearAllHistory);

    // Theme
    themeToggle.addEventListener('click', toggleTheme);

    // Enter key support
    inputValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performConversion();
    });
}

// ==================== CONVERSION LOGIC ====================
function performConversion() {
    const value = parseFloat(inputValue.value);
    const fromUnit = inputUnitSelect.value;
    const toUnit = outputUnitSelect.value;
    
    if (isNaN(value)) {
        showError('Masukkan nilai yang valid!');
        return;
    }
    
    let result;
    
    // Temperature conversion (special case)
    if (currentCategory === 'suhu') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        // Standard conversion
        const baseValue = value * units[currentCategory].units[fromUnit];
        result = baseValue / units[currentCategory].units[toUnit];
    }
    
    displayResult(value, fromUnit, result, toUnit);
    showFormula(fromUnit, toUnit);
    addToHistory({
        category: currentCategory,
        value,
        fromUnit,
        toUnit,
        result: formatNumber(result),
        timestamp: new Date().toLocaleString('id-ID')
    });
}

function convertTemperature(value, from, to) {
    let tempInK;
    
    // Convert to Kelvin first
    if (from === 'K') tempInK = value;
    else if (from === '°C') tempInK = value + 273.15;
    else if (from === '°F') tempInK = (value - 32) * 5/9 + 273.15;
    
    // Convert from Kelvin to target
    if (to === 'K') return tempInK;
    else if (to === '°C') return tempInK - 273.15;
    else if (to === '°F') return (tempInK - 273.15) * 9/5 + 32;
}

function formatNumber(num) {
    if (Math.abs(num) >= 1000 || (Math.abs(num) < 0.001 && num !== 0)) {
        return num.toExponential(4);
    } else {
        return parseFloat(num.toPrecision(6));
    }
}

// ==================== DISPLAY FUNCTIONS ====================
function displayResult(inputVal, fromUnit, resultVal, toUnit) {
    const formatted = formatNumber(resultVal);
    lastResult = `${inputVal} ${fromUnit} = ${formatted} ${toUnit}`;
    resultP.textContent = `💥 ${lastResult}`;
    resultP.style.color = '#2e7d32';
}

function showFormula(fromUnit, toUnit) {
    if (currentCategory === 'suhu') {
        formulaContainer.innerHTML = '';
        return;
    }
    
    const factor = units[currentCategory].units[toUnit] / units[currentCategory].units[fromUnit];
    formulaContainer.innerHTML = `
        <div class="formula-box">
            Faktor konversi: 1 ${fromUnit} = ${formatNumber(factor)} ${toUnit}
        </div>
    `;
}

function showError(message) {
    resultP.textContent = `❌ ${message}`;
    resultP.style.color = '#d32f2f';
    equivalenceP.textContent = '';
    formulaContainer.innerHTML = '';
}

function clearResults() {
    resultP.textContent = 'Siap konversi!';
    resultP.style.color = '#d32f2f';
    equivalenceP.textContent = '';
    formulaContainer.innerHTML = '';
}

// ==================== UTILITY FUNCTIONS ====================
function swapUnits() {
    const temp = inputUnitSelect.value;
    inputUnitSelect.value = outputUnitSelect.value;
    outputUnitSelect.value = temp;
}

function resetForm() {
    inputValue.value = '';
    clearResults();
}

function copyResult() {
    if (lastResult) {
        navigator.clipboard.writeText(lastResult).then(() => {
            showNotification('✅ Hasil disalin!');
        });
    } else {
        showNotification('⚠️ Belum ada hasil untuk disalin');
    }
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 2000);
}

// ==================== HISTORY MANAGEMENT ====================
function addToHistory(item) {
    conversionHistory.unshift(item);
    if (conversionHistory.length > 50) {
        conversionHistory = conversionHistory.slice(0, 50);
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666;">Belum ada riwayat konversi</p>';
        return;
    }
    
    conversionHistory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-content">
                <div>${item.value} ${item.fromUnit} → ${item.result} ${item.toUnit}</div>
                <div class="history-timestamp">${item.timestamp}</div>
            </div>
            <button class="delete-btn" onclick="deleteHistoryItem(${index})">✖</button>
        `;
        
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                loadFromHistory(item);
            }
        });
        
        historyList.appendChild(div);
    });
}

function loadFromHistory(item) {
    const menuItem = document.querySelector(`.menu-item[data-category="${item.category}"]`);
    if (menuItem) {
        menuItem.click();
        inputValue.value = item.value;
        
        setTimeout(() => {
            inputUnitSelect.value = item.fromUnit;
            outputUnitSelect.value = item.toUnit;
        }, 100);
        
        showNotification('📥 Konversi dimuat dari riwayat');
    }
}

window.deleteHistoryItem = function(index) {
    conversionHistory.splice(index, 1);
    renderHistory();
};

function clearAllHistory() {
    if (confirm('Hapus semua riwayat konversi?')) {
        conversionHistory = [];
        renderHistory();
        showNotification('🗑️ Riwayat dihapus');
    }
}

function toggleHistory() {
    const isHidden = historyPanel.style.display === 'none';
    historyPanel.style.display = isHidden ? 'flex' : 'none';
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

function loadTheme() {
    themeToggle.textContent = '🌙';
}

// ==================== CALCULATOR FUNCTIONS ====================
function initCalculators() {
    document.querySelectorAll('.calc-card').forEach(card => {
        card.addEventListener('click', () => {
            const calcType = card.dataset.calc;
            showCalculator(calcType);
        });
    });
}

function showCalculator(type) {
    const calcPanels = document.getElementById('calc-panels');
    calcPanels.innerHTML = '';
    
    const panel = document.createElement('div');
    panel.className = 'card calc-panel';
    
    switch(type) {
        case 'resistor':
            panel.innerHTML = createResistorCalc();
            break;
        case 'ohm':
            panel.innerHTML = createOhmCalc();
            break;
        case 'power':
            panel.innerHTML = createPowerCalc();
            break;
        case 'capacitor':
            panel.innerHTML = createCapacitorCalc();
            break;
        case 'motion':
            panel.innerHTML = createMotionCalc();
            break;
        case 'weight':
            panel.innerHTML = createWeightCalc();
            break;
        case 'si-converter':
            panel.innerHTML = createSIConverter();
            break;
        case 'scientific':
            panel.innerHTML = createScientificNotation();
            break;
    }
    
    calcPanels.appendChild(panel);
    attachCalculatorEvents(type);
}

function createResistorCalc() {
    return `
        <div class="calc-panel-header">
            <h2>🔌 Kalkulator Total Hambatan</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="mode-selector">
            <button class="mode-btn active" data-mode="series">Seri</button>
            <button class="mode-btn" data-mode="parallel">Paralel</button>
        </div>
        <div class="resistor-inputs" id="resistor-inputs">
            <div class="resistor-input-item">
                <label>R1 (Ω):</label>
                <input type="number" class="resistor-value" placeholder="0" step="any">
            </div>
        </div>
        <button class="add-resistor-btn" onclick="addResistor()">➕ Tambah Resistor</button>
        <button onclick="calculateResistor()" style="margin-top: 15px; width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="resistor-result" style="display: none;"></div>
    `;
}

function createOhmCalc() {
    return `
        <div class="calc-panel-header">
            <h2>⚡ Hukum Ohm (V = I × R)</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="calc-input-group">
            <label>Tegangan (V):</label>
            <input type="number" id="ohm-v" placeholder="Kosongkan jika ingin dicari" step="any">
        </div>
        <div class="calc-input-group">
            <label>Arus (A):</label>
            <input type="number" id="ohm-i" placeholder="Kosongkan jika ingin dicari" step="any">
        </div>
        <div class="calc-input-group">
            <label>Hambatan (Ω):</label>
            <input type="number" id="ohm-r" placeholder="Kosongkan jika ingin dicari" step="any">
        </div>
        <button onclick="calculateOhm()" style="width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="ohm-result" style="display: none;"></div>
    `;
}

function createPowerCalc() {
    return `
        <div class="calc-panel-header">
            <h2>💡 Kalkulator Daya Listrik</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="calc-input-group">
            <label>Tegangan (V):</label>
            <input type="number" id="power-v" placeholder="Masukkan tegangan" step="any">
        </div>
        <div class="calc-input-group">
            <label>Arus (A):</label>
            <input type="number" id="power-i" placeholder="Masukkan arus" step="any">
        </div>
        <button onclick="calculatePower()" style="width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="power-result" style="display: none;"></div>
    `;
}

function createCapacitorCalc() {
    return `
        <div class="calc-panel-header">
            <h2>🔋 Kalkulator Kapasitor</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="mode-selector">
            <button class="mode-btn active" data-mode="series">Seri</button>
            <button class="mode-btn" data-mode="parallel">Paralel</button>
        </div>
        <div class="calc-input-group">
            <label>C1 (µF):</label>
            <input type="number" id="cap-1" placeholder="0" step="any">
        </div>
        <div class="calc-input-group">
            <label>C2 (µF):</label>
            <input type="number" id="cap-2" placeholder="0" step="any">
        </div>
        <button onclick="calculateCapacitor()" style="width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="cap-result" style="display: none;"></div>
    `;
}

function createMotionCalc() {
    return `
        <div class="calc-panel-header">
            <h2>🚀 Kalkulator Gerak GLB/GLBB</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="mode-selector">
            <button class="mode-btn active" data-mode="glb">GLB</button>
            <button class="mode-btn" data-mode="glbb">GLBB</button>
        </div>
        <div id="motion-inputs">
            <div class="calc-input-group">
                <label>Kecepatan (m/s):</label>
                <input type="number" id="motion-v" placeholder="0" step="any">
            </div>
            <div class="calc-input-group">
                <label>Waktu (s):</label>
                <input type="number" id="motion-t" placeholder="0" step="any">
            </div>
        </div>
        <button onclick="calculateMotion()" style="width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="motion-result" style="display: none;"></div>
    `;
}

function createWeightCalc() {
    return `
        <div class="calc-panel-header">
            <h2>⚖️ Kalkulator Berat Benda</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="calc-input-group">
            <label>Massa (kg):</label>
            <input type="number" id="weight-m" placeholder="Masukkan massa" step="any">
        </div>
        <div class="calc-input-group">
            <label>Percepatan Gravitasi (m/s²):</label>
            <input type="number" id="weight-g" value="9.8" step="any">
            <small>Default: 9.8 m/s² (gravitasi Bumi)</small>
        </div>
        <button onclick="calculateWeight()" style="width: 100%;">🚀 Hitung</button>
        <div class="calc-result-box" id="weight-result" style="display: none;"></div>
    `;
}

function createSIConverter() {
    return `
        <div class="calc-panel-header">
            <h2>🔬 Konversi ke Satuan SI</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="calc-input-group">
            <label>Nilai:</label>
            <input type="number" id="si-value" placeholder="Masukkan nilai" step="any">
        </div>
        <div class="calc-input-group">
            <label>Satuan Awal:</label>
            <select id="si-from">
                <option value="km">km → m</option>
                <option value="cm">cm → m</option>
                <option value="mm">mm → m</option>
                <option value="g">g → kg</option>
                <option value="mg">mg → kg</option>
                <option value="min">menit → s</option>
                <option value="hour">jam → s</option>
            </select>
        </div>
        <button onclick="calculateSI()" style="width: 100%;">🚀 Konversi</button>
        <div class="calc-result-box" id="si-result" style="display: none;"></div>
    `;
}

function createScientificNotation() {
    return `
        <div class="calc-panel-header">
            <h2>📊 Notasi Ilmiah</h2>
            <button class="close-calc-btn" onclick="closeCalculator()">✖ Tutup</button>
        </div>
        <div class="calc-input-group">
            <label>Angka:</label>
            <input type="number" id="sci-number" placeholder="Masukkan angka" step="any">
        </div>
        <button onclick="calculateScientific()" style="width: 100%;">🚀 Konversi</button>
        <div class="calc-result-box" id="sci-result" style="display: none;"></div>
    `;
}

function attachCalculatorEvents(type) {
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (type === 'motion') {
                updateMotionInputs(btn.dataset.mode);
            }
        });
    });
}

function updateMotionInputs(mode) {
    const container = document.getElementById('motion-inputs');
    if (mode === 'glb') {
        container.innerHTML = `
            <div class="calc-input-group">
                <label>Kecepatan (m/s):</label>
                <input type="number" id="motion-v" placeholder="0" step="any">
            </div>
            <div class="calc-input-group">
                <label>Waktu (s):</label>
                <input type="number" id="motion-t" placeholder="0" step="any">
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="calc-input-group">
                <label>Kecepatan Awal (m/s):</label>
                <input type="number" id="motion-v0" placeholder="0" step="any">
            </div>
            <div class="calc-input-group">
                <label>Percepatan (m/s²):</label>
                <input type="number" id="motion-a" placeholder="0" step="any">
            </div>
            <div class="calc-input-group">
                <label>Waktu (s):</label>
                <input type="number" id="motion-t" placeholder="0" step="any">
            </div>
        `;
    }
}

// Calculator Functions
window.addResistor = function() {
    resistorCount++;
    const container = document.getElementById('resistor-inputs');
    const div = document.createElement('div');
    div.className = 'resistor-input-item';
    div.innerHTML = `
        <label>R${resistorCount} (Ω):</label>
        <input type="number" class="resistor-value" placeholder="0" step="any">
    `;
    container.appendChild(div);
};

window.calculateResistor = function() {
    const mode = document.querySelector('.mode-btn.active').dataset.mode;
    const values = Array.from(document.querySelectorAll('.resistor-value'))
        .map(input => parseFloat(input.value))
        .filter(val => !isNaN(val) && val > 0);
    
    if (values.length === 0) {
        alert('Masukkan minimal satu nilai resistor!');
        return;
    }
    
    let total;
    if (mode === 'series') {
        total = values.reduce((sum, val) => sum + val, 0);
    } else {
        total = 1 / values.reduce((sum, val) => sum + 1/val, 0);
    }
    
    const resultDiv = document.getElementById('resistor-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">R<sub>total</sub> = ${formatNumber(total)} Ω</p>
        <div class="calc-formula">
            Mode: ${mode === 'series' ? 'Seri (R₁ + R₂ + ... + Rₙ)' : 'Paralel (1/R = 1/R₁ + 1/R₂ + ... + 1/Rₙ)'}
        </div>
    `;
};

window.calculateOhm = function() {
    const v = parseFloat(document.getElementById('ohm-v').value);
    const i = parseFloat(document.getElementById('ohm-i').value);
    const r = parseFloat(document.getElementById('ohm-r').value);
    
    let result, formula;
    
    if (isNaN(v) && !isNaN(i) && !isNaN(r)) {
        result = i * r;
        formula = `V = I × R = ${i} × ${r} = ${formatNumber(result)} V`;
    } else if (!isNaN(v) && isNaN(i) && !isNaN(r)) {
        result = v / r;
        formula = `I = V / R = ${v} / ${r} = ${formatNumber(result)} A`;
    } else if (!isNaN(v) && !isNaN(i) && isNaN(r)) {
        result = v / i;
        formula = `R = V / I = ${v} / ${i} = ${formatNumber(result)} Ω`;
    } else {
        alert('Isi tepat 2 nilai, kosongkan 1 nilai yang ingin dicari!');
        return;
    }
    
    const resultDiv = document.getElementById('ohm-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <div class="calc-formula">${formula}</div>
    `;
};

window.calculatePower = function() {
    const v = parseFloat(document.getElementById('power-v').value);
    const i = parseFloat(document.getElementById('power-i').value);
    
    if (isNaN(v) || isNaN(i)) {
        alert('Masukkan nilai tegangan dan arus!');
        return;
    }
    
    const p = v * i;
    
    const resultDiv = document.getElementById('power-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">P = ${formatNumber(p)} Watt</p>
        <div class="calc-formula">P = V × I = ${v} × ${i} = ${formatNumber(p)} W</div>
    `;
};

window.calculateCapacitor = function() {
    const mode = document.querySelector('.mode-btn.active').dataset.mode;
    const c1 = parseFloat(document.getElementById('cap-1').value);
    const c2 = parseFloat(document.getElementById('cap-2').value);
    
    if (isNaN(c1) || isNaN(c2)) {
        alert('Masukkan kedua nilai kapasitor!');
        return;
    }
    
    let total;
    if (mode === 'series') {
        total = (c1 * c2) / (c1 + c2);
    } else {
        total = c1 + c2;
    }
    
    const resultDiv = document.getElementById('cap-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">C<sub>total</sub> = ${formatNumber(total)} µF</p>
        <div class="calc-formula">
            Mode: ${mode === 'series' ? 'Seri (1/C = 1/C₁ + 1/C₂)' : 'Paralel (C = C₁ + C₂)'}
        </div>
    `;
};

window.calculateMotion = function() {
    const mode = document.querySelector('.mode-btn.active').dataset.mode;
    
    if (mode === 'glb') {
        const v = parseFloat(document.getElementById('motion-v').value);
        const t = parseFloat(document.getElementById('motion-t').value);
        
        if (isNaN(v) || isNaN(t)) {
            alert('Masukkan nilai kecepatan dan waktu!');
            return;
        }
        
        const s = v * t;
        
        const resultDiv = document.getElementById('motion-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Hasil Perhitungan GLB</h3>
            <p style="font-size: 1.5rem; margin: 10px 0;">Jarak (s) = ${formatNumber(s)} m</p>
            <div class="calc-formula">s = v × t = ${v} × ${t} = ${formatNumber(s)} m</div>
        `;
    } else {
        const v0 = parseFloat(document.getElementById('motion-v0').value);
        const a = parseFloat(document.getElementById('motion-a').value);
        const t = parseFloat(document.getElementById('motion-t').value);
        
        if (isNaN(v0) || isNaN(a) || isNaN(t)) {
            alert('Masukkan semua nilai!');
            return;
        }
        
        const vt = v0 + a * t;
        const s = v0 * t + 0.5 * a * t * t;
        
        const resultDiv = document.getElementById('motion-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Hasil Perhitungan GLBB</h3>
            <p style="font-size: 1.2rem; margin: 10px 0;">Kecepatan akhir (v<sub>t</sub>) = ${formatNumber(vt)} m/s</p>
            <p style="font-size: 1.2rem; margin: 10px 0;">Jarak (s) = ${formatNumber(s)} m</p>
            <div class="calc-formula">
                v<sub>t</sub> = v₀ + at = ${v0} + ${a} × ${t} = ${formatNumber(vt)} m/s<br>
                s = v₀t + ½at² = ${formatNumber(s)} m
            </div>
        `;
    }
};

window.calculateWeight = function() {
    const m = parseFloat(document.getElementById('weight-m').value);
    const g = parseFloat(document.getElementById('weight-g').value);
    
    if (isNaN(m) || isNaN(g)) {
        alert('Masukkan nilai massa dan gravitasi!');
        return;
    }
    
    const w = m * g;
    
    const resultDiv = document.getElementById('weight-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">Berat (W) = ${formatNumber(w)} N</p>
        <div class="calc-formula">W = m × g = ${m} × ${g} = ${formatNumber(w)} N</div>
    `;
};

window.calculateSI = function() {
    const value = parseFloat(document.getElementById('si-value').value);
    const from = document.getElementById('si-from').value;
    
    if (isNaN(value)) {
        alert('Masukkan nilai yang valid!');
        return;
    }
    
    const conversions = {
        km: { factor: 1000, to: 'm' },
        cm: { factor: 0.01, to: 'm' },
        mm: { factor: 0.001, to: 'm' },
        g: { factor: 0.001, to: 'kg' },
        mg: { factor: 0.000001, to: 'kg' },
        min: { factor: 60, to: 's' },
        hour: { factor: 3600, to: 's' }
    };
    
    const conv = conversions[from];
    const result = value * conv.factor;
    
    const resultDiv = document.getElementById('si-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Hasil Konversi</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">${value} ${from} = ${formatNumber(result)} ${conv.to}</p>
        <div class="calc-formula">Faktor konversi: × ${conv.factor}</div>
    `;
};

window.calculateScientific = function() {
    const num = parseFloat(document.getElementById('sci-number').value);
    
    if (isNaN(num)) {
        alert('Masukkan angka yang valid!');
        return;
    }
    
    const scientific = num.toExponential(4);
    const parts = scientific.split('e');
    const mantissa = parseFloat(parts[0]);
    const exponent = parseInt(parts[1]);
    
    const resultDiv = document.getElementById('sci-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Notasi Ilmiah</h3>
        <p style="font-size: 1.5rem; margin: 10px 0;">${num} = ${mantissa} × 10<sup>${exponent}</sup></p>
        <div class="calc-formula">Bentuk standar: ${scientific}</div>
    `;
};

window.closeCalculator = function() {
    document.getElementById('calc-panels').innerHTML = '';
    resistorCount = 1;
};

// ==================== START APPLICATION ====================
init();
