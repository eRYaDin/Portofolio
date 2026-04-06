// ==================== PHYSICS SIMULATION ENGINE ====================

/**
 * Menjalankan simulasi fisika
 * @param {number} ballIndex
 * @param {number} v0
 * @param {number} angleDeg
 * @param {number} restitution
 * @param {number} y0
 * @param {string} mode - "projectile" | "freefall" | "billiard"
 * @param {number} boxWidth - Lebar kotak biliar (m)
 * @param {number} boxHeight - Tinggi kotak biliar (m)
 */
function runSimulation(ballIndex, v0, angleDeg, restitution, y0, mode = "projectile", boxWidth = 20, boxHeight = 15) {
  const ball = balls[ballIndex];
  const angle = angleDeg * Math.PI / 180;
  const mass = ball.mass;
  const radius = ball.diameter / 2;

  // Hambatan udara
  const useDrag = document.getElementById('airResistanceCheckbox').checked;
  const Cd = parseFloat(document.getElementById('dragSlider').value);
  const rho = 1.225;
  const A = Math.PI * radius * radius;

  const simulationData = [];
  let t = 0;
  let x = 0;
  let y = y0;
  let vx, vy;

  if (mode === "freefall") {
    vx = 0;
    vy = 0;
  } else if (mode === "billiard") {
    vx = v0 * Math.cos(angle);
    vy = v0 * Math.sin(angle);
    x = boxWidth * 0.1;
    y = boxHeight * 0.5;
  } else {
    vx = v0 * Math.cos(angle);
    vy = v0 * Math.sin(angle);
  }

  let bounces = 0;
  let maxHeight = y;
  let isBouncing = true;

  const maxIterations = 50000;
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;

    const speed = Math.sqrt(vx * vx + vy * vy);
    const ke = 0.5 * mass * speed * speed;
    const pe = mass * G * Math.max(0, y);
    const me = ke + pe;

    simulationData.push({ t, x, y, vx, vy, speed, ke, pe, me });

    if (y > maxHeight) maxHeight = y;

    // Update velocity
    if (useDrag && speed > 0) {
      const Fd = 0.5 * Cd * rho * A * speed * speed;
      const dragAcc = Fd / mass;
      vx -= dragAcc * (vx / speed) * DT;
      vy -= (G + dragAcc * (vy / speed)) * DT;
    } else {
      vy -= G * DT;
    }

    x += vx * DT;
    y += vy * DT;
    t += DT;

    if (mode === "billiard") {
      if (y <= 0 && vy < 0)           { y = 0;         vy = -vy * restitution; vx *= restitution; bounces++; }
      if (y >= boxHeight && vy > 0)   { y = boxHeight;  vy = -vy * restitution; vx *= restitution; bounces++; }
      if (x <= 0 && vx < 0)           { x = 0;         vx = -vx * restitution; vy *= restitution; bounces++; }
      if (x >= boxWidth && vx > 0)    { x = boxWidth;   vx = -vx * restitution; vy *= restitution; bounces++; }
      if (speed < 0.05) break;
    } else {
      if (y <= 0 && vy < 0) {
        y = 0;
        vy = -vy * restitution;
        vx *= restitution;
        bounces++;
        if (Math.abs(vy) < 0.1 && Math.abs(vx) < 0.05) isBouncing = false;
      }
      if (!isBouncing && Math.abs(vx) < 0.01) break;
    }

    if (t > 100) break;
  }

  return {
    data: simulationData,
    summary: { maxHeight, totalDistance: x, flightTime: t, bounces },
    mode, boxWidth, boxHeight
  };
}

function calculateEnergy(mass, vx, vy, y) {
  const speed = Math.sqrt(vx * vx + vy * vy);
  const ke = 0.5 * mass * speed * speed;
  const pe = mass * G * Math.max(0, y);
  return { ke, pe, me: ke + pe };
}

function calculateIdealTrajectory(v0, angleDeg) {
  const angle = angleDeg * Math.PI / 180;
  const v0x = v0 * Math.cos(angle);
  const v0y = v0 * Math.sin(angle);
  return {
    timeOfFlight: (2 * v0y) / G,
    maxHeight: (v0y * v0y) / (2 * G),
    range: v0x * (2 * v0y) / G
  };
}
