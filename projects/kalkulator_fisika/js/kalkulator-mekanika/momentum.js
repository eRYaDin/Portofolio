// ==================== MOMENTUM & IMPULS ====================
// p = m × v, I = F × Δt = Δp

import { validatePositive, validateNumber, formatNumber } from '../utils.js';

export const calculator = {
    id: 'momentum',
    title: '🎯 Momentum & Impuls',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Hitung:', 
            options: [
                { value: 'momentum', label: 'Momentum (p)' },
                { value: 'impuls', label: 'Impuls (I)' }
            ]
        },
        { id: 'm', type: 'number', label: 'Massa (m)', unit: 'kg', condition: m => m === 'momentum' },
        { id: 'v', type: 'number', label: 'Kecepatan (v)', unit: 'm/s', condition: m => m === 'momentum' },
        { id: 'f', type: 'number', label: 'Gaya (F)', unit: 'N', condition: m => m === 'impuls' },
        { id: 'dt', type: 'number', label: 'Selang Waktu (Δt)', unit: 's', condition: m => m === 'impuls' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'momentum') {
            const m = validatePositive(inputs.m, 'Massa');
            const v = validateNumber(inputs.v, 'Kecepatan');
            const p = m * v;
            
            // Energi kinetik
            const ek = 0.5 * m * v * v;
            
            return {
                results: [
                    { label: 'Momentum (p)', value: p, unit: 'kg·m/s' },
                    { label: 'Energi Kinetik (Ek)', value: ek, unit: 'J' },
                    { label: 'Massa', value: m, unit: 'kg' },
                    { label: 'Kecepatan', value: v, unit: 'm/s' }
                ],
                formula: 'p = m × v\nEk = ½mv²',
                calculation: `p = ${formatNumber(m)} kg × ${formatNumber(v)} m/s\n` +
                            `p = ${formatNumber(p)} kg·m/s\n` +
                            `Ek = ½ × ${formatNumber(m)} × ${formatNumber(v)}²\n` +
                            `Ek = ${formatNumber(ek)} J`
            };
        } else {
            const f = validateNumber(inputs.f, 'Gaya');
            const dt = validatePositive(inputs.dt, 'Selang Waktu');
            const i = f * dt;
            
            // Perubahan momentum = Impuls
            const dp = i;
            
            return {
                results: [
                    { label: 'Impuls (I)', value: i, unit: 'N·s' },
                    { label: 'Perubahan Momentum (Δp)', value: dp, unit: 'kg·m/s' },
                    { label: 'Gaya Rata-rata', value: f, unit: 'N' },
                    { label: 'Selang Waktu', value: dt, unit: 's' }
                ],
                formula: 'I = F × Δt\nI = Δp = m(v₂ - v₁)',
                calculation: `I = ${formatNumber(f)} N × ${formatNumber(dt)} s\n` +
                            `I = ${formatNumber(i)} N·s\n` +
                            `Δp = ${formatNumber(dp)} kg·m/s`
            };
        }
    }
};
