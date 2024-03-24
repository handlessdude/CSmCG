import { Timer } from 'src/shared/utils/webgl/timer';
import { RotationAngle } from 'src/features/lab-04-pedestal/utils/controls/rotation-angle';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';

const usePedestalScene = (
  shaderProgram: BaseShaderProgram,
) => {
  if (!shaderProgram.program) {
    throw new Error('Shader program not found')
  }
  const timer = new Timer();
  const angle = new RotationAngle(() => timer.delta);
  const cube = new CubeMesh();
  cube.setupBuffers(shaderProgram.program, shaderProgram.glContext);

  const loop = () => {
    timer.updateDelta();
    cube.setRotateY(angle.value);

    shaderProgram.setWorldMat(cube.rotateY);

    shaderProgram.glContext.clearColor(1.0, 1.0, 1.0, 1.0);
    shaderProgram.glContext.clear(
      shaderProgram.glContext.DEPTH_BUFFER_BIT | shaderProgram.glContext.COLOR_BUFFER_BIT
    );

    cube.draw(shaderProgram.glContext);

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
