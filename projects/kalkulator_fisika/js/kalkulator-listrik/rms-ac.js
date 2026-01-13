// js/kalkulator-listrik/rms-ac.js
import { validatePositive, formatNumber } from '../utils.js';
export const calculator = {
    id: 'rms-ac',
    title: '📊 RMS AC',
    inputs: [
        { id: 'mode', type: 'mode', label: 'Hitung:', options: [
            { value: 'vrms', label: 'Tegangan RMS' },
            { value: 'irms', label: 'Arus RMS' }
        ]},
        { id: 'vmax', type: 'number', label: 'Tegangan Maksimum (Vmax)', unit: 'V', condition: m => m === 'vrms' },
        { id: 'imax', type: 'number', label: 'Arus Maksimum (Imax)', unit: 'A', condition: m => m === 'irms' }
    ],
    calculate: (inputs) => {
        if (inputs.mode === 'vrms') {
            const vmax = validatePositive(inputs.vmax, 'Vmax');
            const vrms = vmax / Math.sqrt(2);
            return {
                results: [
                    { label: 'Tegangan RMS (Vrms)', value: vrms, unit: 'V' },
                    { label: 'Faktor Konversi', value: 1 / Math.sqrt(2), unit: '' }
                ],
                formula: 'Vrms = Vmax / √2',
                calculation: `Vrms = ${formatNumber(vmax)} / √2 = ${formatNumber(vrms)} V`
            };
        } else {
            const imax = validatePositive(inputs.imax, 'Imax');
            const irms = imax / Math.sqrt(2);
            return {
                results: [
                    { label: 'Arus RMS (Irms)', value: irms, unit: 'A' },
                    { label: 'Faktor Konversi', value: 1 / Math.sqrt(2), unit: '' }
                ],
                formula: 'Irms = Imax / √2',
                calculation: `Irms = ${formatNumber(imax)} / √2 = ${formatNumber(irms)} A`
            };
        }
    }
};
