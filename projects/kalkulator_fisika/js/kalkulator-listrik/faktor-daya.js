// js/kalkulator-listrik/faktor-daya.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'faktor-daya',
    title: '📐 Faktor Daya',
    inputs: [
        { id: 'r', type: 'number', label: 'Hambatan (R)', unit: 'Ω' },
        { id: 'z', type: 'number', label: 'Impedansi (Z)', unit: 'Ω' }
    ],
    calculate: (inputs) => {
        const r = validatePositive(inputs.r, 'Hambatan');
        const z = validatePositive(inputs.z, 'Impedansi');
        const pf = r / z;
        const phi = Math.acos(pf);
        const phiDeg = phi * 180 / Math.PI;
        
        return {
            results: [
                { label: 'Faktor Daya (cos φ)', value: pf, unit: '' },
                { label: 'Sudut Fase (φ)', value: phiDeg, unit: '°' },
                { label: 'Persentase', value: pf * 100, unit: '%' }
            ],
            formula: 'cos φ = R / Z',
            calculation: `cos φ = ${formatNumber(r)} / ${formatNumber(z)} = ${formatNumber(pf)}`
        };
    }
};
