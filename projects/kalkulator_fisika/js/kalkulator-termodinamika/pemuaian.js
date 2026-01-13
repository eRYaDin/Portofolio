// ==================== PEMUAIAN ====================
// ΔL = α × L₀ × ΔT (Panjang), ΔV = γ × V₀ × ΔT (Volume)

import { validatePositive, validateNumber, formatNumber } from '../utils.js';

export const calculator = {
    id: 'pemuaian',
    title: '📏 Pemuaian',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Jenis Pemuaian:', 
            options: [
                { value: 'panjang', label: 'Pemuaian Panjang' },
                { value: 'luas', label: 'Pemuaian Luas' },
                { value: 'volume', label: 'Pemuaian Volume' }
            ]
        },
        { id: 'l0', type: 'number', label: 'Panjang Awal (L₀)', unit: 'm', condition: m => m === 'panjang' },
        { id: 'alpha', type: 'number', label: 'Koefisien Muai Panjang (α)', unit: '/°C', condition: m => m === 'panjang' },
        { id: 'a0', type: 'number', label: 'Luas Awal (A₀)', unit: 'm²', condition: m => m === 'luas' },
        { id: 'beta', type: 'number', label: 'Koefisien Muai Luas (β)', unit: '/°C', condition: m => m === 'luas' },
        { id: 'v0', type: 'number', label: 'Volume Awal (V₀)', unit: 'm³', condition: m => m === 'volume' },
        { id: 'gamma', type: 'number', label: 'Koefisien Muai Volume (γ)', unit: '/°C', condition: m => m === 'volume' },
        { id: 't1', type: 'number', label: 'Suhu Awal (T₁)', unit: '°C' },
        { id: 't2', type: 'number', label: 'Suhu Akhir (T₂)', unit: '°C' }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        const t1 = validateNumber(inputs.t1, 'Suhu Awal');
        const t2 = validateNumber(inputs.t2, 'Suhu Akhir');
        const dt = t2 - t1;
        
        if (mode === 'panjang') {
            const l0 = validatePositive(inputs.l0, 'Panjang Awal');
            const alpha = validatePositive(inputs.alpha, 'Koefisien Muai Panjang');
            
            // Pertambahan panjang
            const dl = alpha * l0 * dt;
            
            // Panjang akhir
            const lt = l0 + dl;
            
            return {
                results: [
                    { label: 'Pertambahan Panjang (ΔL)', value: dl, unit: 'm' },
                    { label: 'Pertambahan Panjang', value: dl * 100, unit: 'cm' },
                    { label: 'Pertambahan Panjang', value: dl * 1000, unit: 'mm' },
                    { label: 'Panjang Akhir (Lt)', value: lt, unit: 'm' },
                    { label: 'Panjang Awal (L₀)', value: l0, unit: 'm' },
                    { label: 'Perubahan Suhu (ΔT)', value: dt, unit: '°C' }
                ],
                formula: 'ΔL = α × L₀ × ΔT\nLt = L₀ + ΔL',
                calculation: `ΔT = ${formatNumber(t2)} - ${formatNumber(t1)} = ${formatNumber(dt)} °C\n` +
                            `ΔL = ${formatNumber(alpha)} × ${formatNumber(l0)} × ${formatNumber(dt)}\n` +
                            `ΔL = ${formatNumber(dl)} m = ${formatNumber(dl * 100)} cm\n` +
                            `Lt = ${formatNumber(l0)} + ${formatNumber(dl)} = ${formatNumber(lt)} m`
            };
        } else if (mode === 'luas') {
            const a0 = validatePositive(inputs.a0, 'Luas Awal');
            const beta = validatePositive(inputs.beta, 'Koefisien Muai Luas');
            
            // Pertambahan luas
            const da = beta * a0 * dt;
            
            // Luas akhir
            const at = a0 + da;
            
            // Catatan: β ≈ 2α
            const alpha_approx = beta / 2;
            
            return {
                results: [
                    { label: 'Pertambahan Luas (ΔA)', value: da, unit: 'm²' },
                    { label: 'Pertambahan Luas', value: da * 10000, unit: 'cm²' },
                    { label: 'Luas Akhir (At)', value: at, unit: 'm²' },
                    { label: 'Luas Awal (A₀)', value: a0, unit: 'm²' },
                    { label: 'Perubahan Suhu (ΔT)', value: dt, unit: '°C' },
                    { label: 'α (perkiraan)', value: alpha_approx, unit: '/°C' }
                ],
                formula: 'ΔA = β × A₀ × ΔT\nAt = A₀ + ΔA\nβ ≈ 2α',
                calculation: `ΔT = ${formatNumber(t2)} - ${formatNumber(t1)} = ${formatNumber(dt)} °C\n` +
                            `ΔA = ${formatNumber(beta)} × ${formatNumber(a0)} × ${formatNumber(dt)}\n` +
                            `ΔA = ${formatNumber(da)} m²\n` +
                            `At = ${formatNumber(a0)} + ${formatNumber(da)} = ${formatNumber(at)} m²`
            };
        } else {
            const v0 = validatePositive(inputs.v0, 'Volume Awal');
            const gamma = validatePositive(inputs.gamma, 'Koefisien Muai Volume');
            
            // Pertambahan volume
            const dv = gamma * v0 * dt;
            
            // Volume akhir
            const vt = v0 + dv;
            
            // Catatan: γ ≈ 3α
            const alpha_approx = gamma / 3;
            
            return {
                results: [
                    { label: 'Pertambahan Volume (ΔV)', value: dv, unit: 'm³' },
                    { label: 'Pertambahan Volume', value: dv * 1000, unit: 'L' },
                    { label: 'Pertambahan Volume', value: dv * 1000000, unit: 'mL' },
                    { label: 'Volume Akhir (Vt)', value: vt, unit: 'm³' },
                    { label: 'Volume Awal (V₀)', value: v0, unit: 'm³' },
                    { label: 'Perubahan Suhu (ΔT)', value: dt, unit: '°C' },
                    { label: 'α (perkiraan)', value: alpha_approx, unit: '/°C' }
                ],
                formula: 'ΔV = γ × V₀ × ΔT\nVt = V₀ + ΔV\nγ ≈ 3α',
                calculation: `ΔT = ${formatNumber(t2)} - ${formatNumber(t1)} = ${formatNumber(dt)} °C\n` +
                            `ΔV = ${formatNumber(gamma)} × ${formatNumber(v0)} × ${formatNumber(dt)}\n` +
                            `ΔV = ${formatNumber(dv)} m³ = ${formatNumber(dv * 1000)} L\n` +
                            `Vt = ${formatNumber(v0)} + ${formatNumber(dv)} = ${formatNumber(vt)} m³`
            };
        }
    }
};
