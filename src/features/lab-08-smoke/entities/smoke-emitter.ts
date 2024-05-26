import { vec3 } from 'gl-matrix';
import { ParticlePool } from 'src/shared/utils/physics/particle-pool';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';
import { randsign } from 'src/shared/utils';

const config = {
  size: {
    min: 20,
    max: 120,
  },
  life: {
    min: 0,
    max: 5,
  },
  decay: {
    min: 20,
    max: 60,
  },
  color: [0.2, 0.2, 0.2],
  mass:  0.002,
  x: { min: 5, max: 30, },
  y: { min: 5, max: 30, },
  z: { min: 10, max: 30, },
}

class SmokeEmitter {
  origin: vec3;

  constructor(origin: vec3) {
    this.origin = origin;
  }

  fire(pool: ParticlePool): void {
    for (let i = 0; i < 100; i++) {
      pool.add({
        effect: (particle: Particle, dt: number, time: number) => {
          particle.vz += Math.sin(time * Math.random()) * 0.07;
          particle.vx += Math.sin(time * Math.random()) * 0.07;
        },
        x: this.origin[0] + config.x.min + randsign() *  Math.random() * (config.x.max - config.x.min),
        y: this.origin[1] + config.y.min + randsign() *  Math.random() * (config.y.max - config.y.min),
        z: this.origin[2] + config.z.min + randsign() *  Math.random() *  (config.z.max - config.z.min),
        mass: config.mass,
        gravity: Math.random(),
        size: config.size.min + Math.random() * (config.size.max - config.size.min),
        r: config.color[0],
        g: config.color[1],
        b: config.color[2],
        life: config.life.min + Math.random() * (config.life.max - config.life.min),
        decay: config.decay.min + Math.random() * (config.decay.max - config.decay.min),
      });
    }
  };
}

export {
  SmokeEmitter
}