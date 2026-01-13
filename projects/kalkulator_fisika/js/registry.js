// ==================== REGISTRY.JS ====================
// Daftar semua kalkulator - UI tidak tahu rumus, hanya baca dari sini

export const registry = [
    // ========== KALKULATOR LISTRIK ==========
    {
        id: "ohm",
        kategori: "listrik",
        judul: "⚡ Hukum Ohm",
        deskripsi: "Cari V, I, atau R",
        module: () => import('./kalkulator-listrik/ohm.js')
    },
    {
        id: "hambatan",
        kategori: "listrik",
        judul: "🔌 Total Hambatan",
        deskripsi: "Hitung resistor seri/paralel",
        module: () => import('./kalkulator-listrik/hambatan.js')
    },
    {
        id: "daya-dc",
        kategori: "listrik",
        judul: "💡 Daya Listrik DC",
        deskripsi: "P = VI, I²R, V²/R",
        module: () => import('./kalkulator-listrik/daya.js')
    },
    {
        id: "kapasitor",
        kategori: "listrik",
        judul: "🔋 Kapasitor Total",
        deskripsi: "Seri & Paralel",
        module: () => import('./kalkulator-listrik/kapasitor.js')
    },
    {
        id: "energi-kapasitor",
        kategori: "listrik",
        judul: "⚡ Energi Kapasitor",
        deskripsi: "E = ½CV²",
        module: () => import('./kalkulator-listrik/energi-kapasitor.js')
    },
    {
        id: "induktor",
        kategori: "listrik",
        judul: "🌀 Induktor Total",
        deskripsi: "Seri & Paralel",
        module: () => import('./kalkulator-listrik/induktor.js')
    },
    {
        id: "energi-induktor",
        kategori: "listrik",
        judul: "⚡ Energi Induktor",
        deskripsi: "E = ½LI²",
        module: () => import('./kalkulator-listrik/energi-induktor.js')
    },
    {
        id: "pembagi-tegangan",
        kategori: "listrik",
        judul: "📊 Pembagi Tegangan",
        deskripsi: "Voltage Divider",
        module: () => import('./kalkulator-listrik/pembagi-tegangan.js')
    },
    {
        id: "reaktansi",
        kategori: "listrik",
        judul: "🌀 Reaktansi AC",
        deskripsi: "XL & XC",
        module: () => import('./kalkulator-listrik/reaktansi.js')
    },
    {
        id: "impedansi-rlc",
        kategori: "listrik",
        judul: "⚙️ Impedansi RLC",
        deskripsi: "Z dari R, XL, XC",
        module: () => import('./kalkulator-listrik/impedansi-rlc.js')
    },
    {
        id: "resonansi-rlc",
        kategori: "listrik",
        judul: "📻 Resonansi RLC",
        deskripsi: "Frekuensi resonansi",
        module: () => import('./kalkulator-listrik/resonansi-rlc.js')
    },
    {
        id: "faktor-daya",
        kategori: "listrik",
        judul: "📐 Faktor Daya",
        deskripsi: "cos φ = R/Z",
        module: () => import('./kalkulator-listrik/faktor-daya.js')
    },
    {
        id: "rms-ac",
        kategori: "listrik",
        judul: "📊 RMS AC",
        deskripsi: "Vrms & Irms",
        module: () => import('./kalkulator-listrik/rms-ac.js')
    },
    {
        id: "daya-ac",
        kategori: "listrik",
        judul: "💡 Daya AC",
        deskripsi: "P = VIcos(φ)",
        module: () => import('./kalkulator-listrik/daya-ac.js')
    },

    // ========== KALKULATOR MEKANIKA ==========
    {
        id: "glb",
        kategori: "mekanika",
        judul: "🚗 Gerak Lurus Beraturan",
        deskripsi: "GLB: s = vt",
        module: () => import('./kalkulator-mekanika/glb.js')
    },
    {
        id: "glbb",
        kategori: "mekanika",
        judul: "🚀 Gerak Lurus Berubah Beraturan",
        deskripsi: "GLBB: vt, s, a",
        module: () => import('./kalkulator-mekanika/glbb.js')
    },
    {
        id: "gerak-parabola",
        kategori: "mekanika",
        judul: "🎯 Gerak Parabola",
        deskripsi: "Proyektil & lintasan",
        module: () => import('./kalkulator-mekanika/gerak-parabola.js')
    },
    {
        id: "gaya-newton",
        kategori: "mekanika",
        judul: "💪 Hukum Newton",
        deskripsi: "F = ma",
        module: () => import('./kalkulator-mekanika/gaya-newton.js')
    },
    {
        id: "hooke",
        kategori: "mekanika",
        judul: "🔧 Hukum Hooke",
        deskripsi: "F = kx",
        module: () => import('./kalkulator-mekanika/hooke.js')
    },
    {
        id: "energi",
        kategori: "mekanika",
        judul: "⚡ Energi Mekanik",
        deskripsi: "Ek, Ep, Em",
        module: () => import('./kalkulator-mekanika/energi.js')
    },
    {
        id: "momentum",
        kategori: "mekanika",
        judul: "🎯 Momentum & Impuls",
        deskripsi: "p = mv, I = FΔt",
        module: () => import('./kalkulator-mekanika/momentum.js')
    },
    {
        id: "usaha-daya",
        kategori: "mekanika",
        judul: "🔧 Usaha & Daya",
        deskripsi: "W = Fs, P = W/t",
        module: () => import('./kalkulator-mekanika/usaha-daya.js')
    },
    {
        id: "densitas",
        kategori: "mekanika",
        judul: "📦 Massa Jenis",
        deskripsi: "ρ = m/V",
        module: () => import('./kalkulator-mekanika/densitas.js')
    },
    {
        id: "tekanan-fluida",
        kategori: "mekanika",
        judul: "💧 Tekanan Fluida",
        deskripsi: "P = ρgh",
        module: () => import('./kalkulator-mekanika/tekanan-fluida.js')
    },

    // ========== KALKULATOR TERMODINAMIKA ==========
    {
        id: "kalor",
        kategori: "termodinamika",
        judul: "🔥 Kalor",
        deskripsi: "Q = mcΔT",
        module: () => import('./termodinamika/kalor.js')
    },
    {
        id: "pemuaian",
        kategori: "termodinamika",
        judul: "📏 Pemuaian",
        deskripsi: "Pemuaian panjang & volume",
        module: () => import('./termodinamika/pemuaian.js')
    }
];

// Helper: Get calculator by ID
export function getCalculatorById(id) {
    return registry.find(calc => calc.id === id);
}

// Helper: Get calculators by category
export function getCalculatorsByCategory(kategori) {
    return registry.filter(calc => calc.kategori === kategori);
}
