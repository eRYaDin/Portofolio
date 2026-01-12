// ==================== DAYA LISTRIK DC ====================
// P = VI, P = I²R, P = V²/R

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'daya-dc',
    title: '💡 Daya Listrik DC',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Hitung dari:', 
            options: [
                { value: 'vi', label: 'V & I' },
                { value: 'ir', label: 'I & R' },
                { value: 'vr', label: 'V & R' }
            ]
        },
        { id: 'v', type: 'number', label: 'Tegangan (V)', unit: 'V', condition: (m) => m === 'vi' || m === 'vr' },
        { id: 'i', type: 'number', label: 'Arus (I)', unit: 'A', condition: (m) => m === 'vi' || m === 'ir' },
        { id: 'r', type: 'number', label: 'Hambatan (R)', unit: 'Ω', condition: (m) => m === 'ir' || m === 'vr' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        let p, formula, calculation;
        
        if (mode === 'vi') {
            const v = validatePositive(inputs.v, 'Tegangan');
            const i = validatePositive(inputs.i, 'Arus');
            p = v * i;
            formula = 'P = V × I';
            calculation = `P = ${formatNumber(v)} × ${formatNumber(i)} = ${formatNumber(p)} W`;
        } else if (mode === 'ir') {
            const i = validatePositive(inputs.i, 'Arus');
            const r = validatePositive(inputs.r, 'Hambatan');
            p = i * i * r;
            formula = 'P = I² × R';
            calculation = `P = ${formatNumber(i)}² × ${formatNumber(r)} = ${formatNumber(p)} W`;
        } else {
            const v = validatePositive(inputs.v, 'Tegangan');
            const r = validatePositive(inputs.r, 'Hambatan');
            p = (v * v) / r;
            formula = 'P = V² / R';
            calculation = `P = ${formatNumber(v)}² / ${formatNumber(r)} = ${formatNumber(p)} W`;
        }
        
        return {
            results: [
                { label: 'Daya Listrik', value: p, unit: 'W' },
                { label: 'Daya (kW)', value: p / 1000, unit: 'kW' }
            ],
            formula,
            calculation
        };
    }
};
