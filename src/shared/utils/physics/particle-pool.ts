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
  condition?: (particle: Particle, dt: number, time: number) => boolean;
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

  add(prop: ParticleProperties) {
    this.current++;
    if (this.current === this.particles.length) {
      this.current = 0;
    }

    this.particles[this.current].alive = true;
    this.particles[this.current].x = prop.x;
    this.particles[this.current].y = prop.y;
    this.particles[this.current].z = prop.z;
    this.particles[this.current].vy = prop.vy || 0;
    this.particles[this.current].vz = prop.vz || 0;
    this.particles[this.current].vx = prop.vx || 0;
    this.particles[this.current].size = prop.size || 1;
    this.particles[this.current].life = prop.life || 1;
    this.particles[this.current].mass = prop.mass || 1;
    this.particles[this.current].decay = prop.decay || 10;
    this.particles[this.current].gravity = prop.gravity || -9.82;
    this.particles[this.current].color[0] = prop.r || 1.0;
    this.particles[this.current].color[1] = prop.g || 1.0;
    this.particles[this.current].color[2] = prop.b || 1.0;

    this.particles[this.current].condition = prop.condition || (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      (p, d, t) => { return false }
    );
    this.particles[this.current].action = prop.action || (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      (p, d, t) => {}
    );
    this.particles[this.current].effect = prop.effect || (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      (p, d, t) => {}
    );

    // console.log(prop, this.particles[this.current])
    if (prop.onCreate) { prop.onCreate(this.particles[this.current]); }
  }
}

export { ParticlePool };
