import { Particle } from 'src/features/lab-08-fireworks/entities/particle';

interface ParticleProperties {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  size?: number;
  life?: number;
  mass?: number;
  decay?: number;
  gravity?: number;
  r?: number;
  g?: number;
  b?: number;
  condition?: (particle: Particle, dt: number, time: number) => void;
  action?: (particle: Particle, dt: number, time: number) => void;
  effect?: (particle: Particle, dt: number, time: number) => void;
  onCreate?: (particle: Particle) => void;
}

class ParticlePool {
  current: number;
  particles: Particle[];

  constructor() {
    this.current = 0;
    this.particles = [];
  }

  New(prop: ParticleProperties): void {
    this.current++;
    if (this.current === this.particles.length) {
      this.current = 0;
    }

    const particle = this.particles[this.current];
    particle.alive = true;
    particle.x = prop.x;
    particle.y = prop.y;
    particle.z = prop.z;
    particle.vy = prop.vy || 0;
    particle.vz = prop.vz || 0;
    particle.vx = prop.vx || 0;
    particle.size = prop.size || 1;
    particle.life = prop.life || 1;
    particle.mass = prop.mass || 1;
    particle.decay = prop.decay || 10;
    particle.gravity = prop.gravity || -9.82;
    particle.color[0] = prop.r || 1.0;
    particle.color[1] = prop.g || 1.0;
    particle.color[2] = prop.b || 1.0;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    particle.condition = prop.condition || ((p, d, t) => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    particle.action = prop.action || ((p, d, t) => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    particle.effect = prop.effect || ((p, d, t) => {});

    if (prop.onCreate) { prop.onCreate(particle); }
  }
}

export { ParticlePool };
