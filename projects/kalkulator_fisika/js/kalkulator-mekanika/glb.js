// ==================== GERAK LURUS BERATURAN ====================
// s = v × t

import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'glb',
    title: '🚗 Gerak Lurus Beraturan (GLB)',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Cari:', 
            options: [
                { value: 's', label: 'Jarak (s)' },
                { value: 'v', label: 'Kecepatan (v)' },
                { value: 't', label: 'Waktu (t)' }
            ]
        },
        { id: 'input1', type: 'number', label: 'Nilai 1', condition: (m) => m !== 's' },
        { id: 'input2', type: 'number', label: 'Nilai 2', condition: (m) => m !== 'v' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 's') {
            const v = validatePositive(inputs.input1, 'Kecepatan');
            const t = validatePositive(inputs.input2, 'Waktu');
            const s = v * t;
            
            return {
                results: [
                    { label: 'Jarak Tempuh (s)', value: s, unit: 'm' },
                    { label: 'Jarak (km)', value: s / 1000, unit: 'km' }
                ],
                formula: 's = v × t',
                calculation: `s = ${formatNumber(v)} m/s × ${formatNumber(t)} s = ${formatNumber(s)} m`
            };
        } else if (mode === 'v') {
            const s = validatePositive(inputs.input1, 'Jarak');
            const t = validatePositive(inputs.input2, 'Waktu');
            const v = s / t;
            
            return {
                results: [
                    { label: 'Kecepatan (v)', value: v, unit: 'm/s' },
                    { label: 'Kecepatan (km/h)', value: v * 3.6, unit: 'km/h' }
                ],
                formula: 'v = s / t',
                calculation: `v = ${formatNumber(s)} m / ${formatNumber(t)} s = ${formatNumber(v)} m/s`
            };
        } else {
            const s = validatePositive(inputs.input1, 'Jarak');
            const v = validatePositive(inputs.input2, 'Kecepatan');
            const t = s / v;
            
            return {
                results: [
                    { label: 'Waktu (t)', value: t, unit: 's' },
                    { label: 'Waktu (menit)', value: t / 60, unit: 'menit' }
                ],
                formula: 't = s / v',
                calculation: `t = ${formatNumber(s)} m / ${formatNumber(v)} m/s = ${formatNumber(t)} s`
            };
        }
    }
};
