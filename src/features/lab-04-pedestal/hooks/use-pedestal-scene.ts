import { Timer } from 'src/shared/utils/webgl/timer';
import { RotationAngle } from 'src/features/lab-04-pedestal/utils/controls/rotation-angle';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { ReadonlyVec3 } from 'gl-matrix';

const usePedestalScene = (
  shaderProgram: BaseShaderProgram,
) => {
  if (!shaderProgram.program) {
    throw new Error('Shader program not found')
  }
  const timer = new Timer();
  const angle = new RotationAngle(() => timer.delta);

  const cubeCenters: Array<ReadonlyVec3> = [
    [-3, 0, 0], [0, 0, 0], [3, 0, 0], [0, 3, 0],
  ];
  const cubes = cubeCenters.map((center) => {
    const cube =  new CubeMesh(center);
    cube.setupBuffers(
      shaderProgram.program as WebGLProgram,
      shaderProgram.glContext
    );
    return cube;
  })

  const drawCube = (mesh: CubeMesh) => {
    shaderProgram.setWorldMat(mesh.worldMat);
    mesh.draw(shaderProgram.glContext);
  }

  const loop = () => {
    timer.updateDelta();

    shaderProgram.glContext.clearColor(1.0, 1.0, 1.0, 1.0);
    shaderProgram.glContext.clear(
      shaderProgram.glContext.DEPTH_BUFFER_BIT | shaderProgram.glContext.COLOR_BUFFER_BIT
    );

    cubes.forEach((cube) => {
      cube.setRotateY(angle.value);
      drawCube(cube)
    })

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
    decAngle: angle.decAngle,
    incAngle: angle.incAngle,
  }
}
export { usePedestalScene }
