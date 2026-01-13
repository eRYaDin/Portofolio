// js/kalkulator-listrik/reaktansi.js
import { validatePositive, formatNumber, CONSTANTS } from '../utils.js';
export const calculator = {
    id: 'reaktansi',
    title: '🌀 Reaktansi AC',
    inputs: [
        { id: 'mode', type: 'mode', label: 'Hitung:', options: [
            { value: 'xl', label: 'Reaktansi Induktif (XL)' },
            { value: 'xc', label: 'Reaktansi Kapasitif (XC)' }
        ]},
        { id: 'f', type: 'number', label: 'Frekuensi (f)', unit: 'Hz' },
        { id: 'l', type: 'number', label: 'Induktansi (L)', unit: 'H', condition: m => m === 'xl' },
        { id: 'c', type: 'number', label: 'Kapasitansi (C)', unit: 'F', condition: m => m === 'xc' }
    ],
    calculate: (inputs) => {
        const f = validatePositive(inputs.f, 'Frekuensi');
        const w = 2 * CONSTANTS.PI * f; // omega
        
        if (inputs.mode === 'xl') {
            const l = validatePositive(inputs.l, 'Induktansi');
            const xl = w * l;
            return {
                results: [
                    { label: 'Reaktansi Induktif (XL)', value: xl, unit: 'Ω' },
                    { label: 'Frekuensi Sudut (ω)', value: w, unit: 'rad/s' }
                ],
                formula: 'XL = 2πfL = ωL',
                calculation: `XL = 2π × ${formatNumber(f)} × ${formatNumber(l)} = ${formatNumber(xl)} Ω`
            };
        } else {
            const c = validatePositive(inputs.c, 'Kapasitansi');
            const xc = 1 / (w * c);
            return {
                results: [
                    { label: 'Reaktansi Kapasitif (XC)', value: xc, unit: 'Ω' },
                    { label: 'Frekuensi Sudut (ω)', value: w, unit: 'rad/s' }
                ],
                formula: 'XC = 1/(2πfC) = 1/(ωC)',
                calculation: `XC = 1/(2π × ${formatNumber(f)} × ${formatNumber(c)}) = ${formatNumber(xc)} Ω`
            };
        }
    }
};
