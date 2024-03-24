import { mat4 } from 'gl-matrix';
import { boxIndices } from 'src/shared/resources/box-model';
import { identity } from 'src/shared/resources/identity';


const useCubeRotationLoop = (
  glContext: WebGL2RenderingContext,
  worldMatrix: Float32Array,
  matWorldUniformLocation: WebGLUniformLocation
) => {

  const xRotationMatrix = new Float32Array(16);
  const yRotationMatrix = new Float32Array(16);

  let angle= 0;

  const loop = () => {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    mat4.rotate(yRotationMatrix, identity, angle, [0, 1, 0]);
    mat4.rotate(xRotationMatrix, identity, angle / 4, [1, 0, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
    glContext.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

    glContext.clearColor(2.55, 2.55, 2.55, 1.0);
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);

    glContext.drawElements(glContext.TRIANGLES, boxIndices.length, glContext.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };

  const runCubeRotationLoop = () => {
    requestAnimationFrame(loop);
  }

  return {
    runCubeRotationLoop
  }
}
export { useCubeRotationLoop }
