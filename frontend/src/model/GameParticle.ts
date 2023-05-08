/**
 * GameParticleData
 * @interface GameParticleData
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} vx velocity x
 * @param {number} vy velocity y
 * @param {number} ax acceleration x
 * @param {number} ay acceleration y
 * @param {number} jx jerk x
 * @param {number} jy jerk y
 * @param {number} w width
 * @param {number} h height
 * @param {number} opacity
 * @param {number} opacityDecay
 * @param {number} speedDecayFactor
 * @param {number} sizeDecay
 * @param {number} colorIndex
 * @param {boolean} gravity
 */
interface GameParticleData {
  id?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  ax?: number;
  ay?: number;
  jx?: number;
  jy?: number;
  w?: number;
  h?: number;
  opacity?: number;
  opacityDecay?: number;
  sizeDecay?: number;
  speedDecayFactor?: number;
  colorIndex?: number;
  gravity?: boolean;
}

/**
 * @class GameParticle
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} vx velocity x
 * @param {number} vy velocity y
 * @param {number} ax acceleration x
 * @param {number} ay acceleration y
 * @param {number} jx jerk x
 * @param {number} jy jerk y
 * @param {number} w width
 * @param {number} h height
 * @param {number} opacity
 * @param {number} opacityDecay
 * @param {number} speedDecayFactor
 * @param {number} sizeDecay
 * @param {number} colorIndex
 */
class GameParticle {
  public id: string;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public ax: number;
  public ay: number;
  public jx: number;
  public jy: number;
  public w: number;
  public h: number;
  public opacity: number;
  public opacityDecay: number;
  public speedDecayFactor: number;
  public sizeDecay: number;
  public colorIndex: number;
  public gravity: boolean;

  constructor({
    id,
    x,
    y,
    vx,
    vy,
    ax,
    ay,
    jx,
    jy,
    w,
    h,
    opacity,
    opacityDecay,
    speedDecayFactor,
    colorIndex,
    sizeDecay,
    gravity,
  }: GameParticleData) {
    this.id =
      id ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.vx = vx ?? 0;
    this.vy = vy ?? 0;
    this.ax = ax ?? 0;
    this.ay = ay ?? 0;
    this.jx = jx ?? 0;
    this.jy = jy ?? 0;
    this.w = w ?? 0;
    this.h = h ?? 0;
    this.opacity = opacity ?? 0;
    this.opacityDecay = opacityDecay ?? 0;
    this.speedDecayFactor = speedDecayFactor ?? 1;
    this.sizeDecay = sizeDecay ?? 0;
    this.colorIndex = colorIndex ?? 0;
    this.gravity = gravity ?? true;
  }

  get data(): GameParticleData {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      ax: this.ax,
      ay: this.ay,
      jx: this.jx,
      jy: this.jy,
      w: this.w,
      h: this.h,
      opacity: this.opacity,
    };
  }

  public update() {
    if (this.opacity <= 0) return;
    this.x += this.vx;
    this.y += this.vy;
    this.vx += this.ax;
    this.vy += this.ay;
    this.ax += this.jx;
    this.ay += this.jy;
    this.opacity -= this.opacityDecay;
    if (this.sizeDecay != 0) {
      this.w -= this.sizeDecay;
      this.h -= this.sizeDecay;
    }
    if (this.speedDecayFactor != 0) {
      this.vx *= this.speedDecayFactor;
      this.vy *= this.speedDecayFactor;
    }
  }

  /**
   * @param x x position of the gravity source
   * @param y y position of the gravity source
   * @param magnitude the magnitude of the gravity in jolt
   *
   * should not be used with setGravityAccel
   */
  public setGravityJolt(x: number, y: number, magnitude: number) {
    if (!this.gravity) return;
    this.jx = (this.x - x) * magnitude;
    this.jy = (this.y - y) * magnitude;
  }

  /**
   * @param x x position of the gravity source
   * @param y y position of the gravity source
   * @param magnitude the magnitude of the gravity in accel
   *
   * should not be used with setGravityJolt
   */
  public setGravityAccel(x: number, y: number, magnitude: number) {
    if (!this.gravity) return;
    const distance = Math.sqrt(
      Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)
    );
    if (distance < 1 || distance > 300) return;
    this.ax = (x - this.x) * magnitude * 0.005;
    this.ay = (y - this.y) * magnitude * 0.005;
  }
}

export default GameParticle;
