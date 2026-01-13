// js/kalkulator-mekanika/gaya-newton.js
import { validateNumber, formatNumber } from '../utils.js';
export const calculator = {
    id: 'gaya-newton',
    title: '💪 Hukum Newton II',
    inputs: [
        { id: 'mode', type: 'mode', label: 'Cari:', options: [
            { value: 'f', label: 'Gaya (F)' },
            { value: 'm', label: 'Massa (m)' },
            { value: 'a', label: 'Percepatan (a)' }
        ]},
        { id: 'input1', type: 'number', label: 'Nilai 1', condition: m => m !== 'f' },
        { id: 'input2', type: 'number', label: 'Nilai 2', condition: m => m !== 'm' }
    ],
    calculate: (inputs) => {
        if (inputs.mode === 'f') {
            const m = validateNumber(inputs.input1, 'Massa');
            const a = validateNumber(inputs.input2, 'Percepatan');
            const f = m * a;
            return {
                results: [{ label: 'Gaya (F)', value: f, unit: 'N' }],
                formula: 'F = m × a',
                calculation: `F = ${formatNumber(m)} × ${formatNumber(a)} = ${formatNumber(f)} N`
            };
        } else if (inputs.mode === 'm') {
            const f = validateNumber(inputs.input1, 'Gaya');
            const a = validateNumber(inputs.input2, 'Percepatan');
            const m = f / a;
            return {
                results: [{ label: 'Massa (m)', value: m, unit: 'kg' }],
                formula: 'm = F / a',
                calculation: `m = ${formatNumber(f)} / ${formatNumber(a)} = ${formatNumber(m)} kg`
            };
        } else {
            const f = validateNumber(inputs.input1, 'Gaya');
            const m = validateNumber(inputs.input2, 'Massa');
            const a = f / m;
            return {
                results: [{ label: 'Percepatan (a)', value: a, unit: 'm/s²' }],
                formula: 'a = F / m',
                calculation: `a = ${formatNumber(f)} / ${formatNumber(m)} = ${formatNumber(a)} m/s²`
            };
        }
    }
};
