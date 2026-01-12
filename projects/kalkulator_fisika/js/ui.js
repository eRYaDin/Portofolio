// ==================== UI.JS ====================
// Render UI untuk kalkulator secara dinamis

import { registry } from './registry.js';
import { formatNumber, showNotification, get, createElement } from './utils.js';

// Render calculator menu cards
export function renderCalculatorMenu() {
    const listrikMenu = get('calculator-menu-listrik');
    const mekanikaMenu = get('calculator-menu-mekanika');
    const termodinamikaMenu = get('calculator-menu-termodinamika');
    
    // Clear existing
    listrikMenu.innerHTML = '';
    mekanikaMenu.innerHTML = '';
    termodinamikaMenu.innerHTML = '';
    
    registry.forEach(calc => {
        const card = createElement('div', 'calc-card');
        card.dataset.calcId = calc.id;
        card.innerHTML = `
            <h3>${calc.judul}</h3>
            <p>${calc.deskripsi}</p>
        `;
        
        card.addEventListener('click', () => openCalculator(calc.id));
        
        // Add to appropriate menu
        if (calc.kategori === 'listrik') {
            listrikMenu.appendChild(card);
        } else if (calc.kategori === 'mekanika') {
            mekanikaMenu.appendChild(card);
        } else if (calc.kategori === 'termodinamika') {
            termodinamikaMenu.appendChild(card);
        }
    });
}

