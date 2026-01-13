// ==================== ENERGI MEKANIK ====================
// Ek = ½mv², Ep = mgh, Em = Ek + Ep

import { validatePositive, formatNumber, CONSTANTS } from '../utils.js';

export const calculator = {
    id: 'energi',
    title: '⚡ Energi Mekanik',
    
    inputs: [
        { id: 'm', type: 'number', label: 'Massa (m)', unit: 'kg' },
        { id: 'v', type: 'number', label: 'Kecepatan (v)', unit: 'm/s' },
        { id: 'h', type: 'number', label: 'Ketinggian (h)', unit: 'm' },
        { id: 'g', type: 'number', label: 'Gravitasi (g)', unit: 'm/s²' }
    ],
    
    calculate: (inputs) => {
        const m = validatePositive(inputs.m, 'Massa');
        const v = validatePositive(inputs.v || 0, 'Kecepatan') || 0;
        const h = validatePositive(inputs.h || 0, 'Ketinggian') || 0;
        const g = validatePositive(inputs.g || CONSTANTS.GRAVITY, 'Gravitasi');
        
        // Energi Kinetik
        const ek = 0.5 * m * v * v;
        
        // Energi Potensial
        const ep = m * g * h;
        
        // Energi Mekanik Total
        const em = ek + ep;
        
        return {
            results: [
                { label: 'Energi Kinetik (Eₖ)', value: ek, unit: 'J' },
                { label: 'Energi Potensial (Eₚ)', value: ep, unit: 'J' },
                { label: 'Energi Mekanik Total (Eₘ)', value: em, unit: 'J' },
                { label: 'Energi Total (kJ)', value: em / 1000, unit: 'kJ' }
            ],
            formula: 'Eₖ = ½mv²\nEₚ = mgh\nEₘ = Eₖ + Eₚ',
            calculation: `Eₖ = ½ × ${formatNumber(m)} × ${formatNumber(v)}² = ${formatNumber(ek)} J\n` +
                        `Eₚ = ${formatNumber(m)} × ${formatNumber(g)} × ${formatNumber(h)} = ${formatNumber(ep)} J\n` +
                        `Eₘ = ${formatNumber(ek)} + ${formatNumber(ep)} = ${formatNumber(em)} J`
        };
    }
};
