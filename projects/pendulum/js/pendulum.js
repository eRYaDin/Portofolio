/* ═══════════════════════════════════════════════════════════
   pendulum.js — Physics Logic
   Class Pendulum: semua kalkulasi fisika ada di sini.
   Untuk menambah fitur fisika baru, cukup tambah method di class ini.
═══════════════════════════════════════════════════════════ */

class Pendulum {
  /**
   * @param {object} config
   * config.length   - panjang tali (m)
   * config.mass     - massa beban (kg)
   * config.angle    - sudut awal (radian)
   * config.gravity  - gravitasi (m/s²)
   * config.damping  - koefisien redaman (0 = ideal)
   */
  constructor(config = {}) {
    this.length  = config.length  ?? 1.5;
    this.mass    = config.mass    ?? 1.0;
    this.angle   = config.angle   ?? (30 * Math.PI / 180);
    this.gravity = config.gravity ?? 9.81;
    this.damping = config.damping ?? 0;

    // State
    this.omega        = 0;      // angular velocity (rad/s)
    this.time         = 0;      // elapsed time (s)
    this.tracePoints  = [];     // jejak posisi ujung pendulum
    this.maxTrace     = 500;    // maks titik jejak

    // Untuk menghitung periode otomatis
    this._lastSign    = Math.sign(this.angle);
    this._halfPeriods = 0;
    this._lastHalfTime= 0;
    this.measuredPeriod = null; // periode terukur (s)

    // Simpan sudut awal untuk reset
    this._initAngle  = this.angle;
  }

  // ─── Update satu langkah simulasi ────────────────────────
  // dt: delta time dalam detik
  // Menggunakan metode Runge-Kutta orde 4 (RK4) untuk akurasi
  step(dt) {
    const alpha = (t, a, w) =>
      -(this.gravity / this.length) * Math.sin(a)
      - this.damping * w;

    // RK4
    const k1a = this.omega;
    const k1w = alpha(this.time, this.angle, this.omega);

    const k2a = this.omega + 0.5 * dt * k1w;
    const k2w = alpha(this.time + 0.5*dt, this.angle + 0.5*dt*k1a, this.omega + 0.5*dt*k1w);

    const k3a = this.omega + 0.5 * dt * k2w;
    const k3w = alpha(this.time + 0.5*dt, this.angle + 0.5*dt*k2a, this.omega + 0.5*dt*k2w);

    const k4a = this.omega + dt * k3w;
    const k4w = alpha(this.time + dt, this.angle + dt*k3a, this.omega + dt*k3w);

    this.angle += (dt / 6) * (k1a + 2*k2a + 2*k3a + k4a);
    this.omega += (dt / 6) * (k1w + 2*k2w + 2*k3w + k4w);
    this.time  += dt;

    // Deteksi perubahan tanda sudut → hitung periode
    const sign = Math.sign(this.angle);
    if (sign !== 0 && sign !== this._lastSign) {
      this._halfPeriods++;
      if (this._halfPeriods % 2 === 0) {
        // selesai satu periode penuh
        const now = this.time;
        this.measuredPeriod = 2 * (now - this._lastHalfTime);
        this._lastHalfTime  = now;
      }
      this._lastSign = sign;
    }

    // Simpan jejak
    const pos = this.bobPosition();
    this.tracePoints.push({ x: pos.x, y: pos.y });
    if (this.tracePoints.length > this.maxTrace) {
      this.tracePoints.shift();
    }
  }

  // ─── Posisi bob (relatif terhadap pivot) ─────────────────
  bobPosition() {
    return {
      x: this.length * Math.sin(this.angle),
      y: this.length * Math.cos(this.angle),
    };
  }

  // ─── Energi ──────────────────────────────────────────────
  // Referensi ketinggian = posisi pivot
  potentialEnergy() {
    const h = -this.length * Math.cos(this.angle); // minus karena y ke bawah
    return this.mass * this.gravity * (this.length - this.length * Math.cos(this.angle));
  }

  kineticEnergy() {
    const v = this.velocity();
    return 0.5 * this.mass * v * v;
  }

  totalEnergy() {
    return this.potentialEnergy() + this.kineticEnergy();
  }

