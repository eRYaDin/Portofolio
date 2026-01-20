// ==================== DATA BOLA ====================
// Semua gambar PNG berukuran 500x500px
// Scale mengatur tampilan besar/kecil di canvas
const balls = [
  { 
    name: "Pingpong",  
    mass: 0.0027, 
    diameter: 0.04, 
    scale: 0.5, 
    image: "assets/pingpong.png",
    color: "#ffeb3b" 
  },
  { 
    name: "Golf",      
    mass: 0.045,  
    diameter: 0.043, 
    scale: 0.55, 
    image: "assets/golf.png",
    color: "#fff" 
  },
  { 
    name: "Tenis",     
    mass: 0.057,  
    diameter: 0.067, 
    scale: 0.7, 
    image: "assets/tenis.png",
    color: "#4caf50" 
  },
  { 
    name: "Baseball",  
    mass: 0.145,  
    diameter: 0.073, 
    scale: 0.75, 
    image: "assets/baseball.png",
    color: "#fff" 
  },
  { 
    name: "Kriket",    
    mass: 0.163,  
    diameter: 0.072, 
    scale: 0.75, 
    image: "assets/kriket.png",
    color: "#d32f2f" 
  },
  { 
    name: "Billiard",  
    mass: 0.156,  
    diameter: 0.057, 
    scale: 0.65, 
    image: "assets/billiard.png",
    color: "#212121" 
  },
  { 
    name: "Bola Sepak",
    mass: 0.43,   
    diameter: 0.22,  
    scale: 1.2, 
    image: "assets/bolasepak.png",
    color: "#9c27b0" 
  },
  { 
    name: "Basket",    
    mass: 0.62,   
    diameter: 0.24,  
    scale: 1.3, 
    image: "assets/basket.png",
    color: "#ff9800" 
  },
  { 
    name: "Voli",      
    mass: 0.27,   
    diameter: 0.21,  
    scale: 1.1, 
    image: "assets/voly.png",
    color: "#2196f3" 
  },
  { 
    name: "Bola Besi", 
    mass: 0.50,   
    diameter: 0.05,  
    scale: 0.6, 
    image: "assets/bolabesi.png",
    color: "#607d8b" 
  },
  { 
    name: "Bowling",   
    mass: 6.8,    
    diameter: 0.22,  
    scale: 1.4, 
    image: "assets/bowling.png",
    color: "#000" 
  }
];

// ==================== KONSTANTA FISIKA ====================
const G = 9.81;  // Gravitasi bumi (m/s²)
const DT = 0.01; // Time step untuk simulasi (detik)

// ==================== PRELOAD IMAGES ====================
// Load semua gambar bola di awal agar rendering smooth
const ballImages = {};

function preloadBallImages() {
  balls.forEach((ball, index) => {
    const img = new Image();
    img.src = ball.image;
    ballImages[index] = img;
  });
}

// Jalankan preload saat script dimuat
preloadBallImages();
