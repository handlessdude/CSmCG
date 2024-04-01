import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { setupBuffers, setupShaderProgram, setupTransformationMatrices } from 'src/shared/utils/webgl';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/shaders/base/base-shaders';
import { identity } from 'src/shared/resources/identity';
import { glMatrix } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';

const vertices = [
  -1.0, 1.0, 0.0, ...palette.cyan,
  1.0, 1.0, 0.0, ...palette.cyan,
  1.0, -1.0,  0.0, ...palette.cyan,
  -1.0, -1.0,  0.0, ...palette.cyan,
];

const indices = [
  0, 1, 2,
  0, 2, 3,
];

const useQuadScene = (glCanvas: typeof GLCanvas) => {
  const glContext = glCanvas.glContext as WebGL2RenderingContext;

  // compile shaders
  const program = setupShaderProgram(
    glContext,
    vertexShaderSource,
    fragmentShaderSource
  ) as WebGLProgram;

  // setup buffers
  setupBuffers(glContext, program, vertices, indices);

  glContext.useProgram(program);

  setupTransformationMatrices(
    glContext,
    program,
    {
      translation: identity,
      rotation: identity,
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
      glContext.drawElements(glContext.TRIANGLES, indices.length, glContext.UNSIGNED_SHORT, 0);
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
  useQuadScene
}
