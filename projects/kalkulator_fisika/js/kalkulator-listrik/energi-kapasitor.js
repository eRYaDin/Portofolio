// js/kalkulator-listrik/energi-kapasitor.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'energi-kapasitor',
    title: '⚡ Energi Kapasitor',
    inputs: [
        { id: 'c', type: 'number', label: 'Kapasitansi (C)', unit: 'F' },
        { id: 'v', type: 'number', label: 'Tegangan (V)', unit: 'V' }
    ],
    calculate: (inputs) => {
        const c = validatePositive(inputs.c, 'Kapasitansi');
        const v = validatePositive(inputs.v, 'Tegangan');
        const e = 0.5 * c * v * v;
        return {
            results: [
                { label: 'Energi Tersimpan', value: e, unit: 'J' },
                { label: 'Energi (mJ)', value: e * 1000, unit: 'mJ' }
            ],
            formula: 'E = ½CV²',
            calculation: `E = ½ × ${formatNumber(c)} × ${formatNumber(v)}² = ${formatNumber(e)} J`
        };
    }
};
