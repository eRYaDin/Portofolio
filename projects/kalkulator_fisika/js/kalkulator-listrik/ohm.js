// ==================== HUKUM OHM ====================
// V = I × R

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'ohm',
    title: '⚡ Hukum Ohm',
    
    // UI Form
    inputs: [
        { id: 'mode', type: 'mode', label: 'Cari:', options: [
            { value: 'v', label: 'Tegangan (V)' },
            { value: 'i', label: 'Arus (I)' },
            { value: 'r', label: 'Hambatan (R)' }
        ]},
        { id: 'input1', type: 'number', label: 'Nilai 1', unit: 'V', condition: (mode) => mode !== 'v' },
        { id: 'input2', type: 'number', label: 'Nilai 2', unit: 'A', condition: (mode) => mode !== 'i' }
    ],
    
    // Calculation Logic
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'v') {
            // Cari V, butuh I dan R
            const i = validatePositive(inputs.input1, 'Arus (I)');
            const r = validatePositive(inputs.input2, 'Hambatan (R)');
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
            const v = validatePositive(inputs.input1, 'Tegangan (V)');
            const r = validatePositive(inputs.input2, 'Hambatan (R)');
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
            const v = validatePositive(inputs.input1, 'Tegangan (V)');
            const i = validatePositive(inputs.input2, 'Arus (I)');
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
