import { vec3 } from 'gl-matrix';
import { ParticlePool } from 'src/shared/utils/physics/particle-pool';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';
import { Color } from 'src/shared/resources/palette';

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
  x: { min: 5, max: 30, },
  y: { min: 5, max: 30, },
  z: { min: 10, max: 30, },
  dropSize: 25,
}

class FountainEmitter {
  maxSize = 10;
  origin: vec3;

  constructor(origin: vec3) {
    this.origin = origin;
  }

  shellEffect(particle: Particle, dt: number, time: number, seed: number, pool: ParticlePool) {
    let max = 1;
    let vx = 0;
    let vz = 0;
    switch (seed) {
      case 1:
        max = Math.random() * 30;
        break;
    /*  case 2:
        particle.x += Math.cos(Math.PI * 2 * time) * Math.random() * 3;
        particle.z += Math.sin(Math.PI * 2 * time) * Math.random() * 3;
        break;*/
      case 3:
        max = Math.random() * 10;
        vx = 2 - Math.random() * 4;
        vz = 2 - Math.random() * 4;
        break;
    }
    for (let i = 0; i < max; i++) {
      pool.add({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        mass: 0.002,
        gravity: -0.2,
        size: config.dropSize,
        vx: vx,
        vz: vz,
        r: 1.0,
        g: 0,
        b: 0,
        life: Math.random() * 3,
        decay: 50,
      });
    }
  };

  explodeEffect(particle: Particle, dt: number, time: number, seed: number, pool: ParticlePool) {
    for (let i = 0; i < 100 + Math.random() * 200; i++) {
      const gravity = -0.5;
      const vy = 1 - Math.random() * 2;
      const vx = 1 - Math.random() * 2;
      const vz = 1 - Math.random() * 2;
      const life = 0.1 + Math.random();
      pool.add({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        size: config.dropSize,
        mass: 0.5,
        gravity: gravity,
        vy: vy,
        vx: vx,
        vz: vz,
        life: life,
        decay: Math.random() * 50,
      });
    }
  };

  flairEffect(
    particle: Particle,
    dt: number,
    time: number,
    seed: number,
    color: Color,
    size: number,
    pool: ParticlePool
  ) {
    if (size > 250 && particle.life < 1.0) {
      if (Math.random() < 0.05) {
        particle.reset();
      }
    }
    pool.add({
      x: particle.x,
      y: particle.y,
      z: particle.z,
      mass: 0.002,
      gravity: -0.2,
      size: config.dropSize,
      r: particle.color[0],
      g: particle.color[1],
      b: particle.color[2],
      life: Math.random() * 3,
      decay: 50,
    });
  };

  fire(pool: ParticlePool) {

    const seed = Math.random() * 4 | 0;
    // const size = 20 + Math.random() * Math.min(350, this.maxSize);
    this.maxSize += 10;

    pool.add({
      effect: (particle: Particle, dt: number, time: number) => {
        this.shellEffect(particle, dt, time, seed, pool);
      },
      x: this.origin[0],
      y: this.origin[1],
      z: this.origin[2],
      size: config.dropSize,
      mass: 0.5,
      vz: 0,
      vx: 0,
      vy: 10 + Math.min(config.dropSize / 30, 7),
      r: config.color[0],
      g: config.color[1],
      b: config.color[2],
      life: 20,
      decay: 10 + Math.random() * 20,
      condition: (particle: Particle, dt: number, time: number) => {
        return particle.vy <= -Math.random();
      },
      action: (particle: Particle, dt: number, time: number) => {
        this.explodeEffect(particle, dt, time, seed, pool);
        const grav = -0.1 - Math.random() * 2;
        const speed = 2 + Math.random() * 2;
        const offset = 2 / config.dropSize;
        const inc = Math.PI * (3.0 - Math.sqrt(5.0));
        for (let i = 0; i < config.dropSize; i++) {
          let vx: number, vy: number, vz: number;
          switch (seed) {
            case 1:
              vy = Math.abs(((i * offset) - 1) + (offset / 2));
              const r1 = Math.sqrt(1 - Math.pow(vy, 2));
              const phi1 = ((i + 1.0) % config.dropSize) * inc;
              vx = Math.cos(phi1) * r1;
              vz = Math.sin(phi1) * r1;
              vx *= speed;
              vy *= speed;
              vz *= speed;
              break;
            case 2:
              vy = 1 + Math.random() * 2;
              vx = Math.sin(i * Math.PI * 2 * speed) * (2 - Math.random() * 4);
              vz = Math.sin(i * Math.PI * 2 * speed) * (2 - Math.random() * 4);
              break;
            default:
              vy = ((i * offset) - 1) + (offset / 2);
              const r2 = Math.sqrt(1 - Math.pow(vy, 2));
              const phi2 = ((i + 1.0) % config.dropSize) * inc;
              vx = Math.cos(phi2) * r2;
              vz = Math.sin(phi2) * r2;
              vx *= speed;
              vy *= speed;
              vz *= speed;
              break;
          }
          pool.add({
            effect: (particle: Particle, dt: number, time: number) => {
              this.flairEffect(particle, dt, time, seed, config.color, config.dropSize, pool);
            },
            x: particle.x,
            y: particle.y,
            z: particle.z,
            size: config.dropSize,
            mass: 0.001,
            gravity: grav,
            vy: vy,
            vz: vz,
            vx: vx,
            r: config.color[0],
            g: config.color[1],
            b: config.color[2],
            life: config.life.min + Math.random() * (config.life.max - config.life.min),
            decay: Math.random() * 100,
          });
        }
      },
    });
  };
}

export {
  FountainEmitter
}
