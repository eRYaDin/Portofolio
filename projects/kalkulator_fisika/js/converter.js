// ==================== CONVERTER.JS ====================
// Unit conversion logic

import { formatNumber, get, showNotification } from './utils.js';

// Unit definitions
export const units = {
    panjang: { 
        base: "m", 
        units: { 
            m: 1, km: 1000, cm: 0.01, mm: 0.001, µm: 0.000001, 
            nm: 0.000000001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 
        }
    },
    massa: { 
        base: "kg", 
        units: { 
            kg: 1, g: 0.001, mg: 0.000001, ton: 1000, 
            lb: 0.453592, oz: 0.0283495, slug: 14.5939 
        }
    },
    waktu: { 
        base: "s", 
        units: { 
            s: 1, min: 60, h: 3600, day: 86400, week: 604800, 
            ms: 0.001, µs: 0.000001, ns: 0.000000001 
        }
    },
    kecepatan: { 
        base: "m/s", 
        units: { 
            "m/s": 1, "km/h": 1/3.6, "mph": 0.44704, 
            "ft/s": 0.3048, "knot": 0.514444 
        }
    },
    percepatan: { 
        base: "m/s²", 
        units: { "m/s²": 1, "ft/s²": 0.3048, "g": 9.80665 }
    },
    gaya: { 
        base: "N", 
        units: { N: 1, kN: 1000, dyne: 0.00001, lbf: 4.44822, kgf: 9.80665 }
    },
    arus: { 
        base: "A", 
        units: { A: 1, mA: 0.001, µA: 0.000001, kA: 1000 }
    },
    tegangan: { 
        base: "V", 
        units: { V: 1, mV: 0.001, kV: 1000, MV: 1000000 }
    },
    hambatan: { 
        base: "Ω", 
        units: { Ω: 1, kΩ: 1000, MΩ: 1000000, mΩ: 0.001 }
    },
    daya: { 
        base: "W", 
        units: { W: 1, kW: 1000, MW: 1000000, hp: 745.7, mW: 0.001 }
    },
    energi: { 
        base: "J", 
        units: { 
            J: 1, kJ: 1000, MJ: 1000000, cal: 4.184, kcal: 4184, 
            Wh: 3600, kWh: 3600000, eV: 1.60218e-19 
        }
    },
    muatan: { 
        base: "C", 
        units: { C: 1, mC: 0.001, µC: 0.000001, nC: 0.000000001 }
    },
    kapasitansi: { 
        base: "F", 
        units: { F: 1, mF: 0.001, µF: 0.000001, nF: 0.000000001, pF: 0.000000000001 }
    },
    induktansi: { 
        base: "H", 
        units: { H: 1, mH: 0.001, µH: 0.000001, nH: 0.000000001 }
    },
    suhu: { 
        base: "K", 
        units: { K: 1, "°C": 1, "°F": 1 }
    },
    tekanan: { 
        base: "Pa", 
        units: { 
            Pa: 1, kPa: 1000, MPa: 1000000, atm: 101325, bar: 100000, 
            psi: 6894.76, mmHg: 133.322, torr: 133.322 
        }
    },
    frekuensi: { 
        base: "Hz", 
        units: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000, THz: 1000000000000 }
    },
    luas: { 
        base: "m²", 
        units: { 
            "m²": 1, "km²": 1000000, "cm²": 0.0001, "mm²": 0.000001, 
            "ha": 10000, "acre": 4046.86, "ft²": 0.092903, "in²": 0.00064516 
        }
    },
    volume: { 
        base: "m³", 
        units: { 
            "m³": 1, "L": 0.001, "mL": 0.000001, "cm³": 0.000001, 
            "ft³": 0.0283168, "in³": 0.0000163871, "gal": 0.00378541 
        }
    }
};

// State
let currentCategory = 'panjang';
let conversionHistory = [];
let lastResult = '';

