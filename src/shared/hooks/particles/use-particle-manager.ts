import { Particle } from 'src/features/lab-08-fireworks/entities/particle';
import * as THREE from 'src/../libs/three.module';
import { ParticlePool } from 'src/shared/utils/physics/particle-pool';

interface ParticleEmitter {
  fire: (pool: ParticlePool) => void
}

interface ParticleManagerProps {
  particlesCount: number;
  emitter: ParticleEmitter;
  spawnFramespan: number;
}

export type { ParticleManagerProps }

const useParticleManager = ({
  particlesCount, emitter, spawnFramespan
                            }: ParticleManagerProps) => {
  const pool = new ParticlePool();
  const MAX_FPS = 60;
  const clock = new THREE.Clock();
  let frameDelta = 0;
  let spawnCounter = 0;

  const data: {
    positions:number[];
    colors: number[];
    sizes: number[];
  } = {
    positions: [],
    colors: [],
    sizes: [],
  };

  const spawnParticles = () => {
    emitter.fire(pool);
  }

  const init = () =>  {
    for (let i = 0; i < particlesCount; i ++ ) {
      const p = new Particle(i);
      pool.particles.push(p);
      data.positions.push(0,0,0);
      data.colors.push(0,0,0);
      data.sizes.push(0);
    }
  }

  const update = () => {
    const time = Date.now() * 0.001;
    const delta = clock.getDelta();
    frameDelta += delta;

    if (spawnFramespan) {
      spawnCounter += 1;
      if (spawnCounter > spawnFramespan) {
        spawnParticles();
        spawnCounter = 0;
      }
    }

    while(frameDelta >= 1 / MAX_FPS) {
      for ( let i = 0; i < particlesCount * 3; i +=3 ) {
        const pos = i/3 | 0;
        if (!pool.particles[pos].alive) { continue; }

        pool.particles[pos].update(frameDelta, time);

        data.positions[i] = pool.particles[pos].x;
        data.positions[i+1] = pool.particles[pos].y;
        data.positions[i+2] = pool.particles[pos].z;

        data.sizes[pos] = pool.particles[pos].size;

        data.colors[i] = pool.particles[pos].color[0];
        data.colors[i+1] = pool.particles[pos].color[1];
        data.colors[i+2] = pool.particles[pos].color[2];
      }
      frameDelta -= 1 / MAX_FPS;
    }
  }

  return {
    init, update, data, spawnParticles
  }
}

export {
  useParticleManager
}
