// ==================== PHYSICS SIMULATION ENGINE ===================

/**
 * Menjalankan simulasi fisika projectile motion dengan bouncing
 * @param {number} ballIndex - Index bola dari array balls
 * @param {number} v0 - Kecepatan awal (m/s)
 * @param {number} angleDeg - Sudut peluncuran (derajat)
 * @param {number} restitution - Koefisien restitusi (0-1)
 * @param {number} y0 - Ketinggian awal (m)
 * @returns {Object} - { data, summary }
 */
function runSimulation(ballIndex, v0, angleDeg, restitution, y0) {
  const ball = balls[ballIndex];
  const angle = angleDeg * Math.PI / 180;
  const mass = ball.mass;

  const simulationData = [];
  let t = 0;
  let x = 0;
  let y = y0; // Mulai dari ketinggian y0
  let vx = v0 * Math.cos(angle);
  let vy = v0 * Math.sin(angle);
  let bounces = 0;
  let maxHeight = y0; // Max height minimal = ketinggian awal
  let isBouncing = true;

  const maxIterations = 50000;
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;
    
    // Hitung energi
    const speed = Math.sqrt(vx * vx + vy * vy);
    const ke = 0.5 * mass * speed * speed;
    const pe = mass * G * Math.max(0, y);
    const me = ke + pe;

    // Simpan data frame
    simulationData.push({ 
      t, 
      x, 
      y, 
      vx, 
      vy, 
      speed, 
      ke, 
      pe, 
      me 
    });

    // Update max height
    if (y > maxHeight) {
      maxHeight = y;
    }

    // Update velocity (gravitasi)
    vy -= G * DT;
    
    // Update position
    x += vx * DT;
    y += vy * DT;
    t += DT;

    // Deteksi pantulan dengan tanah
    if (y <= 0 && vy < 0) {
      y = 0;
      vy = -vy * restitution;
      vx = vx * restitution;
      bounces++;
      
      // Cek apakah bola masih memantul signifikan
      if (Math.abs(vy) < 0.1 && Math.abs(vx) < 0.05) {
        isBouncing = false;
      }
    }

    // Stop jika bola sudah berhenti
    if (!isBouncing && Math.abs(vx) < 0.01) {
      break;
    }

    // Safety break untuk waktu terlalu lama
    if (t > 100) {
      break;
    }
  }

  // Return data dan summary
  return {
    data: simulationData,
    summary: {
      maxHeight: maxHeight,
      totalDistance: x,
      flightTime: t,
      bounces: bounces
    }
  };
}

/**
 * Menghitung energi pada titik tertentu
 * @param {number} mass - Massa bola (kg)
 * @param {number} vx - Kecepatan horizontal (m/s)
 * @param {number} vy - Kecepatan vertikal (m/s)
 * @param {number} y - Posisi vertikal (m)
 * @returns {Object} - { ke, pe, me }
 */
function calculateEnergy(mass, vx, vy, y) {
  const speed = Math.sqrt(vx * vx + vy * vy);
  const ke = 0.5 * mass * speed * speed;
  const pe = mass * G * Math.max(0, y);
  const me = ke + pe;
  
  return { ke, pe, me };
}

/
 * Menghitung trajectory ideal tanpa pantulan (untuk referensi)
 * @param {number} v0 - Kecepatan awal (m/s)
 * @param {number} angleDeg - Sudut peluncuran (derajat)
 * @returns {Object} - { maxHeight, range, timeOfFlight }
 */
function calculateIdealTrajectory(v0, angleDeg) {
  const angle = angleDeg * Math.PI / 180;
  const v0x = v0 * Math.cos(angle);
  const v0y = v0 * Math.sin(angle);
  
  const timeOfFlight = (2 * v0y) / G;
  const maxHeight = (v0y * v0y) / (2 * G);
  const range = v0x * timeOfFlight;
  
  return {
    maxHeight,
    range,
    timeOfFlight
  };
}
