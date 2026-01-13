// ==================== USAHA & DAYA ====================
// W = F × s × cos θ, P = W / t

import { validatePositive, validateNumber, degToRad, formatNumber } from '../utils.js';

export const calculator = {
    id: 'usaha-daya',
    title: '🔧 Usaha & Daya',
    
    inputs: [
        { id: 'f', type: 'number', label: 'Gaya (F)', unit: 'N' },
        { id: 's', type: 'number', label: 'Perpindahan (s)', unit: 'm' },
        { id: 'theta', type: 'number', label: 'Sudut (θ)', unit: '°' },
        { id: 't', type: 'number', label: 'Waktu (t)', unit: 's' }
    ],
    
    calculate: (inputs) => {
        const f = validateNumber(inputs.f, 'Gaya');
        const s = validatePositive(inputs.s, 'Perpindahan');
        const theta = validateNumber(inputs.theta || 0, 'Sudut') || 0;
        const t = validatePositive(inputs.t, 'Waktu');
        
        // Konversi sudut ke radian
        const thetaRad = degToRad(theta);
        
        // Usaha
        const w = f * s * Math.cos(thetaRad);
        
        // Daya
        const p = w / t;
        
        // Komponen gaya sejajar perpindahan
        const f_parallel = f * Math.cos(thetaRad);
        
        return {
            results: [
                { label: 'Usaha (W)', value: w, unit: 'J' },
                { label: 'Usaha (kJ)', value: w / 1000, unit: 'kJ' },
                { label: 'Daya (P)', value: p, unit: 'W' },
                { label: 'Daya (kW)', value: p / 1000, unit: 'kW' },
                { label: 'Daya (hp)', value: p / 745.7, unit: 'hp' },
                { label: 'Komponen Gaya Sejajar', value: f_parallel, unit: 'N' }
            ],
            formula: 'W = F × s × cos θ\nP = W / t',
            calculation: `W = ${formatNumber(f)} × ${formatNumber(s)} × cos(${formatNumber(theta)}°)\n` +
                        `W = ${formatNumber(f)} × ${formatNumber(s)} × ${formatNumber(Math.cos(thetaRad))}\n` +
                        `W = ${formatNumber(w)} J\n` +
                        `P = ${formatNumber(w)} / ${formatNumber(t)}\n` +
                        `P = ${formatNumber(p)} W`
        };
    }
};
