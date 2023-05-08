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

 */
interface GameParticleData {
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
}

/**
  * GameParticle
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

  constructor({
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
  }: GameParticleData) {
    this.id = Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  }

  public update() {
    this.ax += this.jx;
    this.ay += this.jy;
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
  }
}

export default GameParticle;
