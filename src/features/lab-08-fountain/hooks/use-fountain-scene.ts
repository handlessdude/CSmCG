import { palette } from 'src/shared/resources/palette';
import { glMatrix, mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { useParticleRenderer } from 'src/shared/hooks/particles/use-particle-renderer';
import { useParticleManager } from 'src/shared/hooks/particles/use-particle-manager';
import { FountainEmitter } from 'src/features/lab-08-fountain/entities/fountain-emitter';

const sceneConfig = {
  clearColor: palette.purple as [number, number , number]
}

const useFountainScene = async (
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

  const smokeOrigin = vec3.fromValues(0.0, 0.0, 0.0);
  const smokeEmitter = new FountainEmitter(smokeOrigin);
  const { init, update, data } = useParticleManager({
    particlesCount: 25000,
    emitter: smokeEmitter,
    spawnFramespan: 1
  });

  const loop = () => {
    update();

    glContext.enable(glContext.BLEND);
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);

    glContext.clearColor(...sceneConfig.clearColor, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    drawParticles(data.positions, data.colors, data.sizes);

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    init();
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
  }
}

export{
  useFountainScene
}
