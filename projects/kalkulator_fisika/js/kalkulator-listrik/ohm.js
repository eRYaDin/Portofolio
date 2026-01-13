// ==================== HUKUM OHM ====================
// V = I × R

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'ohm',
    title: '⚡ Hukum Ohm',
    
    // UI Form - Diperbaiki: Input dipisah berdasarkan makna (tegangan, arus, hambatan)
    // Agar unit dan label tidak statis, dan UI langsung jelas untuk user
    inputs: [
        { id: 'mode', type: 'mode', label: 'Cari:', options: [
            { value: 'v', label: 'Tegangan (V)' },
            { value: 'i', label: 'Arus (I)' },
            { value: 'r', label: 'Hambatan (R)' }
        ]},
        { id: 'tegangan', type: 'number', label: 'Tegangan (V)', unit: 'V', condition: (mode) => mode !== 'v' },
        { id: 'arus', type: 'number', label: 'Arus (I)', unit: 'A', condition: (mode) => mode !== 'i' },
        { id: 'hambatan', type: 'number', label: 'Hambatan (R)', unit: 'Ω', condition: (mode) => mode !== 'r' }
    ],
    
    // Calculation Logic - Diperbaiki: Menggunakan id input yang spesifik (tegangan, arus, hambatan)
    // Logika hitung tetap sama, tapi sekarang mapping-nya benar
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'v') {
            // Cari V, butuh I dan R
            const i = validatePositive(inputs.arus, 'Arus (I)');
            const r = validatePositive(inputs.hambatan, 'Hambatan (R)');
            const v = i * r;
            
            return {
                results: [
                    { label: 'Tegangan (V)', value: v, unit: 'V' }
                ],
                formula: 'V = I × R',
                calculation: `V = ${formatNumber(i)} × ${formatNumber(r)} = ${formatNumber(v)} V`
            };
        } else if (mode === 'i') {
            // Cari I, butuh V dan R
            const v = validatePositive(inputs.tegangan, 'Tegangan (V)');
            const r = validatePositive(inputs.hambatan, 'Hambatan (R)');
            const i = v / r;
            
            return {
                results: [
                    { label: 'Arus (I)', value: i, unit: 'A' }
                ],
                formula: 'I = V / R',
                calculation: `I = ${formatNumber(v)} / ${formatNumber(r)} = ${formatNumber(i)} A`
            };
        } else {
            // Cari R, butuh V dan I
            const v = validatePositive(inputs.tegangan, 'Tegangan (V)');
            const i = validatePositive(inputs.arus, 'Arus (I)');
            const r = v / i;
            
            return {
                results: [
                    { label: 'Hambatan (R)', value: r, unit: 'Ω' }
                ],
                formula: 'R = V / I',
                calculation: `R = ${formatNumber(v)} / ${formatNumber(i)} = ${formatNumber(r)} Ω`
            };
        }
    }
};
