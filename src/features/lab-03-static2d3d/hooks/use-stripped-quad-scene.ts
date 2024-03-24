import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { setupBuffers, setupShaderProgram, setupTransformationMatrices } from 'src/shared/utils/webgl';
import { identity } from 'src/shared/resources/identity';
import { glMatrix } from 'gl-matrix';
import { cyan } from 'src/shared/resources/colors';

const vertices = [
  -1.0, 1.0, 0.0, ...cyan,
  1.0, 1.0, 0.0, ...cyan,
  1.0, -1.0,  0.0, ...cyan,
  -1.0, -1.0,  0.0, ...cyan,
];

const indices = [
  0, 1, 2,
  0, 2, 3,
];

const vertexShaderSource = `#version 300 es
in vec3 vertPosition;
in vec3 vertColor;

out vec3 vColor;
out vec3 vPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  vColor = vertColor;
  vPosition = vertPosition;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 vColor;
in vec3 vPosition;

out vec4 fragColor;

void main() {
  float stripeWidth = 0.2;
  float xCoord = abs(fract(vPosition.x / stripeWidth));

  // if (xCoord > 0.5) {
  //   fragColor = vec4(vColor, 1.0);
  // } else {
  //   fragColor = vec4(1.0);
  // }

  float isInsideStripe = step(xCoord, 0.5); // === 1 if inside stripe, 0 otherwise

  // Blend between vColor and white based on whether the fragment is inside a stripe
  fragColor = mix(
    vec4(vColor, 1.0),
    vec4(1.0),
    isInsideStripe
  );
}
`
const useStrippedQuadScene = (glCanvas: typeof GLCanvas) => {
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
  useStrippedQuadScene
}
