// js/kalkulator-listrik/pembagi-tegangan.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'pembagi-tegangan',
    title: '📊 Pembagi Tegangan',
    inputs: [
        { id: 'vin', type: 'number', label: 'Tegangan Input (Vin)', unit: 'V' },
        { id: 'r1', type: 'number', label: 'Resistor R1', unit: 'Ω' },
        { id: 'r2', type: 'number', label: 'Resistor R2', unit: 'Ω' }
    ],
    calculate: (inputs) => {
        const vin = validatePositive(inputs.vin, 'Vin');
        const r1 = validatePositive(inputs.r1, 'R1');
        const r2 = validatePositive(inputs.r2, 'R2');
        const vout = (r2 / (r1 + r2)) * vin;
        return {
            results: [
                { label: 'Tegangan Output (Vout)', value: vout, unit: 'V' },
                { label: 'Ratio', value: vout / vin, unit: '' }
            ],
            formula: 'Vout = (R2 / (R1 + R2)) × Vin',
            calculation: `Vout = (${formatNumber(r2)} / ${formatNumber(r1 + r2)}) × ${formatNumber(vin)} = ${formatNumber(vout)} V`
        };
    }
};
