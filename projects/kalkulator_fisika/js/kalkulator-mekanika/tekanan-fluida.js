// ==================== TEKANAN FLUIDA ====================
// P = ρ × g × h, P = F / A

import { validatePositive, formatNumber, CONSTANTS } from '../utils.js';

export const calculator = {
    id: 'tekanan-fluida',
    title: '💧 Tekanan Fluida',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Hitung:', 
            options: [
                { value: 'hidrostatik', label: 'Tekanan Hidrostatik (P = ρgh)' },
                { value: 'gaya', label: 'Tekanan dari Gaya (P = F/A)' }
            ]
        },
        { id: 'rho', type: 'number', label: 'Massa Jenis Fluida (ρ)', unit: 'kg/m³', condition: m => m === 'hidrostatik' },
        { id: 'h', type: 'number', label: 'Kedalaman (h)', unit: 'm', condition: m => m === 'hidrostatik' },
        { id: 'g', type: 'number', label: 'Gravitasi (g)', unit: 'm/s²', condition: m => m === 'hidrostatik' },
        { id: 'f', type: 'number', label: 'Gaya (F)', unit: 'N', condition: m => m === 'gaya' },
        { id: 'a', type: 'number', label: 'Luas Permukaan (A)', unit: 'm²', condition: m => m === 'gaya' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'hidrostatik') {
            const rho = validatePositive(inputs.rho, 'Massa Jenis');
            const h = validatePositive(inputs.h, 'Kedalaman');
            const g = validatePositive(inputs.g || CONSTANTS.GRAVITY, 'Gravitasi');
            
            // Tekanan hidrostatik
            const p = rho * g * h;
            
            // Tekanan total (+ tekanan atmosfer)
            const p_atm = 101325; // Pa
            const p_total = p + p_atm;
            
            return {
                results: [
                    { label: 'Tekanan Hidrostatik (Ph)', value: p, unit: 'Pa' },
                    { label: 'Tekanan Hidrostatik', value: p / 1000, unit: 'kPa' },
                    { label: 'Tekanan Hidrostatik', value: p / 101325, unit: 'atm' },
                    { label: 'Tekanan Total', value: p_total, unit: 'Pa' },
                    { label: 'Tekanan Total', value: p_total / 101325, unit: 'atm' }
                ],
                formula: 'P = ρ × g × h\nP_total = P_hidrostatik + P_atmosfer',
                calculation: `P = ${formatNumber(rho)} × ${formatNumber(g)} × ${formatNumber(h)}\n` +
                            `P = ${formatNumber(p)} Pa\n` +
                            `P = ${formatNumber(p / 1000)} kPa\n` +
                            `P_total = ${formatNumber(p)} + ${formatNumber(p_atm)}\n` +
                            `P_total = ${formatNumber(p_total)} Pa`
            };
        } else {
            const f = validatePositive(inputs.f, 'Gaya');
            const a = validatePositive(inputs.a, 'Luas Permukaan');
            const p = f / a;
            
            return {
                results: [
                    { label: 'Tekanan (P)', value: p, unit: 'Pa' },
                    { label: 'Tekanan', value: p / 1000, unit: 'kPa' },
                    { label: 'Tekanan', value: p / 101325, unit: 'atm' },
                    { label: 'Tekanan', value: p / 6894.76, unit: 'psi' },
                    { label: 'Gaya', value: f, unit: 'N' },
                    { label: 'Luas Permukaan', value: a, unit: 'm²' }
                ],
                formula: 'P = F / A',
                calculation: `P = ${formatNumber(f)} N / ${formatNumber(a)} m²\n` +
                            `P = ${formatNumber(p)} Pa\n` +
                            `P = ${formatNumber(p / 1000)} kPa`
            };
        }
    }
};
