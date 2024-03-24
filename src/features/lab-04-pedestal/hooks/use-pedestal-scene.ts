import { mat4 } from 'gl-matrix';
import { boxIndices, boxVertices } from 'src/shared/resources/box-model';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { Mesh } from 'src/shared/entities/mesh';

class RotationAngle {
  #angle = 0;
  readonly #step: number; // todo: make editable in the future

  constructor(
    private readonly deltaTime: () => number,
    readonly stepFrac: number = 0.001, // 2*pi fraction
  ) {
    this.#step = 2 * Math.PI * stepFrac;
  }

  get value () {
    return this.#angle
  }

  decAngle = () => {
    this.#angle += -this.#step * this.deltaTime();
    if (this.#angle < 0) this.#angle = 2 * Math.PI + this.#angle;
  }

  incAngle = () => {
    this.#angle += this.#step * this.deltaTime();
    if (this.#angle > 2 * Math.PI) this.#angle = 0;
  }
}

class Timer {
  #prevTick = 0;
  #delta = 0;

  get delta () {
    return this.#delta
  }

  init = () => {
    this.#prevTick = performance.now();
  }

  updateDelta = () => {
    const curTick = performance.now();
    this.#delta = curTick - this.#prevTick;
    this.#prevTick = curTick;
  }
}

const usePedestalScene = (
  program: WebGLProgram,
  glContext: WebGL2RenderingContext,
  worldMatrix: Float32Array,
  matWorldUniformLocation: WebGLUniformLocation
) => {
  const timer = new Timer();
  const angle = new RotationAngle(() => timer.delta);

  const identityMatrix = makeIdentity4x4();

  const cube = new Mesh(boxVertices, boxIndices);
  cube.setupBuffers(program, glContext);

  const loop = () => {
    timer.updateDelta();
    mat4.rotate(worldMatrix, identityMatrix, angle.value, [0, 1, 0]);
    glContext.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

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
