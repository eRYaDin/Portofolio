// ==================== APP.JS ====================
// Main entry point - menginisialisasi semua fitur

import { initUI } from './ui.js';
import { 
    initConverter, 
    updateUnits, 
    performConversion, 
    resetForm, 
    copyResult, 
    swapUnits,
    clearResults,
    toggleHistory,
    clearAllHistory
} from './converter.js';
import { get, showNotification } from './utils.js';

// ==================== STATE ====================
let currentCategory = 'panjang';

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

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    get('theme-toggle').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        get('theme-toggle').textContent = '☀️';
    } else {
        get('theme-toggle').textContent = '🌙';
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
    get('search-bar').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.classList.toggle('hidden', !text.includes(query));
        });
    });

    // Converter buttons
    get('convert-btn').addEventListener('click', performConversion);
    get('reset-btn').addEventListener('click', resetForm);
    get('copy-btn').addEventListener('click', copyResult);
    get('swap-btn').addEventListener('click', swapUnits);
    
    // History & Theme
    get('history-toggle').addEventListener('click', toggleHistory);
    get('clear-history').addEventListener('click', clearAllHistory);
    get('theme-toggle').addEventListener('click', toggleTheme);
    
    // Enter key to convert
    get('input-value').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performConversion();
        }
    });
}

// ==================== INITIALIZATION ====================
function init() {
    console.log('🚀 Initializing Konverter Fisika Pro...');
    
    // Initialize features
    initBackground();
    loadTheme();
    initConverter();
    initUI();
    attachEventListeners();
    
    console.log('✅ App initialized successfully!');
    showNotification('✨ Aplikasi siap digunakan!');
}

// ==================== START APPLICATION ====================
document.addEventListener('DOMContentLoaded', init);
