import { vec3 } from 'gl-matrix';
import { ParticlePool } from 'src/features/lab-08-fireworks/entities/particle-pool';
import { Color } from 'src/shared/resources/palette';
import { World } from 'src/features/lab-08-fireworks/entities/world';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';

class Fireworks {
  maxSize = 10;

  constructor(readonly world: World) {}

  mortarEffect(pos: vec3, pp: ParticlePool): void {
    for (let i = 0; i < 100; i++) {
      pp.New({
        effect: function(particle, dt, time) {
          particle.vz += Math.sin(time * Math.random()) / 50;
          particle.vx += Math.sin(time * Math.random()) / 50;
        },
        x: pos[0] + 10 - Math.random() * 20,
        y: pos[1] + 30 + Math.random() * 5,
        z: pos[2] + 10 - Math.random() * 20,
        mass: 0.002,
        gravity: Math.random(),
        size: 20 + Math.random() * 100,
        r: 0.2,
        g: 0.2,
        b: 0.2,
        life: Math.random() * 5,
        decay: 20 + Math.random() * 20,
      });
    }
  };

  shellEffect(particle: Particle, dt: number, time: number, seed: number, pp: ParticlePool) {
    let max = 1;
    let vx = 0;
    let vz = 0;
    switch (seed) {
      case 1:
        max = Math.random() * 30;
        break;
      case 2:
        particle.x += Math.cos(Math.PI * 2 * time) * Math.random() * 3;
        particle.z += Math.sin(Math.PI * 2 * time) * Math.random() * 3;
        break;
      case 3:
        if (Math.random() > 0.5) {
          particle.size = 150;
        } else {
          particle.size = 10;
        }
        max = Math.random() * 10;
        vx = 2 - Math.random() * 4;
        vz = 2 - Math.random() * 4;
        break;
    }
    for (let i = 0; i < max; i++) {
      pp.New({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        mass: 0.002,
        gravity: -0.2,
        size: 20 + Math.random() * 40,
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

  crackleEffect(particle: Particle, dt: number, time: number, seed: number, color: Color, pp: ParticlePool) {
    let r = 0;
    let g = 0;
    let b = 0;
    switch (seed) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        r = color[0] * 2;
        g = color[1] * 2;
        b = color[2];
        break;
    }
    for (let i = 0; i < 10 + Math.random() * 150; i++) {
      const size = Math.random() * 80;
      const gravity = -0.2;
      const vy = 1 - Math.random() * 2;
      const vx = 1 - Math.random() * 2;
      const vz = 1 - Math.random() * 2;
      const life = 0.1 + Math.random() * 2;
      if (Math.random() > 0.5 && seed === 2) {
        r = color[0];
        g = color[1];
        b = color[2];
      }
      pp.New({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        size: size,
        mass: 0.02,
        gravity: gravity,
        r: r,
        g: g,
        b: b,
        vy: vy,
        vx: vx,
        vz: vz,
        life: life,
        decay: Math.random() * 50,
      });
    }
  };

  explodeEffect(particle: Particle, dt: number, time: number, seed: number, pp: ParticlePool) {
    for (let i = 0; i < 100 + Math.random() * 200; i++) {
      const size = Math.random() * 80;
      const gravity = -0.5;
      const vy = 1 - Math.random() * 2;
      const vx = 1 - Math.random() * 2;
      const vz = 1 - Math.random() * 2;
      const life = 0.1 + Math.random();
      pp.New({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        size: size,
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

  flairEffect(particle: Particle, dt: number, time: number, seed: number, color: Color, size: number, pp: ParticlePool) {
    let r = 1.0;
    let g = 0;
    let b = 0;
    switch (seed) {
      case 1:
        if (Math.random() > 0.5) {
          particle.size = 250;
        } else {
          particle.size = 10;
        }
        break;
      case 2:
        if (particle.vy < 0) {
          particle.x += Math.cos(Math.PI * 2 * time) * Math.random() * 3;
          particle.z += Math.sin(Math.PI * 2 * time) * Math.random() * 3;
        }
        break;
      case 3:
        if (Math.random() > 0.5) {
          particle.size = 150;
        } else {
          particle.size = 10;
        }
        if (Math.random() > 0.5) {
          r = color[0];
          g = color[1];
          b = color[2];
        }
        break;
    }

    if (size > 250 && particle.life < 1.0) {
      if (Math.random() < 0.05) {
        this.crackleEffect(particle, dt, time, seed, color, pp);
        particle.Reset();
      }
    }

    pp.New({
      x: particle.x,
      y: particle.y,
      z: particle.z,
      mass: 0.002,
      gravity: -0.2,
      size: 20 + Math.random() * 40,
      r: r,
      g: g,
      b: b,
      life: Math.random() * 3,
      decay: 50,
    });
  };

  fire(pp: ParticlePool): void {
    const pos = this.world.getLaunchPosition();
    // this.mortarEffect(pos, pp);

    const seed = Math.random() * 4 | 0;
    const color: Color = [Math.random(), Math.random(), Math.random()];

    const size = 20 + Math.random() * Math.min(350, this.maxSize);
    this.maxSize += 10;

    pp.New({
      effect: (particle, dt, time) => {
        this.shellEffect(particle, dt, time, seed, pp);
      },
      x: pos[0],
      y: pos[1],
      z: pos[2],
      size: size,
      mass: 0.5,
      vz: 0,
      vx: 0,
      vy: 10 + Math.min(size / 30, 7),
      r: color[0],
      g: color[1],
      b: color[2],
      life: 20,
      decay: 10 + Math.random() * 20,
      condition: (particle, dt, time) => {
        return particle.vy <= -Math.random() * 20;
      },
      action: (particle, dt, time) => {
        this.explodeEffect(particle, dt, time, seed, pp);

        const grav = -0.1 - Math.random() * 2;

        const maxLife = 1 + Math.random() * 6;

        // const radius = 50 + Math.random() * 50;
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

          pp.New({
            effect: (particle, dt, time) => {
              this.flairEffect(particle, dt, time, seed, color, size, pp);
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
            r: color[0],
            g: color[1],
            b: color[2],
            life: 0.5 + Math.random() * maxLife,
            decay: Math.random() * 100,
          });
        }
      },
    });
  };
}

export { Fireworks };
