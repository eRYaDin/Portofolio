# ⚡ Konverter Fisika Pro - Struktur Modular

## 📁 Struktur File

```
project/
├── index.html              # HTML utama
├── styles.css              # CSS styling
├── js/
│   ├── app.js             # ✅ Entry point utama
│   ├── registry.js        # ✅ Daftar semua kalkulator
│   ├── ui.js              # ✅ Render UI dinamis
│   ├── utils.js           # ✅ Helper functions
│   ├── converter.js       # ✅ Unit converter logic
│   │
│   ├── kalkulator-listrik/
│   │   ├── ohm.js         # ✅ Hukum Ohm
│   │   ├── hambatan.js    # ✅ Total hambatan
│   │   ├── daya.js        # ✅ Daya DC
│   │   ├── kapasitor.js   # ✅ Kapasitor total
│   │   ├── energi-kapasitor.js # ✅
│   │   ├── induktor.js # ✅
│   │   ├── energi-induktor.js # ✅
│   │   ├── pembagi-tegangan.js # ✅
│   │   ├── reaktansi.js
│   │   ├── resonansi-rlc.js
│   │   ├── impedansi-rlc.js
│   │   ├── faktor-daya.js
│   │   ├── rms-ac.js
│   │   └── daya-ac.js
│   │
│   ├── kalkulator-mekanika/
│   │   ├── glb.js         # ✅ GLB
│   │   ├── glbb.js        # ✅ GLBB
│   │   ├── energi.js      # ✅ Energi mekanik
│   │   ├── gerak-parabola.js
│   │   ├── gaya-newton.js
│   │   ├── hooke.js
│   │   ├── momentum.js
│   │   ├── usaha-daya.js
│   │   ├── densitas.js
│   │   └── tekanan-fluida.js
│   │
│   └── kalkulator-termodinamika/
│       ├── kalor.js
│       └── pemuaian.js
```

## 🎯 Prinsip Desain

