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
 * @param {number} rotRad rotation in radians
 * @param {number} opacity
 * @param {number} opacityDecay
 * @param {number} speedDecayFactor
 * @param {number} sizeDecay
 * @param {number} colorIndex
 * @param {boolean} affectedByGravity
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
  rotRad?: number;
  opacity?: number;
  opacityDecay?: number;
  sizeDecay?: number;
  speedDecayFactor?: number;
  colorIndex?: number;
  affectedByGravity?: boolean;
  affectedByTimeZone?: boolean;
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
 * @param {number} rotRad rotation in radians
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
  public rotRad: number;
  public opacity: number;
  public opacityDecay: number;
  public speedDecayFactor: number;
  public sizeDecay: number;
  public colorIndex: number;
  public affectedByGravity: boolean;
  public affectedByTimeZone: boolean;

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
    rotRad,
    opacity,
    opacityDecay,
    speedDecayFactor,
    colorIndex,
    sizeDecay,
    affectedByGravity,
    affectedByTimeZone,
  }: GameParticleData) {
    this.id =
      id ?? `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
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
    this.rotRad = rotRad ?? 0;
    this.opacity = opacity ?? 0;
    this.opacityDecay = opacityDecay ?? 0;
    this.speedDecayFactor = speedDecayFactor ?? 1;
    this.sizeDecay = sizeDecay ?? 0;
    this.colorIndex = colorIndex ?? 0;
    this.affectedByGravity = affectedByGravity ?? true;
    this.affectedByTimeZone = affectedByTimeZone ?? true;
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

  public update(
    timeFactor: number = 1,
    globalGravityX: number = 0,
    globalGravityY: number = 0
  ) {
    if (!this.affectedByTimeZone) timeFactor = 1;
    if (this.opacity <= 0) return;
    this.x += this.vx * timeFactor;
    this.y += this.vy * timeFactor;
    this.vx += (this.ax + globalGravityX) * timeFactor;
    this.vy += (this.ay + globalGravityY) * timeFactor;
    this.ax += this.jx * timeFactor;
    this.ay += this.jy * timeFactor;
    this.opacity -= this.opacityDecay * timeFactor;
    if (this.sizeDecay != 0) {
      this.w -= this.sizeDecay * timeFactor;
      this.h -= this.sizeDecay * timeFactor;
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
    if (!this.affectedByGravity) return;
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
    if (!this.affectedByGravity) return;
    this.ax = (x - this.x) * magnitude * 0.005;
    this.ay = (y - this.y) * magnitude * 0.005;
  }
}

interface GameLightningParticleData {
  centerX: number;
  centerY: number;
  paddingX: number;
  paddingY: number;
}

class GameLightningParticle {
  particles: GameParticle[];
  centerX: number;
  centerY: number;
  paddingX: number;
  paddingY: number;
  currentTagetX: number;
  currentTagetY: number;
  pointIndex: number;
  constructor({
    centerX,
    centerY,
    paddingX,
    paddingY,
  }: GameLightningParticleData) {
    this.particles = [];
    this.centerX = centerX;
    this.centerY = centerY;
    this.paddingX = paddingX;
    this.paddingY = paddingY;
    this.currentTagetX = 0;
    this.currentTagetY = 0;
    this.pointIndex = 0;
  }

  public update() {
    this.particles.forEach((particle) => {
      particle.update();
    });
    this.particles.forEach((particle) => {
      if (particle.opacity <= 0.01)
        this.particles.splice(this.particles.indexOf(particle), 1);
      particle.update();
    });
    if (this.particles.length > 12) {
      for (let i = 0; i < this.particles.length - 12; i++) {
        this.particles[i].opacityDecay = 0.05;
      }
    }
    this.addParticle();
    if (
      Math.abs(
        this.currentTagetX - this.particles[this.particles.length - 1].x
      ) < 10 &&
      Math.abs(
        this.currentTagetY - this.particles[this.particles.length - 1].y
      ) < 10
    ) {
      if (this.pointIndex == 0) {
        this.currentTagetX =
          this.centerX + this.paddingX + 5 * (Math.random() - 0.5);
        this.currentTagetY =
          this.centerY + this.paddingY + 5 * (Math.random() - 0.5);
      } else if (this.pointIndex == 1) {
        this.currentTagetX =
          this.centerX - this.paddingX + 5 * (Math.random() - 0.5);
        this.currentTagetY =
          this.centerY + this.paddingY + 5 * (Math.random() - 0.5);
      } else if (this.pointIndex == 2) {
        this.currentTagetX =
          this.centerX - this.paddingX + 5 * (Math.random() - 0.5);
        this.currentTagetY =
          this.centerY - this.paddingY + 5 * (Math.random() - 0.5);
      } else if (this.pointIndex == 3) {
        this.currentTagetX =
          this.centerX + this.paddingX + 5 * (Math.random() - 0.5);
        this.currentTagetY =
          this.centerY - this.paddingY + 5 * (Math.random() - 0.5);
      }
      this.pointIndex++;
      if (this.pointIndex > 3) this.pointIndex = 0;
    }
  }

  private addParticle() {
    if (this.particles.length == 0)
      this.particles.push(
        new GameParticle({
          x: this.centerX + this.paddingX,
          y: this.centerY - this.paddingY,
          opacity: 0.7,
          w: 10,
          h: 20 + 30 * Math.random(),
          colorIndex: 3,
          rotRad: Math.PI / 2,
        })
      );
    else {
      for (let i = 0; i < 2; i++) {
        const lastParticle = this.particles[this.particles.length - 1];
        const newStartX =
          lastParticle.x - (lastParticle.h - 3) * Math.sin(lastParticle.rotRad);
        const newStartY =
          lastParticle.y + (lastParticle.h - 3) * Math.cos(lastParticle.rotRad);
        const distance = Math.sqrt(
          Math.pow(this.currentTagetX - newStartX, 2) +
            Math.pow(this.currentTagetY - newStartY, 2)
        );
        if (distance < 51) {
          this.particles.push(
            new GameParticle({
              x: newStartX,
              y: newStartY,
              opacity: 0.7,
              w: 5 + 10 * Math.random(),
              h: distance,
              colorIndex: 3,
              rotRad:
                Math.PI +
                Math.atan2(
                  this.currentTagetX - lastParticle.x,
                  lastParticle.y - this.currentTagetY
                ),
            })
          );
        } else {
          this.particles.push(
            new GameParticle({
              x:
                lastParticle.x -
                (lastParticle.h - 3) * Math.sin(lastParticle.rotRad),
              y:
                lastParticle.y +
                (lastParticle.h - 3) * Math.cos(lastParticle.rotRad),
              opacity: 0.7,
              w: 5 + 15 * Math.random(),
              h: 20 + 30 * Math.random(),
              colorIndex: 3,
              rotRad:
                Math.PI +
                Math.atan2(
                  this.currentTagetX - lastParticle.x,
                  lastParticle.y - this.currentTagetY
                ),
            })
          );
        }
      }
    }
  }
}

export { GameLightningParticle };
export default GameParticle;
