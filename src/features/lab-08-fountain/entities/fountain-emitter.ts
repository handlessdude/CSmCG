import { vec3 } from 'gl-matrix';
import { ParticlePool } from 'src/shared/utils/physics/particle-pool';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';

interface IColor {
  r: number;
  g: number;
  b: number;
}

const config = {
  size: {
    min: 5,
    max: 16,
  },
  life: {
    min: 10,
    max: 50,
  },
  decay: {
    min: 20,
    max: 60,
  },
  color: {
    r: 1,
    g: 1,
    b: 1,
  },
  mass:  0.002,
  x: { min: 5, max: 20, },
  y: { min: 5, max: 20, },
  z: { min: 5, max: 20, },
}

interface Interval {
  min: number;
  max: number;
}

const getInInterval = (int: Interval) => int.min = Math.random() * (int.max - int.min);

const randSize = () => getInInterval(config.size);

const randLife = () => getInInterval(config.life);

const randDecay = () => getInInterval(config.decay);

class FountainEmitter {
  maxSize = 10;
  origin= vec3.fromValues(0,0,0);

  shellEffect(particle: Particle, dt: number, time: number, seed: number, pool: ParticlePool) {
    let shellParticlesCount = 1;
    let vx = 0;
    let vz = 0;
    switch (seed) {
      case 1:
        shellParticlesCount = Math.random() * 30;
        break;
      case 3:
        particle.size = randSize();
        shellParticlesCount = Math.random() * 10;
        vx = 2 - Math.random() * 4;
        vz = 2 - Math.random() * 4;
        break;
    }
    for (let i = 0; i < shellParticlesCount; i++) {
      pool.add({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        mass: 0.002,
        gravity: -0.2,
        size: randSize(),
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
        size: randSize(),
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

  flairEffect(particle: Particle, dt: number, time: number, seed: number, color: IColor, size: number, pool: ParticlePool) {
    if (Math.random() > 0.5) {
      particle.size = particle.size * 0.5;
    }
    if (Math.random() > 0.25) {
      particle.size = particle.size * 0.5
    }
    if (size > 5 && particle.life < 1.0) {
      if (Math.random() < 0.5) {
        particle.reset();
      }
    }
    pool.add({
      x: particle.x,
      y: particle.y,
      z: particle.z,
      mass: 0.002,
      gravity: -0.2,
      size: randSize(),
      ...color,
      life: Math.random() * 3,
      decay: 50,
    });
  };

  fire(pool: ParticlePool) {
    const seed = Math.random() * 4 | 0;
    const size = 20 + Math.random() * Math.min(5, this.maxSize);
    this.maxSize += 10;
    pool.add({
      effect: (particle: Particle, dt: number, time: number) => {
        this.shellEffect(particle, dt, time, seed, pool);
        this.explodeEffect(particle, dt, time, seed, pool);
        this.flairEffect(particle, dt, time, seed, config.color, particle.size, pool);
        const grav = -0.1 - Math.random() * 2;
        const maxLife = 1 + Math.random() * 6;
        const speed = 2 + Math.random() * 2;
        const offset = 2 / size;
        const inc = Math.PI * (3.0 - Math.sqrt(5.0));

        for (let i = 0; i < size; i++) {
          let vx: number, vy: number, vz: number;
          switch (seed) {
            case 1:
              vy = Math.abs(((i * offset) - 1) + (offset / 2));
              const r1 = Math.sqrt(1 - Math.pow(vy, 2));
              const phi1 = ((i + 1.0) % size) * inc;
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
              const phi2 = ((i + 1.0) % size) * inc;
              vx = Math.cos(phi2) * r2;
              vz = Math.sin(phi2) * r2;
              vx *= speed;
              vy *= speed;
              vz *= speed;
              break;
          }
          pool.add({
            effect: (particle: Particle, dt: number, time: number) => {
              this.flairEffect(particle, dt, time, seed, config.color, size, pool);
            },
            x: particle.x,
            y: particle.y,
            z: particle.z,
            size: size,
            mass: 0.001,
            gravity: grav,
            vy: vy,
            vz: vz,
            vx: vx,
            ...config.color,
            life: 0.5 + Math.random() * maxLife,
            decay: Math.random() * 100,
          });
        }
      },
      x: this.origin[0],
      y: this.origin[1],
      z: this.origin[2],
      size: size,
      mass: 1,
      vz: 0,
      vx: 0,
      vy: 10 + Math.min(size * 0.1, 7),
      ...config.color,
      life: 20,
      decay: randDecay()
    });
  };
}

export {
  FountainEmitter
}
