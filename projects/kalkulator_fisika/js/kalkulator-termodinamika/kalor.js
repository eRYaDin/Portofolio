// ==================== KALOR ====================
// Q = m × c × ΔT

import { validatePositive, validateNumber, formatNumber } from '../utils.js';

export const calculator = {
    id: 'kalor',
    title: '🔥 Kalor',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Hitung:', 
            options: [
                { value: 'q', label: 'Kalor (Q)' },
                { value: 'm', label: 'Massa (m)' },
                { value: 'c', label: 'Kalor Jenis (c)' },
                { value: 'dt', label: 'Perubahan Suhu (ΔT)' }
            ]
        },
        { id: 'm', type: 'number', label: 'Massa (m)', unit: 'kg', condition: m => m !== 'm' },
        { id: 'c', type: 'number', label: 'Kalor Jenis (c)', unit: 'J/(kg·°C)', condition: m => m !== 'c' },
        { id: 't1', type: 'number', label: 'Suhu Awal (T₁)', unit: '°C', condition: m => m === 'q' || m === 'm' || m === 'c' },
        { id: 't2', type: 'number', label: 'Suhu Akhir (T₂)', unit: '°C', condition: m => m === 'q' || m === 'm' || m === 'c' },
        { id: 'q', type: 'number', label: 'Kalor (Q)', unit: 'J', condition: m => m === 'm' || m === 'c' || m === 'dt' },
        { id: 'dt_in', type: 'number', label: 'Perubahan Suhu (ΔT)', unit: '°C', condition: m => m === 'm' || m === 'c' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        
        if (mode === 'q') {
            const m = validatePositive(inputs.m, 'Massa');
            const c = validatePositive(inputs.c, 'Kalor Jenis');
            const t1 = validateNumber(inputs.t1, 'Suhu Awal');
            const t2 = validateNumber(inputs.t2, 'Suhu Akhir');
            const dt = t2 - t1;
            const q = m * c * dt;
            
            const process = q > 0 ? 'Melepas Kalor (Pemanasan)' : 'Menerima Kalor (Pendinginan)';
            
            return {
                results: [
                    { label: 'Kalor (Q)', value: q, unit: 'J' },
                    { label: 'Kalor', value: q / 1000, unit: 'kJ' },
                    { label: 'Kalor', value: q / 4184, unit: 'kkal' },
                    { label: 'Perubahan Suhu (ΔT)', value: dt, unit: '°C' },
                    { label: 'Proses', value: process, unit: '' }
                ],
                formula: 'Q = m × c × ΔT\nΔT = T₂ - T₁',
                calculation: `ΔT = ${formatNumber(t2)} - ${formatNumber(t1)} = ${formatNumber(dt)} °C\n` +
                            `Q = ${formatNumber(m)} × ${formatNumber(c)} × ${formatNumber(dt)}\n` +
                            `Q = ${formatNumber(q)} J = ${formatNumber(q / 1000)} kJ`
            };
        } else if (mode === 'm') {
            const q = validateNumber(inputs.q, 'Kalor');
            const c = validatePositive(inputs.c, 'Kalor Jenis');
            const t1 = validateNumber(inputs.t1, 'Suhu Awal');
            const t2 = validateNumber(inputs.t2, 'Suhu Akhir');
            const dt = t2 - t1;
            
            if (Math.abs(dt) < 0.001) {
                throw new Error('Perubahan suhu tidak boleh nol');
            }
            
            const m = q / (c * dt);
            
            return {
                results: [
                    { label: 'Massa (m)', value: m, unit: 'kg' },
                    { label: 'Massa', value: m * 1000, unit: 'g' },
                    { label: 'Kalor', value: q, unit: 'J' },
                    { label: 'Perubahan Suhu', value: dt, unit: '°C' }
                ],
                formula: 'm = Q / (c × ΔT)',
                calculation: `m = ${formatNumber(q)} / (${formatNumber(c)} × ${formatNumber(dt)})\n` +
                            `m = ${formatNumber(m)} kg`
            };
        } else if (mode === 'c') {
            const q = validateNumber(inputs.q, 'Kalor');
            const m = validatePositive(inputs.m, 'Massa');
            const t1 = validateNumber(inputs.t1, 'Suhu Awal');
            const t2 = validateNumber(inputs.t2, 'Suhu Akhir');
            const dt = t2 - t1;
            
            if (Math.abs(dt) < 0.001) {
                throw new Error('Perubahan suhu tidak boleh nol');
            }
            
            const c = q / (m * dt);
            
            return {
                results: [
                    { label: 'Kalor Jenis (c)', value: c, unit: 'J/(kg·°C)' },
                    { label: 'Massa', value: m, unit: 'kg' },
                    { label: 'Kalor', value: q, unit: 'J' },
                    { label: 'Perubahan Suhu', value: dt, unit: '°C' }
                ],
                formula: 'c = Q / (m × ΔT)',
                calculation: `c = ${formatNumber(q)} / (${formatNumber(m)} × ${formatNumber(dt)})\n` +
                            `c = ${formatNumber(c)} J/(kg·°C)`
            };
        } else {
            const q = validateNumber(inputs.q, 'Kalor');
            const m = validatePositive(inputs.m, 'Massa');
            const c = validatePositive(inputs.c, 'Kalor Jenis');
            const dt = q / (m * c);
            
            return {
                results: [
                    { label: 'Perubahan Suhu (ΔT)', value: dt, unit: '°C' },
                    { label: 'Perubahan Suhu (K)', value: dt, unit: 'K' },
                    { label: 'Kalor', value: q, unit: 'J' },
                    { label: 'Massa', value: m, unit: 'kg' }
                ],
                formula: 'ΔT = Q / (m × c)',
                calculation: `ΔT = ${formatNumber(q)} / (${formatNumber(m)} × ${formatNumber(c)})\n` +
                            `ΔT = ${formatNumber(dt)} °C`
            };
        }
    }
};
