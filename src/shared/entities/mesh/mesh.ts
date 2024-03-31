import { setupBuffers } from 'src/shared/utils/webgl';
import { vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';

class Mesh {
  #positionAttribLocation = 0;
  #colorAttribLocation = 0;
  #vertexBufferObject: WebGLBuffer | null = null;
  #indexBufferObject: WebGLBuffer | null = null;

  constructor(
    private readonly vertices: number[],
    private readonly indices: number[],
    readonly center: vec3 = [0, 0, 0],
    readonly worldMat = makeIdentity4x4(),
  ) { }

  setupBuffers = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    const {
      positionAttribLocation,
      colorAttribLocation,
      vertexBufferObject,
      indexBufferObject
    } = setupBuffers(glContext, program, this.vertices, this.indices);
    this.#positionAttribLocation = positionAttribLocation;
    this.#colorAttribLocation = colorAttribLocation;
    this.#vertexBufferObject = vertexBufferObject;
    this.#indexBufferObject = indexBufferObject;
  }

  draw = (
    glContext: WebGL2RenderingContext,
  ) => {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.#vertexBufferObject);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.#indexBufferObject);
    glContext.vertexAttribPointer(
      this.#positionAttribLocation,
      3,
      glContext.FLOAT,
      false,
      6 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    glContext.vertexAttribPointer(
      this.#colorAttribLocation,
      3,
      glContext.FLOAT,
      false,
      6 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
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
