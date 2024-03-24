import { Timer } from 'src/shared/utils/webgl/timer';
import { RotationAngle } from 'src/features/lab-04-pedestal/utils/controls/rotation-angle';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';

const usePedestalScene = (
  program: WebGLProgram,
  glContext: WebGL2RenderingContext,
  worldMatrix: Float32Array,
  matWorldUniformLocation: WebGLUniformLocation
) => {
  const timer = new Timer();
  const angle = new RotationAngle(() => timer.delta);

  const cube = new CubeMesh();
  cube.setupBuffers(program, glContext);

  const loop = () => {
    timer.updateDelta();
    cube.setRotateY(angle.value);
    glContext.uniformMatrix4fv(matWorldUniformLocation, false, cube.rotateY);

    glContext.clearColor(1.0, 1.0, 1.0, 1.0);
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);

    cube.draw(glContext);

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