  // ─── Kecepatan linear ujung pendulum ─────────────────────
  velocity() {
    return Math.abs(this.omega * this.length);
  }

  // ─── Periode teoritis (rumus ideal) ──────────────────────
  theoreticalPeriod() {
    return 2 * Math.PI * Math.sqrt(this.length / this.gravity);
  }

  // ─── Vektor gaya pada bob ─────────────────────────────────
  // Mengembalikan komponen vektor untuk rendering
  forceVectors() {
    const Fg = this.mass * this.gravity;          // gravitasi (N)
    const Ft = this.mass * this.gravity * Math.cos(this.angle); // tegangan tali (N)
    return { gravity: Fg, tension: Ft };
  }

  // ─── Reset ke kondisi awal ────────────────────────────────
  reset(newAngle) {
    this.angle   = newAngle ?? this._initAngle;
    this.omega   = 0;
    this.time    = 0;
    this.tracePoints   = [];
    this._lastSign     = Math.sign(this.angle);
    this._halfPeriods  = 0;
    this._lastHalfTime = 0;
    this.measuredPeriod= null;
  }

  // ─── Update parameter (tanpa reset state penuh) ───────────
  setParam(key, value) {
    if (key in this) this[key] = value;
  }

  // ─── Hapus jejak saja ─────────────────────────────────────
  clearTrace() {
    this.tracePoints = [];
  }
}


/* ═══════════════════════════════════════════════════════════
   DoublePendulum — sistem kaotis dua pendulum
   Untuk double pendulum mode.
═══════════════════════════════════════════════════════════ */
class DoublePendulum {
  constructor(config = {}) {
    this.l1     = config.l1     ?? 1.0;
    this.l2     = config.l2     ?? 1.0;
    this.m1     = config.m1     ?? 1.0;
    this.m2     = config.m2     ?? 1.0;
    this.a1     = config.a1     ?? (90 * Math.PI / 180);
    this.a2     = config.a2     ?? (45 * Math.PI / 180);
    this.gravity= config.gravity?? 9.81;

    this.v1     = 0;
    this.v2     = 0;
    this.time   = 0;
    this.tracePoints = []; // jejak bob2
    this.maxTrace    = 800;
  }

  step(dt) {
    // Persamaan gerak double pendulum (Lagrangian)
    const { l1, l2, m1, m2, gravity: g, a1, a2, v1, v2 } = this;
    const da = a1 - a2;

    const denom1 = (2*m1 + m2 - m2*Math.cos(2*da));
    const denom2 = (l2/l1) * denom1;

    const alpha1 =
      (-g*(2*m1+m2)*Math.sin(a1)
       - m2*g*Math.sin(a1-2*a2)
       - 2*Math.sin(da)*m2*(v2*v2*l2 + v1*v1*l1*Math.cos(da)))
      / (l1 * denom1);

    const alpha2 =
      (2*Math.sin(da)*(
        v1*v1*l1*(m1+m2)
        + g*(m1+m2)*Math.cos(a1)
        + v2*v2*l2*m2*Math.cos(da)
      )) / (l2 * denom1);

    this.v1 += alpha1 * dt;
    this.v2 += alpha2 * dt;
    this.a1 += this.v1 * dt;
    this.a2 += this.v2 * dt;
    this.time += dt;

    const p2 = this.bob2Position();
    this.tracePoints.push({ x: p2.x, y: p2.y });
    if (this.tracePoints.length > this.maxTrace) this.tracePoints.shift();
  }

  bob1Position() {
    return {
      x: this.l1 * Math.sin(this.a1),
      y: this.l1 * Math.cos(this.a1),
    };
  }

  bob2Position() {
    const b1 = this.bob1Position();
    return {
      x: b1.x + this.l2 * Math.sin(this.a2),
      y: b1.y + this.l2 * Math.cos(this.a2),
    };
  }

  reset() {
    this.a1 = 90 * Math.PI / 180;
    this.a2 = 45 * Math.PI / 180;
    this.v1 = 0; this.v2 = 0;
    this.time = 0;
    this.tracePoints = [];
  }

  clearTrace() {
    this.tracePoints = [];
  }
}
