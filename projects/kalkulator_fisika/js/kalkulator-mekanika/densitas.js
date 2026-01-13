// ==================== MASSA JENIS ====================
// ρ = m / V

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'densitas',
    title: '📦 Massa Jenis',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Cari:', 
            options: [
                { value: 'rho', label: 'Massa Jenis (ρ)' },
                { value: 'm', label: 'Massa (m)' },
                { value: 'v', label: 'Volume (V)' }
            ]
        },
        { id: 'm', type: 'number', label: 'Massa (m)', unit: 'kg', condition: m => m === 'rho' || m === 'v' },
        { id: 'v', type: 'number', label: 'Volume (V)', unit: 'm³', condition: m => m === 'rho' || m === 'm' },
        { id: 'rho', type: 'number', label: 'Massa Jenis (ρ)', unit: 'kg/m³', condition: m => m === 'm' || m === 'v' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'rho') {
            const m = validatePositive(inputs.m, 'Massa');
            const v = validatePositive(inputs.v, 'Volume');
            const rho = m / v;
            
            return {
                results: [
                    { label: 'Massa Jenis (ρ)', value: rho, unit: 'kg/m³' },
                    { label: 'Massa Jenis', value: rho / 1000, unit: 'g/cm³' },
                    { label: 'Massa', value: m, unit: 'kg' },
                    { label: 'Volume', value: v, unit: 'm³' },
                    { label: 'Volume', value: v * 1000, unit: 'L' }
                ],
                formula: 'ρ = m / V',
                calculation: `ρ = ${formatNumber(m)} kg / ${formatNumber(v)} m³\n` +
                            `ρ = ${formatNumber(rho)} kg/m³\n` +
                            `ρ = ${formatNumber(rho / 1000)} g/cm³`
            };
        } else if (mode === 'm') {
            const rho = validatePositive(inputs.rho, 'Massa Jenis');
            const v = validatePositive(inputs.v, 'Volume');
            const m = rho * v;
            
            return {
                results: [
                    { label: 'Massa (m)', value: m, unit: 'kg' },
                    { label: 'Massa', value: m * 1000, unit: 'g' },
                    { label: 'Massa Jenis', value: rho, unit: 'kg/m³' },
                    { label: 'Volume', value: v, unit: 'm³' }
                ],
                formula: 'm = ρ × V',
                calculation: `m = ${formatNumber(rho)} kg/m³ × ${formatNumber(v)} m³\n` +
                            `m = ${formatNumber(m)} kg`
            };
        } else {
            const m = validatePositive(inputs.m, 'Massa');
            const rho = validatePositive(inputs.rho, 'Massa Jenis');
            const v = m / rho;
            
            return {
                results: [
                    { label: 'Volume (V)', value: v, unit: 'm³' },
                    { label: 'Volume', value: v * 1000, unit: 'L' },
                    { label: 'Volume', value: v * 1000000, unit: 'mL' },
                    { label: 'Massa', value: m, unit: 'kg' },
                    { label: 'Massa Jenis', value: rho, unit: 'kg/m³' }
                ],
                formula: 'V = m / ρ',
                calculation: `V = ${formatNumber(m)} kg / ${formatNumber(rho)} kg/m³\n` +
                            `V = ${formatNumber(v)} m³\n` +
                            `V = ${formatNumber(v * 1000)} L`
            };
        }
    }
};
