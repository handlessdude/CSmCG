import { ParticlePool } from 'src/features/lab-08-fireworks/entities/particle-pool';
import { Particle } from 'src/features/lab-08-fireworks/entities/particle';
import { Fireworks } from 'src/features/lab-08-fireworks/entities/fireworks';
import { World } from 'src/features/lab-08-fireworks/entities/world';
import * as THREE from 'src/../libs/three.module';

const useFireworksManager = () => {
  const particles = 50000;
  const pp = new ParticlePool();
  const world = new World();
  const ff = new Fireworks(world);
  const invMaxFps = 1/60;
  const clock = new THREE.Clock();

  const data: {
    positions:number[];
    colors: number[];
    sizes: number[];
  } = {
    positions: [],
    colors: [],
    sizes: [],
  };

  const needsUpdate = {
    positions: false,
    colors: false,
    sizes: false
  }

  const init = () =>  {
    for (let i = 0; i < particles; i ++ ) {
      const p = new Particle();
      p.Init(i);
      pp.particles.push(p);
      data.positions.push(0,0,0);
      data.colors.push(0,0,0);
      data.sizes.push(0);
    }
  }

  let frameDelta = 0;
  let shoot = 0;
  const update = () => {
    const time = Date.now() * 0.005;
    const delta = clock.getDelta();
    frameDelta += delta;

    shoot += delta;
    if (shoot > 0.5) {
      ff.fire(pp);
      shoot = 0;
    }

    while(frameDelta >= invMaxFps) {
      for ( let i = 0; i < particles * 3; i +=3 ) {
        const pos = i/3 | 0;
        if (!pp.particles[pos].alive) { continue; }

        pp.particles[pos].Update(frameDelta, time);

        data.positions[i] = pp.particles[pos].x;
        data.positions[i+1] = pp.particles[pos].y;
        data.positions[i+2] = pp.particles[pos].z;

        data.sizes[pos] = pp.particles[pos].size;

        data.colors[i] = pp.particles[pos].color[0];
        data.colors[i+1] = pp.particles[pos].color[1];
        data.colors[i+2] = pp.particles[pos].color[2];
      }
      needsUpdate.positions = true;
      needsUpdate.colors = true;
      needsUpdate.sizes = true;

      frameDelta -= invMaxFps;
    }
  }

  return {
    init, update, data, needsUpdate
  }
}

export {
  useFireworksManager
}
