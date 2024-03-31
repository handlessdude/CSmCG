import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { setupShaderProgram, setupTransformationMatrices } from 'src/shared/utils/webgl';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { identity } from 'src/shared/resources/identity';
import { palette } from 'src/shared/resources/palette';
import { glMatrix } from 'gl-matrix';
import { generateRegularPolygon } from 'src/features/lab-02-static2d/utils/get-regular-pentagon';

const center = {
  x: 0.0,
  y: 0.0,
}

const coordinates = generateRegularPolygon(5, center, 1);

const vertices = [
  center.x, center.y, 0.0, ...palette.red,
  ...coordinates.map((point) => [point.x, point.y, 0.0, ...palette.red]),
  coordinates[0].x, coordinates[0].y, 0.0, ...palette.red,
].flat()

const usePentagonScene = (
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
  const boxVertexBufferObject = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, boxVertexBufferObject);
  glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
  const positionAttribLocation = glContext.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = glContext.getAttribLocation(program, 'vertColor');

  glContext.vertexAttribPointer(
    positionAttribLocation,
    3,
    glContext.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  glContext.vertexAttribPointer(
    colorAttribLocation,
    3,
    glContext.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );
  glContext.enableVertexAttribArray(positionAttribLocation);
  glContext.enableVertexAttribArray(colorAttribLocation);

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
    glContext.drawArrays(glContext.TRIANGLE_FAN, 0, vertices.length / 6);
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
  usePentagonScene
}
