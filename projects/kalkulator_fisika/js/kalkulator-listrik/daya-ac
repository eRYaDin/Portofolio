// js/kalkulator-listrik/daya-ac.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'daya-ac',
    title: '💡 Daya AC',
    inputs: [
        { id: 'v', type: 'number', label: 'Tegangan RMS (Vrms)', unit: 'V' },
        { id: 'i', type: 'number', label: 'Arus RMS (Irms)', unit: 'A' },
        { id: 'pf', type: 'number', label: 'Faktor Daya (cos φ)', unit: '' }
    ],
    calculate: (inputs) => {
        const v = validatePositive(inputs.v, 'Tegangan');
        const i = validatePositive(inputs.i, 'Arus');
        const pf = validatePositive(inputs.pf, 'Faktor Daya');
        
        const p = v * i * pf; // Daya Aktif
        const s = v * i; // Daya Semu
        const q = Math.sqrt(s * s - p * p); // Daya Reaktif
        
        return {
            results: [
                { label: 'Daya Aktif (P)', value: p, unit: 'W' },
                { label: 'Daya Semu (S)', value: s, unit: 'VA' },
                { label: 'Daya Reaktif (Q)', value: q, unit: 'VAR' }
            ],
            formula: 'P = V × I × cos φ\nS = V × I\nQ = √(S² - P²)',
            calculation: `P = ${formatNumber(v)} × ${formatNumber(i)} × ${formatNumber(pf)} = ${formatNumber(p)} W`
        };
    }
};
