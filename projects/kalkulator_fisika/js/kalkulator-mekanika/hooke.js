// ==================== HUKUM HOOKE ====================
// F = k × x, E = ½kx²

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'hooke',
    title: '🔧 Hukum Hooke',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Hitung:', 
            options: [
                { value: 'f', label: 'Gaya (F)' },
                { value: 'k', label: 'Konstanta Pegas (k)' },
                { value: 'x', label: 'Pertambahan Panjang (x)' }
            ]
        },
        { id: 'k', type: 'number', label: 'Konstanta Pegas (k)', unit: 'N/m', condition: m => m === 'f' || m === 'x' },
        { id: 'x', type: 'number', label: 'Pertambahan Panjang (x)', unit: 'm', condition: m => m === 'f' || m === 'k' },
        { id: 'f', type: 'number', label: 'Gaya (F)', unit: 'N', condition: m => m === 'k' || m === 'x' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'f') {
            const k = validatePositive(inputs.k, 'Konstanta Pegas');
            const x = validatePositive(inputs.x, 'Pertambahan Panjang');
            const f = k * x;
            const e = 0.5 * k * x * x; // Energi potensial pegas
            
            return {
                results: [
                    { label: 'Gaya (F)', value: f, unit: 'N' },
                    { label: 'Energi Potensial Pegas (Ep)', value: e, unit: 'J' },
                    { label: 'Konstanta Pegas', value: k, unit: 'N/m' },
                    { label: 'Pertambahan Panjang', value: x, unit: 'm' },
                    { label: 'Pertambahan Panjang', value: x * 100, unit: 'cm' }
                ],
                formula: 'F = k × x\nEp = ½kx²',
                calculation: `F = ${formatNumber(k)} × ${formatNumber(x)}\n` +
                            `F = ${formatNumber(f)} N\n` +
                            `Ep = ½ × ${formatNumber(k)} × ${formatNumber(x)}²\n` +
                            `Ep = ${formatNumber(e)} J`
            };
        } else if (mode === 'k') {
            const f = validatePositive(inputs.f, 'Gaya');
            const x = validatePositive(inputs.x, 'Pertambahan Panjang');
            const k = f / x;
            const e = 0.5 * k * x * x;
            
            return {
                results: [
                    { label: 'Konstanta Pegas (k)', value: k, unit: 'N/m' },
                    { label: 'Energi Potensial Pegas (Ep)', value: e, unit: 'J' },
                    { label: 'Gaya', value: f, unit: 'N' },
                    { label: 'Pertambahan Panjang', value: x, unit: 'm' }
                ],
                formula: 'k = F / x',
                calculation: `k = ${formatNumber(f)} / ${formatNumber(x)}\n` +
                            `k = ${formatNumber(k)} N/m`
            };
        } else {
            const f = validatePositive(inputs.f, 'Gaya');
            const k = validatePositive(inputs.k, 'Konstanta Pegas');
            const x = f / k;
            const e = 0.5 * k * x * x;
            
            return {
                results: [
                    { label: 'Pertambahan Panjang (x)', value: x, unit: 'm' },
                    { label: 'Pertambahan Panjang', value: x * 100, unit: 'cm' },
                    { label: 'Energi Potensial Pegas (Ep)', value: e, unit: 'J' },
                    { label: 'Gaya', value: f, unit: 'N' },
                    { label: 'Konstanta Pegas', value: k, unit: 'N/m' }
                ],
                formula: 'x = F / k',
                calculation: `x = ${formatNumber(f)} / ${formatNumber(k)}\n` +
                            `x = ${formatNumber(x)} m = ${formatNumber(x * 100)} cm`
            };
        }
    }
};
