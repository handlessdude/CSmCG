import { vec3 } from 'gl-matrix';
import { ParticlePool } from 'src/shared/utils/physics/particle-pool';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';
import { Color } from 'src/shared/resources/palette';
import { randsign } from 'src/shared/utils';

const config = {
  size: {
    min: 20,
    max: 120,
  },
  life: {
    min: 10,
    max: 50,
  },
  decay: {
    min: 20,
    max: 60,
  },
  color: [0.0, 1.0, 1.0] as Color,
  mass:  0.002,
  x: { min: 5, max: 20, },
  y: { min: 5, max: 20, },
  z: { min: 5, max: 20, },
}

class FireEmitter {
  maxSize = 10;
  origin: vec3;

  constructor(origin: vec3) {
    this.origin = origin;
  }

  fire(pool: ParticlePool): void {
    for (let i = 0; i < 100; i++) {
      pool.add({
        effect: function(particle, dt, time) {
          particle.vz += Math.sin(time*Math.random()) * 0.02;
          particle.vx += Math.sin(time*Math.random()) * 0.02;
        },
        x: this.origin[0] + config.x.min + randsign() * Math.random() * (config.x.max - config.x.min),
        y: this.origin[1] + config.y.min + randsign() * Math.random() * (config.y.max - config.y.min),
        z: this.origin[2] + config.z.min + randsign() * Math.random() *  (config.z.max - config.z.min),
        mass: 0.002,
        gravity: Math.random(),
        size: 20 + Math.random() * 100,
        r: 1,
        g: 1,
        b: 1,
        life: Math.random() * 5,
        decay: 20 + Math.random() * 20,
      });
    }
  };
}

export {
  FireEmitter
}
