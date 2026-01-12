// ==================== TOTAL HAMBATAN ====================
// Resistor Seri & Paralel

import { validateNumberArray, calculateSeries, calculateParallel, formatNumber } from '../utils.js';

export const calculator = {
    id: 'hambatan',
    title: '🔌 Total Hambatan Resistor',
    
    inputs: [
        { 
            id: 'mode', 
            type: 'mode', 
            label: 'Tipe Rangkaian:', 
            options: [
                { value: 'series', label: 'Seri' },
                { value: 'parallel', label: 'Paralel' }
            ]
        },
        { 
            id: 'resistors', 
            type: 'array', 
            label: 'Resistor', 
            unit: 'Ω', 
            initial: 3 
        }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        const values = validateNumberArray(inputs.resistors, 'Resistor');
        
        let total;
        let formula;
        let calculation;
        
        if (mode === 'series') {
            total = calculateSeries(values);
            formula = 'R_total = R₁ + R₂ + R₃ + ...';
            calculation = `R_total = ${values.map(formatNumber).join(' + ')} = ${formatNumber(total)} Ω`;
        } else {
            total = calculateParallel(values);
            formula = '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...';
            const reciprocals = values.map(v => `1/${formatNumber(v)}`).join(' + ');
            calculation = `1/R_total = ${reciprocals}\nR_total = ${formatNumber(total)} Ω`;
        }
        
        return {
            results: [
                { label: 'Total Hambatan', value: total, unit: 'Ω' },
                { label: 'Jumlah Resistor', value: values.length, unit: 'buah' }
            ],
            formula,
            calculation
        };
    }
};
