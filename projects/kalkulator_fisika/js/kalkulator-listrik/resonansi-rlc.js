// js/kalkulator-listrik/resonansi-rlc.js
import { validatePositive, formatNumber, CONSTANTS } from '../utils.js';
export const calculator = {
    id: 'resonansi-rlc',
    title: '📻 Resonansi RLC',
    inputs: [
        { id: 'l', type: 'number', label: 'Induktansi (L)', unit: 'H' },
        { id: 'c', type: 'number', label: 'Kapasitansi (C)', unit: 'F' }
    ],
    calculate: (inputs) => {
        const l = validatePositive(inputs.l, 'Induktansi');
        const c = validatePositive(inputs.c, 'Kapasitansi');
        const f0 = 1 / (2 * CONSTANTS.PI * Math.sqrt(l * c));
        const w0 = 2 * CONSTANTS.PI * f0;
        return {
            results: [
                { label: 'Frekuensi Resonansi (f₀)', value: f0, unit: 'Hz' },
                { label: 'Frekuensi Resonansi (kHz)', value: f0 / 1000, unit: 'kHz' },
                { label: 'Frekuensi Sudut (ω₀)', value: w0, unit: 'rad/s' }
            ],
            formula: 'f₀ = 1/(2π√LC)',
            calculation: `f₀ = 1/(2π√(${formatNumber(l)} × ${formatNumber(c)})) = ${formatNumber(f0)} Hz`
        };
    }
};