### 1. **Separation of Concerns**
- **app.js**: Inisialisasi & event binding
- **registry.js**: Data kalkulator (bukan logic)
- **ui.js**: Render UI (bukan perhitungan)
- **utils.js**: Helper reusable
- **converter.js**: Logic konversi satuan
- **kalkulator-xxx/**: Logic perhitungan per kalkulator

### 2. **ES6 Modules**
- Gunakan `import/export`
- Dynamic imports untuk kalkulator
- Tree-shaking friendly

### 3. **Data-Driven UI**
- UI dibuild dari `registry.js`
- Tidak ada hard-coded HTML untuk kalkulator
- Mudah menambah kalkulator baru

### 4. **Single Responsibility**
- 1 file = 1 kalkulator
- Setiap kalkulator mandiri
- Tidak ada interdependensi antar kalkulator

## 🔧 Cara Menambah Kalkulator Baru

### Step 1: Buat file kalkulator
```javascript
// js/kalkulator-xxx/nama-baru.js
import { validatePositive, formatNumber } from '../utils.js';

export const calculator = {
    id: 'nama-baru',
    title: '🔥 Judul Kalkulator',
    
    inputs: [
        { id: 'input1', type: 'number', label: 'Input 1', unit: 'satuan' },
        { id: 'input2', type: 'number', label: 'Input 2', unit: 'satuan' }
    ],
    
    calculate: (inputs) => {
        const val1 = validatePositive(inputs.input1, 'Input 1');
        const val2 = validatePositive(inputs.input2, 'Input 2');
        const result = val1 * val2; // rumus di sini
        
        return {
            results: [
                { label: 'Hasil', value: result, unit: 'satuan' }
            ],
            formula: 'Rumus = A × B',
            calculation: `Hasil = ${formatNumber(val1)} × ${formatNumber(val2)} = ${formatNumber(result)}`
        };
    }
};
```

### Step 2: Daftarkan di registry.js
```javascript
{
    id: "nama-baru",
    kategori: "listrik", // atau "mekanika", "termodinamika"
    judul: "🔥 Judul Kalkulator",
    deskripsi: "Deskripsi singkat",
    module: () => import('./kalkulator-xxx/nama-baru.js')
}
```

### Step 3: Selesai! ✅
Kalkulator otomatis muncul di UI tanpa perlu edit HTML/CSS.

## 📊 Tipe Input yang Didukung

### 1. Mode Selector
```javascript
{ 
    id: 'mode', 
    type: 'mode', 
    label: 'Pilih Mode:', 
    options: [
        { value: 'opt1', label: 'Opsi 1' },
        { value: 'opt2', label: 'Opsi 2' }
    ]
}
```

### 2. Number Input
```javascript
{ 
    id: 'value', 
    type: 'number', 
    label: 'Nilai', 
    unit: 'm/s' 
}
```

### 3. Conditional Input
```javascript
{ 
    id: 'conditional', 
    type: 'number', 
    label: 'Muncul jika...', 
    condition: (mode) => mode === 'tertentu' 
}
```

### 4. Dynamic Array Input
```javascript
{ 
    id: 'resistors', 
    type: 'array', 
    label: 'Resistor', 
    unit: 'Ω', 
    initial: 3 
}
```

### 5. Select Dropdown
```javascript
{ 
    id: 'pilihan', 
    type: 'select', 
    label: 'Pilih:', 
    options: [
        { value: 'a', label: 'Opsi A' },
        { value: 'b', label: 'Opsi B' }
    ]
}
```

## 🛠️ Utils Functions

### Validasi
- `validateNumber(value, name)` - Validasi angka
- `validatePositive(value, name)` - Validasi angka positif
- `validateNumberArray(arr, name)` - Validasi array angka

### Perhitungan
- `calculateSeries(values)` - Total seri (R, L)
- `calculateParallel(values)` - Total paralel (R, L)
- `calculateCapacitorSeries(values)` - Kapasitor seri
- `calculateCapacitorParallel(values)` - Kapasitor paralel

### Formatting
- `formatNumber(num)` - Format angka untuk display
- `degToRad(deg)` - Derajat ke radian
- `radToDeg(rad)` - Radian ke derajat

### UI Helpers
- `showNotification(msg, type)` - Tampilkan notifikasi
- `get(id)` - Shorthand untuk getElementById
- `createElement(tag, className, innerHTML)` - Create element
- `safeCalculate(fn, ...args)` - Execute dengan error handling

## 🎨 Styling Kalkulator

Semua styling sudah ada di `styles.css`:
- `.calc-card` - Card di menu
- `.calc-panel` - Panel kalkulator
- `.calc-input-group` - Group input
- `.calc-result-box` - Box hasil
- `.calc-formula` - Formula box
- `.mode-selector` - Mode buttons
- `.dynamic-inputs` - Dynamic array inputs

## 🚀 Development

1. **Local Server**: Karena menggunakan ES6 modules, perlu local server:
   ```bash
   python -m http.server 8000
   # atau
   npx serve
   ```

2. **Browser**: Buka `http://localhost:8000`

3. **Console**: Cek console untuk debug info

## ✅ Checklist File yang Harus Dibuat

### Core Files (Sudah Ada ✅)
- [x] app.js
- [x] registry.js
- [x] ui.js
- [x] utils.js
- [x] converter.js

### Kalkulator Listrik
- [x] ohm.js
- [x] hambatan.js
- [x] daya.js
- [x] kapasitor.js
- [ ] energi-kapasitor.js
- [ ] induktor.js
- [ ] energi-induktor.js
- [ ] pembagi-tegangan.js
- [ ] reaktansi.js
- [ ] resonansi-rlc.js
- [ ] impedansi-rlc.js
- [ ] faktor-daya.js
- [ ] rms-ac.js
- [ ] daya-ac.js

### Kalkulator Mekanika
- [x] glb.js
- [x] glbb.js
- [x] energi.js
- [ ] gerak-parabola.js
- [ ] gaya-newton.js
- [ ] hooke.js
- [ ] momentum.js
- [ ] usaha-daya.js
- [ ] densitas.js
- [ ] tekanan-fluida.js

### Kalkulator Termodinamika
- [ ] kalor.js
- [ ] pemuaian.js

## 📝 Notes

- Setiap kalkulator **100% independen**
- **Tidak ada global state** antar kalkulator
- **Dynamic import** = hanya load yang dibutuhkan
- **Type safety** via validation functions
- **Error handling** di setiap level
- **Mobile-friendly** touch interactions

---

**Status**: 🟡 Core sudah selesai, tinggal melengkapi kalkulator sisanya
**Next**: Copy pattern dari contoh untuk membuat kalkulator lainnya
