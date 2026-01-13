// js/kalkulator-listrik/energi-induktor.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'energi-induktor',
    title: '⚡ Energi Induktor',
    inputs: [
        { id: 'l', type: 'number', label: 'Induktansi (L)', unit: 'H' },
        { id: 'i', type: 'number', label: 'Arus (I)', unit: 'A' }
    ],
    calculate: (inputs) => {
        const l = validatePositive(inputs.l, 'Induktansi');
        const i = validatePositive(inputs.i, 'Arus');
        const e = 0.5 * l * i * i;
        return {
            results: [
                { label: 'Energi Tersimpan', value: e, unit: 'J' },
                { label: 'Energi (mJ)', value: e * 1000, unit: 'mJ' }
            ],
            formula: 'E = ½LI²',
            calculation: `E = ½ × ${formatNumber(l)} × ${formatNumber(i)}² = ${formatNumber(e)} J`
        };
    }
};
