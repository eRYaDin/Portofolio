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

// ==================== DOM ELEMENTS ====================
const get = id => document.getElementById(id);

const inputUnitSelect = get('input-unit');
const outputUnitSelect = get('output-unit');
const inputValue = get('input-value');
const convertBtn = get('convert-btn');
const resetBtn = get('reset-btn');
const copyBtn = get('copy-btn');
const swapBtn = get('swap-btn');
const resultP = get('result');
const equivalenceP = get('equivalence');
const formulaContainer = get('formula-container');
const themeToggle = get('theme-toggle');
const historyToggle = get('history-toggle');
const historyPanel = get('history-panel');
const historyList = get('history-list');
const clearHistory = get('clear-history');
const searchBar = get('search-bar');

// ==================== INITIALIZATION ====================
function init() {
    initBackground();
    updateUnits(currentCategory);
    renderHistory();
    loadTheme();
    attachEventListeners();
    
    // Initialize calculators if the function exists (from calculators.js)
    if (typeof initCalculators === 'function') {
        initCalculators();
    }
}

// ==================== BACKGROUND ANIMATION ====================
function initBackground() {
    const layer = get('background-layer');
    const formulas = [
        '∫ f(x) dx', 'dE/dt', '∂ψ/∂t', '∇·E', '∇×B', 
        'F = ma', 'v = dx/dt', 'a = d²x/dt²', 'V = IR', 
        'I = dq/dt', 'U = ½CV²', 'E = mc²', 'F = qE', 
        'P = IV', 'c = λν', 'ω = 2πf', 'k = 2π/λ', 
        'α', 'β', 'γ', 'τ', 'ρ', 'ε₀', 'μ₀', 'ħ', 
        'ψ', '∇', '∂', '∮', '→', '⊗', '≈', '≠', '∞', '∝'
    ];
    
    const symbolCount = window.innerWidth < 768 ? 30 : 60;
    
    for (let i = 0; i < symbolCount; i++) {
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

// ==================== UNIT MANAGEMENT ====================
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
            get(`${btn.dataset.tab}-section`).classList.add('active');
        });
    });

    // Category menu
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

    // Search bar
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.classList.toggle('hidden', !text.includes(query));
        });
    });

    // Converter buttons
    convertBtn.addEventListener('click', performConversion);
    resetBtn.addEventListener('click', resetForm);
    copyBtn.addEventListener('click', copyResult);
    swapBtn.addEventListener('click', swapUnits);
    
    // History & Theme
    historyToggle.addEventListener('click', toggleHistory);
    clearHistory.addEventListener('click', clearAllHistory);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Enter key to convert
    inputValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performConversion();
        }
    });
}

// ==================== CONVERSION LOGIC ====================
function performConversion() {
    const value = parseFloat(inputValue.value);
    const fromUnit = inputUnitSelect.value;
    const toUnit = outputUnitSelect.value;
    
    if (isNaN(value)) {
        return showError('Masukkan nilai yang valid!');
    }
    
    let result;
    
    if (currentCategory === 'suhu') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        result = (value * units[currentCategory].units[fromUnit]) / units[currentCategory].units[toUnit];
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
    // Convert to Kelvin first
    let tempInK;
    if (from === 'K') {
        tempInK = value;
    } else if (from === '°C') {
        tempInK = value + 273.15;
    } else { // °F
        tempInK = (value - 32) * 5/9 + 273.15;
    }
    
    // Convert from Kelvin to target
    if (to === 'K') {
        return tempInK;
    } else if (to === '°C') {
        return tempInK - 273.15;
    } else { // °F
        return (tempInK - 273.15) * 9/5 + 32;
    }
}

function formatNumber(num) {
    if (Math.abs(num) >= 1000 || (Math.abs(num) < 0.001 && num !== 0)) {
        return num.toExponential(4);
    }
    return parseFloat(num.toPrecision(6));
}

function displayResult(inputVal, fromUnit, resultVal, toUnit) {
    lastResult = `${inputVal} ${fromUnit} = ${formatNumber(resultVal)} ${toUnit}`;
    resultP.textContent = `💥 ${lastResult}`;
    resultP.style.color = '#2e7d32';
}

function showFormula(fromUnit, toUnit) {
    if (currentCategory === 'suhu') {
        formulaContainer.innerHTML = '';
        return;
    }
    
    const factor = units[currentCategory].units[toUnit] / units[currentCategory].units[fromUnit];
    formulaContainer.innerHTML = `<div class="formula-box">Faktor konversi: 1 ${fromUnit} = ${formatNumber(factor)} ${toUnit}</div>`;
}

function showError(msg) {
    resultP.textContent = `❌ ${msg}`;
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

// ==================== UI ACTIONS ====================
function swapUnits() {
    [inputUnitSelect.value, outputUnitSelect.value] = [outputUnitSelect.value, inputUnitSelect.value];
}

function resetForm() {
    inputValue.value = '';
    clearResults();
}

function copyResult() {
    if (lastResult) {
        navigator.clipboard.writeText(lastResult)
            .then(() => showNotification('✅ Hasil disalin!'))
            .catch(() => showNotification('⚠️ Gagal menyalin'));
    } else {
        showNotification('⚠️ Belum ada hasil untuk disalin');
    }
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
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

window.deleteHistoryItem = (index) => {
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
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'flex' : 'none';
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// ==================== START APPLICATION ====================
document.addEventListener('DOMContentLoaded', init);
