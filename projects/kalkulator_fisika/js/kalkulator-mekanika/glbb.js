// ==================== GERAK LURUS BERUBAH BERATURAN ====================
// vt = v0 + at, s = v0·t + ½at², vt² = v0² + 2as

import { validateNumber, formatNumber } from '../utils.js';

export const calculator = {
    id: 'glbb',
    title: '🚀 Gerak Lurus Berubah Beraturan (GLBB)',
    
    inputs: [
        { id: 'v0', type: 'number', label: 'Kecepatan Awal (v₀)', unit: 'm/s' },
        { id: 'a', type: 'number', label: 'Percepatan (a)', unit: 'm/s²' },
        { id: 't', type: 'number', label: 'Waktu (t)', unit: 's' }
    ],
    
    calculate: (inputs) => {
        const v0 = validateNumber(inputs.v0, 'Kecepatan Awal');
        const a = validateNumber(inputs.a, 'Percepatan');
        const t = validateNumber(inputs.t, 'Waktu');
        
        // Calculate vt
        const vt = v0 + (a * t);
        
        // Calculate s
        const s = (v0 * t) + (0.5 * a * t * t);
        
        return {
            results: [
                { label: 'Kecepatan Akhir (vₜ)', value: vt, unit: 'm/s' },
                { label: 'Jarak Tempuh (s)', value: s, unit: 'm' },
                { label: 'Jarak (km)', value: s / 1000, unit: 'km' }
            ],
            formula: 'vₜ = v₀ + at\ns = v₀t + ½at²',
            calculation: `vₜ = ${formatNumber(v0)} + ${formatNumber(a)} × ${formatNumber(t)} = ${formatNumber(vt)} m/s\n` +
                        `s = ${formatNumber(v0)} × ${formatNumber(t)} + ½ × ${formatNumber(a)} × ${formatNumber(t)}² = ${formatNumber(s)} m`
        };
    }
};
