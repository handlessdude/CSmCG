import { setupBuffers } from 'src/shared/utils/webgl';
import { mat4, ReadonlyVec3 } from 'gl-matrix';
import { identity } from 'src/shared/resources/identity';
import { makeIdentity4x4 } from 'src/shared/utils/linal';

class Mesh {
  #positionAttribLocation = 0;
  #colorAttribLocation = 0;

  #center: ReadonlyVec3 = [0, 0, 0];
  #translate = makeIdentity4x4();

  #rotateX = makeIdentity4x4();
  #rotateY = makeIdentity4x4();
  #rotateZ = makeIdentity4x4();
  #rotate = makeIdentity4x4();

  #scale = makeIdentity4x4();

  #modelMat = new Float32Array(16);

  constructor(
    private readonly vertices: number[],
    private readonly indices: number[],
    center: ReadonlyVec3 = [0, 0, 0],
  ) {
    this.center = center;
  }

  get center() {
    return this.#center
  }
  set center(v: ReadonlyVec3) {
    this.#center = v;
    mat4.translate(this.#translate, identity, v);
  }

  setTranslate = (v: ReadonlyVec3) => {
    this.center = v;
  }
  get translate() {
    return this.#translate;
  }

  set scale(v: ReadonlyVec3) {
    mat4.scale(this.#scale, identity, v);
  }
  get scale() {
    return this.#scale;
  }

  setRotateX = (rad: number) => {
    mat4.rotate(this.#rotateX, identity, rad, [1, 0, 0]);
  }
  get rotateX() {
    return this.#rotateX;
  }

  setRotateY = (rad: number)=> {
    mat4.rotate(this.#rotateY, identity, rad, [0, 1, 0]);
  }
  get rotateY() {
    return this.#rotateY;
  }

  setRotateZ = (rad: number) => {
    mat4.rotate(this.#rotateZ, identity, rad, [0, 0, 1]);
  }
  get rotateZ() {
    return this.#rotateZ;
  }

  get modelMat() {
    // const temp = new Float32Array(16);
    this.#modelMat = new Float32Array(16);
    mat4.mul(this.#modelMat, this.#translate, this.#rotate);
    mat4.mul(this.#modelMat, this.#modelMat, this.#scale);
    return this.#modelMat;
  }

  setupBuffers = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    const {
      positionAttribLocation,
      colorAttribLocation
    } = setupBuffers(glContext, program, this.vertices, this.indices);
    this.#positionAttribLocation = positionAttribLocation;
    this.#colorAttribLocation = colorAttribLocation;
  }

  draw = (
    glContext: WebGL2RenderingContext,
  ) => {
    glContext.enableVertexAttribArray(this.#positionAttribLocation);
    glContext.enableVertexAttribArray(this.#colorAttribLocation);
    glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
    glContext.disableVertexAttribArray(this.#positionAttribLocation);
    glContext.disableVertexAttribArray(this.#colorAttribLocation);
  }
}

export {
  Mesh
}
