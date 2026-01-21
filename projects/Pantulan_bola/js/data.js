// ==================== CONSTANTS ====================

const G = 9.8; // Gravitasi (m/s²)
const DT = 0.01; // Time step simulasi (detik)

// ==================== BALL DATA ====================

/**
 * Data bola dengan properti fisik
 * scale: ukuran relatif untuk rendering (1.0 = normal)
 */
const balls = [
  {
    name: "Pingpong",
    mass: 0.0027, // kg
    diameter: 0.04, // m
    image: "assets/pingpong.png",
    scale: 1.0
  },
  {
    name: "Bola Golf",
    mass: 0.046, // kg
    diameter: 0.043, // m
    image: "assets/golf.png",
    scale: 1.0
  },
  {
    name: "Bola Tenis",
    mass: 0.058, // kg
    diameter: 0.067, // m
    image: "assets/tenis.png",
    scale: 1.2
  },
  {
    name: "Bola Baseball",
    mass: 0.145, // kg
    diameter: 0.074, // m
    image: "assets/baseball.png",
    scale: 1.3
  },
  {
    name: "Bola Voli",
    mass: 0.27, // kg
    diameter: 0.21, // m
    image: "assets/voli.png",
    scale: 1.5
  },
  {
    name: "Bola Sepak",
    mass: 0.43, // kg
    diameter: 0.22, // m
    image: "assets/sepakbola.png",
    scale: 1.6
  },
  {
    name: "Bola Basket",
    mass: 0.62, // kg
    diameter: 0.24, // m
    image: "assets/basket.png",
    scale: 1.7
  },
  {
    name: "Bowling Ball",
    mass: 6.8, // kg
    diameter: 0.22, // m
    image: "assets/bowling.png",
    scale: 1.8
  }
];

// ==================== IMAGE PRELOADING ====================

/**
 * Preload semua gambar bola
 */
const ballImages = balls.map(ball => {
  const img = new Image();
  img.src = ball.image;
  
  // Log saat gambar berhasil load
  img.onload = () => {
    console.log("✅ Loaded:", ball.name);
  };
  
  // Log error jika gambar gagal load
  img.onerror = () => {
    console.warn("⚠️ Failed to load:", ball.name, "from", ball.image);
  };
  
  return img;
});

console.log("📦 Ball data loaded:", balls.length, "balls");
console.log("🖼️ Preloading", ballImages.length, "images...");
