import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { setupBuffers, setupShaderProgram, setupTransformationMatrices } from 'src/utils/webgl';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { identity } from 'src/shared/resources/identity';
import { blue, green, red } from 'src/shared/resources/colors';
import { glMatrix } from 'gl-matrix';

const vertices = [
  0.0,   1.0, 0.0, ...green,
  1.0,  -1.0, 0.0, ...red,
  -1.0, -1.0, 0.0, ...blue,
]

const indices = [
  0, 1, 2
]

const useTriangleScene = (
  glCanvas: typeof GLCanvas
) => {
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
  };

  return {
    runScene
  }
};

export {
  useTriangleScene
}
