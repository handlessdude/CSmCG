import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { setupEBO, setupVBO } from 'src/shared/utils/webgl/setup-buffers';
import { vertColorKey, vertPositionKey } from 'src/shared/resources/basic-shaders';

const positionSize = 3;
const colorSize = 3;

class Mesh {
  #positionAttribLocation = 0;
  #colorAttribLocation = 0;
  #positionVBO: WebGLBuffer | null = null;
  #colorVBO: WebGLBuffer | null = null;
  #EBO: WebGLBuffer | null = null;

  constructor(
    private readonly vertices: Float32Array,
    private readonly indices: Uint16Array,
    readonly center: vec3 = [0, 0, 0],
    private readonly color: ReadonlyVec3 = [0, 0, 1],
    readonly worldMat = makeIdentity4x4(),
  ) { }

  setupBuffers = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    const {
      vertexBufferObject: positionVBO,
      attribLocation: positionAttribLocation
    } = setupVBO(
      glContext, program, this.vertices, vertPositionKey
    );
    const verticesCount = this.vertices.length / 3;
    const colorData = Array(verticesCount).fill(this.color).flat();
    const {
      vertexBufferObject: colorVBO,
      attribLocation: colorAttribLocation
    } = setupVBO(
      glContext,
      program,
      colorData as unknown as Float32Array,
      vertColorKey
    );
    const {
      indexBufferObject
    } = setupEBO(glContext, program, this.indices);
    this.#positionAttribLocation = positionAttribLocation;
    this.#colorAttribLocation = colorAttribLocation;
    this.#positionVBO = positionVBO;
    this.#colorVBO = colorVBO;
    this.#EBO = indexBufferObject;
  }

  draw = (
    glContext: WebGL2RenderingContext,
  ) => {
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.#EBO);

    glContext.enableVertexAttribArray(this.#positionAttribLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.#positionVBO);
    glContext.vertexAttribPointer(
      this.#positionAttribLocation,
      positionSize,
      glContext.FLOAT,
      false,
      positionSize * Float32Array.BYTES_PER_ELEMENT,
      0
    );

    glContext.enableVertexAttribArray(this.#colorAttribLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.#colorVBO);
    glContext.vertexAttribPointer(
      this.#colorAttribLocation,
      colorSize,
      glContext.FLOAT,
      false,
      colorSize * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
    glContext.disableVertexAttribArray(this.#positionAttribLocation);
    glContext.disableVertexAttribArray(this.#colorAttribLocation);
  }
}

export {
  Mesh
}
