import { Timer } from 'src/shared/utils/webgl/timer';
import { glMatrix, mat4, ReadonlyVec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { Spark } from 'src/features/lab-08-fireworks/entities/spark';
import { useSparksRenderer } from 'src/features/lab-08-fireworks/utils/bengal-sparkler/sparkle-renderer';
import { getSparksPositions, moveSparks } from 'src/features/lab-08-fireworks/utils/bengal-sparkler/system-manager';
import { useTrackRenderer } from 'src/features/lab-08-fireworks/utils/bengal-sparkler/track-renderer';

const useParticleSystemsScene = async (
  glContext: WebGL2RenderingContext,
  camera: {
    position: ReadonlyVec3,
    aspect: number,
  },
) => {
  const {
    viewMatrix,
    projMatrix
  } = setupCamera({
      eye: camera.position,
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: camera.aspect,
      nearPlane: 0.1,
      farPlane: 1000.0,
    }
  )

  const timer = new Timer();

  const worldMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);

  const { drawSparks } = await useSparksRenderer(glContext, {
    worldMatrix,
    viewMatrix,
    projMatrix,
    particleTextureSrc: '/src/assets/textures/clown-emoji.png',
  });

  const { drawTracks } = useTrackRenderer(glContext, {
    worldMatrix,
    viewMatrix,
    projMatrix,
  });

  const sparks: Spark[] = [];
  for (let i = 0; i < Spark.sparksCount; i++) {
    sparks.push(new Spark());
  }

  const loop = () => {
    timer.updateDelta();

    glContext.clearColor(
      ...(palette.darkBlue as [number, number, number]),
      1.0
    );
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);

    moveSparks(sparks);
    const sparksPositions = getSparksPositions(sparks);
    drawSparks(sparksPositions);
    drawTracks(sparksPositions);

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();

    glContext.enable(glContext.BLEND);
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE);
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
  }
}
export { useParticleSystemsScene }
