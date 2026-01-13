// js/kalkulator-mekanika/gerak-parabola.js
import { validatePositive, degToRad, formatNumber, CONSTANTS } from '../utils.js';
export const calculator = {
    id: 'gerak-parabola',
    title: '🎯 Gerak Parabola',
    inputs: [
        { id: 'v0', type: 'number', label: 'Kecepatan Awal (v₀)', unit: 'm/s' },
        { id: 'theta', type: 'number', label: 'Sudut Elevasi (θ)', unit: '°' },
        { id: 'g', type: 'number', label: 'Gravitasi (g)', unit: 'm/s²' }
    ],
    calculate: (inputs) => {
        const v0 = validatePositive(inputs.v0, 'v₀');
        const theta = validatePositive(inputs.theta, 'θ');
        const g = validatePositive(inputs.g || CONSTANTS.GRAVITY, 'g');
        const thetaRad = degToRad(theta);
        
        const t = (2 * v0 * Math.sin(thetaRad)) / g; // Waktu total
        const x = (v0 * v0 * Math.sin(2 * thetaRad)) / g; // Jarak horizontal
        const ymax = (v0 * v0 * Math.sin(thetaRad) * Math.sin(thetaRad)) / (2 * g); // Tinggi maksimum
        
        return {
            results: [
                { label: 'Waktu Total (t)', value: t, unit: 's' },
                { label: 'Jarak Horizontal (x)', value: x, unit: 'm' },
                { label: 'Tinggi Maksimum (ymax)', value: ymax, unit: 'm' }
            ],
            formula: 't = 2v₀sinθ / g\nx = v₀²sin2θ / g\nymax = v₀²sin²θ / 2g',
            calculation: `t = ${formatNumber(t)} s\nx = ${formatNumber(x)} m\nymax = ${formatNumber(ymax)} m`
        };
    }
};
