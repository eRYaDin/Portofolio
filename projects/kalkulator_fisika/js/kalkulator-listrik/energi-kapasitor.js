// js/kalkulator-listrik/induktor.js
import { validateNumberArray, calculateSeries, calculateParallel, formatNumber } from '../utils.js';
export const calculator = {
    id: 'induktor',
    title: '🌀 Total Induktor',
    inputs: [
        { id: 'mode', type: 'mode', label: 'Tipe Rangkaian:', options: [
            { value: 'series', label: 'Seri' },
            { value: 'parallel', label: 'Paralel' }
        ]},
        { id: 'inductors', type: 'array', label: 'Induktor', unit: 'H', initial: 3 }
    ],
    calculate: (inputs) => {
        const values = validateNumberArray(inputs.inductors, 'Induktor');
        const total = inputs.mode === 'series' ? calculateSeries(values) : calculateParallel(values);
        return {
            results: [
                { label: 'Total Induktansi', value: total, unit: 'H' },
                { label: 'Total (mH)', value: total * 1000, unit: 'mH' }
            ],
            formula: inputs.mode === 'series' ? 'L_total = L₁ + L₂ + ...' : '1/L_total = 1/L₁ + 1/L₂ + ...',
            calculation: `L_total = ${formatNumber(total)} H`
        };
    }
};
