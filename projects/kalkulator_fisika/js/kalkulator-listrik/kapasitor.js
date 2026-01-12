// ==================== TOTAL KAPASITOR ====================
// Seri & Paralel

import { validateNumberArray, calculateCapacitorSeries, calculateCapacitorParallel, formatNumber } from '../utils.js';

export const calculator = {
    id: 'kapasitor',
    title: '🔋 Total Kapasitor',
    
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
            id: 'capacitors', 
            type: 'array', 
            label: 'Kapasitor', 
            unit: 'F', 
            initial: 3 
        }
    ],
    
    calculate: (inputs) => {
        const mode = inputs.mode;
        const values = validateNumberArray(inputs.capacitors, 'Kapasitor');
        
        let total;
        let formula;
        let calculation;
        
        if (mode === 'series') {
            total = calculateCapacitorSeries(values);
            formula = '1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ...';
            const reciprocals = values.map(v => `1/${formatNumber(v)}`).join(' + ');
            calculation = `1/C_total = ${reciprocals}\nC_total = ${formatNumber(total)} F`;
        } else {
            total = calculateCapacitorParallel(values);
            formula = 'C_total = C₁ + C₂ + C₃ + ...';
            calculation = `C_total = ${values.map(formatNumber).join(' + ')} = ${formatNumber(total)} F`;
        }
        
        return {
            results: [
                { label: 'Total Kapasitansi', value: total, unit: 'F' },
                { label: 'Total (µF)', value: total * 1000000, unit: 'µF' },
                { label: 'Jumlah Kapasitor', value: values.length, unit: 'buah' }
            ],
            formula,
            calculation
        };
    }
};