// Open calculator panel
async function openCalculator(calcId) {
    const calcInfo = registry.find(c => c.id === calcId);
    if (!calcInfo) return;
    
    try {
        // Dynamic import
        const module = await calcInfo.module();
        const calculator = module.calculator;
        
        // Render panel
        renderCalculatorPanel(calculator);
        
        // Scroll to panel
        setTimeout(() => {
            get('calc-panels').scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
    } catch (error) {
        console.error('Error loading calculator:', error);
        showNotification('❌ Gagal memuat kalkulator', 'error');
    }
}

// Render calculator panel
function renderCalculatorPanel(calculator) {
    const container = get('calc-panels');
    container.innerHTML = ''; // Clear previous
    
    const panel = createElement('div', 'calc-panel card');
    
    // Header
    const header = createElement('div', 'calc-panel-header');
    header.innerHTML = `
        <h2>${calculator.title}</h2>
        <button class="close-calc-btn">✖ Tutup</button>
    `;
    
    header.querySelector('.close-calc-btn').addEventListener('click', () => {
        container.innerHTML = '';
    });
    
    panel.appendChild(header);
    
    // Form
    const form = createCalculatorForm(calculator);
    panel.appendChild(form);
    
    // Result area
    const resultDiv = createElement('div', 'calc-result-box');
    resultDiv.style.display = 'none';
    resultDiv.id = 'calc-result';
    panel.appendChild(resultDiv);
    
    container.appendChild(panel);
}

// Create calculator form
function createCalculatorForm(calculator) {
    const form = createElement('form', 'calc-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        executeCalculation(calculator, form);
    });
    
    // Track current mode for conditional inputs
    let currentMode = null;
    
    calculator.inputs.forEach(input => {
        // Mode selector (radio buttons styled as buttons)
        if (input.type === 'mode') {
            const modeGroup = createElement('div', 'calc-input-group');
            modeGroup.innerHTML = `<label>${input.label}</label>`;
            
            const modeSelector = createElement('div', 'mode-selector');
            
            input.options.forEach((option, index) => {
                const btn = createElement('button', 'mode-btn');
                btn.type = 'button';
                btn.textContent = option.label;
                btn.dataset.value = option.value;
                
                if (index === 0) {
                    btn.classList.add('active');
                    currentMode = option.value;
                }
                
                btn.addEventListener('click', () => {
                    modeSelector.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentMode = option.value;
                    
                    // Update conditional inputs
                    updateConditionalInputs(form, calculator.inputs, currentMode);
                });
                
                modeSelector.appendChild(btn);
            });
            
            modeGroup.appendChild(modeSelector);
            form.appendChild(modeGroup);
        }
        // Number input
        else if (input.type === 'number') {
            const group = createElement('div', 'calc-input-group');
            group.dataset.inputId = input.id;
            
            // Check condition
            if (input.condition && !input.condition(currentMode)) {
                group.style.display = 'none';
            }
            
            group.innerHTML = `
                <label for="${input.id}">${input.label}:</label>
                <input type="number" id="${input.id}" step="any" required>
                ${input.unit ? `<small>Satuan: ${input.unit}</small>` : ''}
            `;
            
            form.appendChild(group);
        }
        // Dynamic array input (for resistors, etc)
        else if (input.type === 'array') {
            const group = createElement('div', 'calc-input-group');
            group.innerHTML = `<label>${input.label}:</label>`;
            
            const dynamicContainer = createElement('div', 'dynamic-inputs');
            dynamicContainer.id = `${input.id}-container`;
            
            // Add initial inputs
            for (let i = 0; i < (input.initial || 2); i++) {
                addDynamicInput(dynamicContainer, input.id, input.unit);
            }
            
            group.appendChild(dynamicContainer);
            
            // Add button
            const addBtn = createElement('button', 'add-btn');
            addBtn.type = 'button';
            addBtn.textContent = `+ Tambah ${input.label}`;
            addBtn.addEventListener('click', () => {
                addDynamicInput(dynamicContainer, input.id, input.unit);
            });
            
            group.appendChild(addBtn);
            form.appendChild(group);
        }
        // Select dropdown
        else if (input.type === 'select') {
            const group = createElement('div', 'calc-input-group');
            group.innerHTML = `
                <label for="${input.id}">${input.label}:</label>
                <select id="${input.id}" required>
                    ${input.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            `;
            form.appendChild(group);
        }
    });
    
    // Submit button
    const submitBtn = createElement('button', '');
    submitBtn.type = 'submit';
    submitBtn.textContent = '🚀 Hitung';
    submitBtn.style.background = '#4caf50';
    submitBtn.style.color = 'white';
    submitBtn.style.width = '100%';
    submitBtn.style.marginTop = '20px';
    
    form.appendChild(submitBtn);
    
    return form;
}

// Add dynamic input (for array inputs)
function addDynamicInput(container, inputId, unit) {
    const count = container.querySelectorAll('.dynamic-input-item').length + 1;
    const item = createElement('div', 'dynamic-input-item');
    
    item.innerHTML = `
        <input type="number" step="any" class="dynamic-input" data-array="${inputId}" placeholder="Nilai ${count}" required>
        ${unit ? `<span>${unit}</span>` : ''}
    `;
    
    // Remove button (only if more than 2 items)
    if (count > 2) {
        const removeBtn = createElement('button', 'remove-btn');
        removeBtn.type = 'button';
        removeBtn.textContent = '✖';
        removeBtn.addEventListener('click', () => item.remove());
        item.appendChild(removeBtn);
    }
    
    container.appendChild(item);
}

// Update conditional inputs based on mode
function updateConditionalInputs(form, inputs, mode) {
    inputs.forEach(input => {
        if (input.condition) {
            const group = form.querySelector(`[data-input-id="${input.id}"]`);
            if (group) {
                const shouldShow = input.condition(mode);
                group.style.display = shouldShow ? 'block' : 'none';
                
                // Update required attribute
                const inputEl = group.querySelector('input');
                if (inputEl) {
                    inputEl.required = shouldShow;
                }
            }
        }
    });
}

// Execute calculation
function executeCalculation(calculator, form) {
    try {
        // Collect inputs
        const inputs = {};
        
        // Get mode if exists
        const modeBtn = form.querySelector('.mode-btn.active');
        if (modeBtn) {
            inputs.mode = modeBtn.dataset.value;
        }
        
        // Get regular inputs
        form.querySelectorAll('input[type="number"]:not(.dynamic-input)').forEach(input => {
            if (input.offsetParent !== null) { // Only visible inputs
                inputs[input.id] = input.value;
            }
        });
        
        // Get array inputs
        const arrayGroups = {};
        form.querySelectorAll('.dynamic-input').forEach(input => {
            const arrayName = input.dataset.array;
            if (!arrayGroups[arrayName]) {
                arrayGroups[arrayName] = [];
            }
            arrayGroups[arrayName].push(input.value);
        });
        Object.assign(inputs, arrayGroups);
        
        // Get select inputs
        form.querySelectorAll('select').forEach(select => {
            inputs[select.id] = select.value;
        });
        
        // Calculate
        const result = calculator.calculate(inputs);
        
        // Display result
        displayCalculationResult(result);
        
    } catch (error) {
        showNotification(`❌ ${error.message}`, 'error');
    }
}

// Display calculation result
function displayCalculationResult(result) {
    const resultDiv = get('calc-result');
    resultDiv.style.display = 'block';
    
    let html = '<h3>📊 Hasil Perhitungan</h3>';
    
    // Formula
    if (result.formula) {
        html += `<div class="calc-formula">📐 Rumus: ${result.formula}</div>`;
    }
    
    // Calculation steps
    if (result.calculation) {
        html += `<div class="calc-formula">🔢 Perhitungan: ${result.calculation}</div>`;
    }
    
    // Results
    result.results.forEach(res => {
        html += `<div class="calc-result-item">
            <strong>${res.label}:</strong> ${formatNumber(res.value)} ${res.unit || ''}
        </div>`;
    });
    
    resultDiv.innerHTML = html;
    
    showNotification('✅ Perhitungan selesai!');
}

// Initialize UI
export function initUI() {
    renderCalculatorMenu();
}
