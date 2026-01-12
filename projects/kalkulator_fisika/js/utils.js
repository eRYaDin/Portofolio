// ==================== UTILS.JS ====================
// Helper functions yang digunakan di seluruh aplikasi

// Konstanta Fisika
export const CONSTANTS = {
    GRAVITY: 9.8,           // m/s²
    PI: Math.PI,
    SPEED_OF_LIGHT: 299792458,  // m/s
    PLN_TARIF_900VA: 1444   // Rp per kWh
};

// Format angka untuk display
export function formatNumber(num) {
    if (Math.abs(num) >= 1000 || (Math.abs(num) < 0.001 && num !== 0)) {
        return num.toExponential(4);
    }
    return parseFloat(num.toPrecision(6));
}

// Konversi derajat ke radian
export function degToRad(deg) {
    return deg * Math.PI / 180;
}

// Konversi radian ke derajat
export function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

// Validasi input angka
export function validateNumber(value, name = 'Nilai') {
    const num = parseFloat(value);
    if (isNaN(num)) {
        throw new Error(`${name} harus berupa angka yang valid`);
    }
    return num;
}

// Validasi input positif
export function validatePositive(value, name = 'Nilai') {
    const num = validateNumber(value, name);
    if (num <= 0) {
        throw new Error(`${name} harus lebih besar dari 0`);
    }
    return num;
}

// Validasi array angka
export function validateNumberArray(arr, name = 'Nilai') {
    return arr.map((val, i) => validatePositive(val, `${name} ${i + 1}`));
}

// Hitung total resistor/induktor seri
export function calculateSeries(values) {
    return values.reduce((sum, val) => sum + val, 0);
}

// Hitung total resistor/induktor paralel
export function calculateParallel(values) {
    const sumReciprocal = values.reduce((sum, val) => sum + (1 / val), 0);
    return 1 / sumReciprocal;
}

// Hitung total kapasitor seri
export function calculateCapacitorSeries(values) {
    return calculateParallel(values); // Kapasitor seri = kebalikan resistor
}

// Hitung total kapasitor paralel
export function calculateCapacitorParallel(values) {
    return calculateSeries(values); // Kapasitor paralel = sama dengan resistor
}

// Show notification
export function showNotification(msg, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    
    if (type === 'error') {
        notif.style.background = '#f44336';
    }
    
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Get element by ID (shorthand)
export function get(id) {
    return document.getElementById(id);
}

// Create element helper
export function createElement(tag, className = '', innerHTML = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
}

// Safe calculate - handle errors gracefully
export function safeCalculate(fn, ...args) {
    try {
        return { success: true, result: fn(...args) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
