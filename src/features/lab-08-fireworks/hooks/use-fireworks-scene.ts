import { Timer } from 'src/shared/utils/webgl/timer';
import { glMatrix, mat4, ReadonlyVec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { useParticleRenderer } from 'src/shared/hooks/particles/use-particle-renderer';
import { useParticleManager } from 'src/shared/hooks/particles/use-particle-manager';
import { FireworkEmitter } from 'src/features/lab-08-fireworks/entities/firework-emitter';

const sceneConfig = {
  clearColor: palette.darkBlue as [number, number , number]
}

const useFireworksScene = async (
  glContext: WebGL2RenderingContext,
  camera: {
    position: ReadonlyVec3,
    lookAt: ReadonlyVec3,
    aspect: number,
  },
) => {
  const {
    viewMatrix,
    projMatrix
  } = setupCamera({
      eye: camera.position,
      center: camera.lookAt,
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: camera.aspect,
      nearPlane: 0.1,
      farPlane: 5000.0,
    }
  )

  const timer = new Timer();

  const worldMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);

  const {
    drawParticles
  } = await useParticleRenderer(glContext, {
    worldMatrix,
    viewMatrix,
    projMatrix,
    particleTextureSrc: '/src/assets/textures/spark.png',
  });

  const {
    init,
    update,
    data,
  } = useParticleManager({
    particlesCount: 50000,
    emitter: new FireworkEmitter(),
    spawnFramespan: 10
  });

  const loop = () => {
    timer.updateDelta();

    update();

    glContext.enable(glContext.BLEND);
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);

    glContext.clearColor(...sceneConfig.clearColor, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    drawParticles(data.positions, data.colors, data.sizes);

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();
    init();
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
  }
}
export { useFireworksScene }