// Update unit dropdowns
export function updateUnits(category) {
    currentCategory = category;
    const unitOptions = Object.keys(units[category].units);
    const inputUnit = get('input-unit');
    const outputUnit = get('output-unit');
    
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';
    
    unitOptions.forEach(unit => {
        inputUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        outputUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    if (unitOptions.length > 1) {
        outputUnit.value = unitOptions[1];
    }
}

// Temperature conversion
function convertTemperature(value, from, to) {
    let tempInK;
    if (from === 'K') {
        tempInK = value;
    } else if (from === '°C') {
        tempInK = value + 273.15;
    } else { // °F
        tempInK = (value - 32) * 5/9 + 273.15;
    }
    
    if (to === 'K') return tempInK;
    if (to === '°C') return tempInK - 273.15;
    return (tempInK - 273.15) * 9/5 + 32; // °F
}

// Main conversion function
export function performConversion() {
    const value = parseFloat(get('input-value').value);
    const fromUnit = get('input-unit').value;
    const toUnit = get('output-unit').value;
    
    if (isNaN(value)) {
        showError('Masukkan nilai yang valid!');
        return;
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

// Display functions
function displayResult(inputVal, fromUnit, resultVal, toUnit) {
    lastResult = `${inputVal} ${fromUnit} = ${formatNumber(resultVal)} ${toUnit}`;
    const resultP = get('result');
    resultP.textContent = `💥 ${lastResult}`;
    resultP.style.color = '#2e7d32';
}

function showFormula(fromUnit, toUnit) {
    const container = get('formula-container');
    
    if (currentCategory === 'suhu') {
        container.innerHTML = '';
        return;
    }
    
    const factor = units[currentCategory].units[toUnit] / units[currentCategory].units[fromUnit];
    container.innerHTML = `<div class="formula-box">Faktor konversi: 1 ${fromUnit} = ${formatNumber(factor)} ${toUnit}</div>`;
}

function showError(msg) {
    const resultP = get('result');
    resultP.textContent = `❌ ${msg}`;
    resultP.style.color = '#d32f2f';
    get('equivalence').textContent = '';
    get('formula-container').innerHTML = '';
}

export function clearResults() {
    const resultP = get('result');
    resultP.textContent = 'Siap konversi!';
    resultP.style.color = '#d32f2f';
    get('equivalence').textContent = '';
    get('formula-container').innerHTML = '';
}

// UI Actions
export function swapUnits() {
    const inputUnit = get('input-unit');
    const outputUnit = get('output-unit');
    [inputUnit.value, outputUnit.value] = [outputUnit.value, inputUnit.value];
}

export function resetForm() {
    get('input-value').value = '';
    clearResults();
}

export function copyResult() {
    if (lastResult) {
        navigator.clipboard.writeText(lastResult)
            .then(() => showNotification('✅ Hasil disalin!'))
            .catch(() => showNotification('⚠️ Gagal menyalin', 'error'));
    } else {
        showNotification('⚠️ Belum ada hasil untuk disalin', 'error');
    }
}

// History Management
function addToHistory(item) {
    conversionHistory.unshift(item);
    if (conversionHistory.length > 50) {
        conversionHistory = conversionHistory.slice(0, 50);
    }
    renderHistory();
}

export function renderHistory() {
    const historyList = get('history-list');
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
            <button class="delete-btn" data-index="${index}">✖</button>
        `;
        
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                loadFromHistory(item);
            }
        });
        
        div.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteHistoryItem(index);
        });
        
        historyList.appendChild(div);
    });
}

function loadFromHistory(item) {
    const menuItem = document.querySelector(`.menu-item[data-category="${item.category}"]`);
    if (menuItem) {
        menuItem.click();
        get('input-value').value = item.value;
        
        setTimeout(() => {
            get('input-unit').value = item.fromUnit;
            get('output-unit').value = item.toUnit;
        }, 100);
        
        showNotification('📥 Konversi dimuat dari riwayat');
    }
}

function deleteHistoryItem(index) {
    conversionHistory.splice(index, 1);
    renderHistory();
}

export function clearAllHistory() {
    if (confirm('Hapus semua riwayat konversi?')) {
        conversionHistory = [];
        renderHistory();
        showNotification('🗑️ Riwayat dihapus');
    }
}

export function toggleHistory() {
    const panel = get('history-panel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

// Initialize converter
export function initConverter() {
    updateUnits(currentCategory);
    renderHistory();
}
