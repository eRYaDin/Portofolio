// ==================== DATA BOLA ====================
// Semua gambar PNG berukuran 500x500px
// Scale mengatur tampilan besar/kecil di canvas (KUNCI UTAMA!)
// Cd = Koefisien drag aerodinamik bola (referensi empiris)
const balls = [
  { 
    name: "Pingpong",  
    mass: 0.0027,      // kg
    diameter: 0.04,    // m
    scale: 0.5,        // skala tampilan di canvas
    Cd: 0.40,          // Bola ringan, relatif tinggi
    image: "assets/pingpong.png"
  },
  { 
    name: "Golf",      
    mass: 0.045,  
    diameter: 0.043, 
    scale: 0.55, 
    Cd: 0.25,          // Permukaan dimple mengurangi drag
    image: "assets/golf.png"
  },
  { 
    name: "Tenis",     
    mass: 0.057,  
    diameter: 0.067, 
    scale: 0.7, 
    Cd: 0.55,          // Permukaan berbulu meningkatkan drag
    image: "assets/tenis.png"
  },
  { 
    name: "Baseball",  
    mass: 0.145,  
    diameter: 0.073, 
    scale: 0.75, 
    Cd: 0.35,          // Permukaan jahitan mempengaruhi aliran
    image: "assets/baseball.png"
  },
  { 
    name: "Kriket",    
    mass: 0.163,  
    diameter: 0.072, 
    scale: 0.75, 
    Cd: 0.40,          // Mirip baseball
    image: "assets/kriket.png"
  },
  { 
    name: "Billiard",  
    mass: 0.156,  
    diameter: 0.057, 
    scale: 0.65, 
    Cd: 0.47,          // Bola mulus, standar sphere
    image: "assets/billiard.png"
  },
  { 
    name: "Bola Sepak",
    mass: 0.43,   
    diameter: 0.22,  
    scale: 1.2, 
    Cd: 0.25,          // Panel kulit mengurangi drag
    image: "assets/bolasepak.png"
  },
  { 
    name: "Futsal",
    mass: 0.42,   
    diameter: 0.20,  
    scale: 1.1, 
    Cd: 0.27,
    image: "assets/futsal.png"
  },
  { 
    name: "Basket",    
    mass: 0.62,   
    diameter: 0.24,  
    scale: 1.3, 
    Cd: 0.47,          // Permukaan kasar, mendekati sphere
    image: "assets/basket.png"
  },
  { 
    name: "Voli",      
    mass: 0.27,   
    diameter: 0.21,  
    scale: 1.1, 
    Cd: 0.35,
    image: "assets/voly.png"
  },
  { 
    name: "Bola Besi", 
    mass: 0.50,   
    diameter: 0.05,  
    scale: 0.6, 
    Cd: 0.47,          // Bola mulus sempurna
    image: "assets/bola_besi.png"
  },
  { 
    name: "Bowling",   
    mass: 6.8,    
    diameter: 0.22,  
    scale: 1.4, 
    Cd: 0.47,          // Bola mulus, berat → drag kurang efektif
    image: "assets/bowling.png"
  }
];

// ==================== KONSTANTA FISIKA ====================
const G = 9.81;  // Gravitasi bumi (m/s²)
const DT = 0.01; // Time step untuk simulasi (detik)

// ==================== KONSTANTA UI ====================
const DEFAULT_Y0 = 10;    // Ketinggian awal default (m)
const MIN_Y0 = 0;         // Ketinggian minimum (m)
const MAX_Y0 = 20;        // Ketinggian maksimum (m)

// ==================== PRELOAD IMAGES ====================
// Load semua gambar bola di awal agar rendering smooth
const ballImages = {};
function preloadBallImages() {
  balls.forEach((ball, index) => {
    const img = new Image();
    img.src = ball.image;
    
    // Fallback jika gambar gagal load
    img.onerror = function() {
      console.warn(`Gagal memuat gambar: ${ball.image}`);
    };
    
    ballImages[index] = img;
  });
}
// Jalankan preload saat script dimuat
preloadBallImages();

// ==================== NOTEBOOK CONFIG (TAMBAHAN BARU) ====================
// URL raw GitHub untuk file Python
// Sistem akan fetch .py ini, lalu wrap otomatis menjadi .ipynb untuk render & download
const NOTEBOOK_CONFIG = {
  // Raw URL file .py di GitHub Anda
  rawUrl: "https://raw.githubusercontent.com/eRYaDin/Portofolio/main/projects/Pantulan_bola/phyton/proyektil.py",

  // Nama file saat di-download
  downloadName: "Simulasi_Dinamika_Energi_Proyektil.ipynb",

  // Judul yang tampil di header notebook
  title: "proyektil.py → Notebook",

  // Subtitle / deskripsi
  subtitle: "Simulasi Dinamika Energi 2D – Proyektil Motion",

  // Markdown intro yang tampil SEBELUM kode (cell pertama)
  introMarkdown: [
    "# 🚀 Simulasi Dinamika Energi 2D",
    "",
    "**Sumber:** `proyektil.py` — dari repo [Portofolio](https://github.com/eRYaDin/Portofolio)",
    "",
    "## Tujuan",
    "Memahami bagaimana perubahan massa bola (m) mempengaruhi energi (Energi Kinetik, Potensial, dan Mekanik) selama lemparan proyektil, dengan mengasumsikan tidak ada gesekan udara.",
    "",
    "## Parameter yang Dicari",
    "1. **Energi Kinetik (Ek)** — `0.5 * m * v²`",
    "2. **Energi Potensial (Ep)** — `m * g * h`",
    "3. **Energi Mekanik (Em)** — `Ek + Ep`",
    "",
    "> 💡 Selama `v0` dan sudut lemparan konstan, lintasan dan waktu terbang **tidak** dipengaruhi massa. Semua nilai energi berbanding lurus dengan massa."
  ]
};
