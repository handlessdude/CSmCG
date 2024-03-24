import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { setupBuffers, setupShaderProgram, setupTransformationMatrices } from 'src/shared/utils/webgl';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { identity } from 'src/shared/resources/identity';
import { glMatrix, mat4 } from 'gl-matrix';
import { boxIndices, boxVertices } from 'src/shared/resources/box-model';


const useCubeScene = (glCanvas: typeof GLCanvas) => {
  const glContext = glCanvas.glContext as WebGL2RenderingContext;

  // compile shaders
  const program = setupShaderProgram(
    glContext,
    vertexShaderSource,
    fragmentShaderSource
  ) as WebGLProgram;

  // setup buffers
  setupBuffers(glContext, program, boxVertices, boxIndices);

  glContext.useProgram(program);

  const zRotationMatrix = new Float32Array(16);
  mat4.rotate(zRotationMatrix, identity,  Math.PI / 6, [0, 0, 1]);

  const yRotationMatrix = new Float32Array(16);
  mat4.rotate(yRotationMatrix, identity, Math.PI / 4, [0, 1, 0]);

  const rotationMatrix = new Float32Array(16);
  mat4.mul(rotationMatrix, yRotationMatrix, zRotationMatrix);

  setupTransformationMatrices(
    glContext,
    program,
    {
      translation: identity,
      rotation: rotationMatrix,
      scale: identity,
    },
    {
      eye: [0, 0, -8],
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: glCanvas.width / glCanvas.height,
      nearPlane: 0.1,
      farPlane: 100.0,
    },
  )

  const drawScene = () => {
    glContext.clearColor(0, 0, 0, 1.0);
    glContext.clear(glContext.DEPTH_BUFFER_BIT | glContext.COLOR_BUFFER_BIT);
    glContext.drawElements(glContext.TRIANGLES, boxIndices.length, glContext.UNSIGNED_SHORT, 0);
  };

  const runScene = () => {
    drawScene()
    requestAnimationFrame(runScene);
  }

  // end
  return {
    runScene
  }
};

export {
  useCubeScene
}
