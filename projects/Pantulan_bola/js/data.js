// ==================== DATA BOLA ====================
// Semua gambar PNG berukuran 500x500px
// Scale mengatur tampilan besar/kecil di canvas (KUNCI UTAMA!)

const balls = [
  { 
    name: "Pingpong",  
    mass: 0.0027,      // kg
    diameter: 0.04,    // m
    scale: 0.5,        // skala tampilan di canvas
    image: "assets/pingpong.png"
  },
  { 
    name: "Golf",      
    mass: 0.045,  
    diameter: 0.043, 
    scale: 0.55, 
    image: "assets/golf.png"
  },
  { 
    name: "Tenis",     
    mass: 0.057,  
    diameter: 0.067, 
    scale: 0.7, 
    image: "assets/tenis.png"
  },
  { 
    name: "Baseball",  
    mass: 0.145,  
    diameter: 0.073, 
    scale: 0.75, 
    image: "assets/baseball.png"
  },
  { 
    name: "Kriket",    
    mass: 0.163,  
    diameter: 0.072, 
    scale: 0.75, 
    image: "assets/kriket.png"
  },
  { 
    name: "Billiard",  
    mass: 0.156,  
    diameter: 0.057, 
    scale: 0.65, 
    image: "assets/billiard.png"
  },
  { 
    name: "Bola Sepak",
    mass: 0.43,   
    diameter: 0.22,  
    scale: 1.2, 
    image: "assets/bolasepak.png"
  },
  { 
    name: "Futsal",
    mass: 0.42,   
    diameter: 0.20,  
    scale: 1.1, 
    image: "assets/futsal.png"
  },
  { 
    name: "Basket",    
    mass: 0.62,   
    diameter: 0.24,  
    scale: 1.3, 
    image: "assets/basket.png"
  },
  { 
    name: "Voli",      
    mass: 0.27,   
    diameter: 0.21,  
    scale: 1.1, 
    image: "assets/voly.png"
  },
  { 
    name: "Bola Besi", 
    mass: 0.50,   
    diameter: 0.05,  
    scale: 0.6, 
    image: "assets/bola_besi.png"
  },
  { 
    name: "Bowling",   
    mass: 6.8,    
    diameter: 0.22,  
    scale: 1.4, 
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
