// js/kalkulator-listrik/impedansi-rlc.js
import { validatePositive, validateNumber, formatNumber, radToDeg } from '../utils.js';
export const calculator = {
    id: 'impedansi-rlc',
    title: '⚙️ Impedansi RLC',
    inputs: [
        { id: 'r', type: 'number', label: 'Hambatan (R)', unit: 'Ω' },
        { id: 'xl', type: 'number', label: 'Reaktansi Induktif (XL)', unit: 'Ω' },
        { id: 'xc', type: 'number', label: 'Reaktansi Kapasitif (XC)', unit: 'Ω' }
    ],
    calculate: (inputs) => {
        const r = validateNumber(inputs.r || 0, 'R') || 0;
        const xl = validateNumber(inputs.xl || 0, 'XL') || 0;
        const xc = validateNumber(inputs.xc || 0, 'XC') || 0;
        
        const x = xl - xc; // Reaktansi total
        const z = Math.sqrt(r * r + x * x); // Impedansi
        const phi = Math.atan2(x, r); // Sudut fase
        const phiDeg = radToDeg(phi);
        
        return {
            results: [
                { label: 'Impedansi (Z)', value: z, unit: 'Ω' },
                { label: 'Reaktansi Total (X)', value: x, unit: 'Ω' },
                { label: 'Sudut Fase (φ)', value: phiDeg, unit: '°' },
                { label: 'Sudut Fase (rad)', value: phi, unit: 'rad' }
            ],
            formula: 'Z = √(R² + (XL - XC)²)\nφ = arctan((XL - XC)/R)',
            calculation: `Z = √(${formatNumber(r)}² + ${formatNumber(x)}²) = ${formatNumber(z)} Ω\nφ = ${formatNumber(phiDeg)}°`
        };
    }
};
