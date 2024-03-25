import { setupBuffers } from 'src/shared/utils/webgl';
import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';

class Mesh {
  #positionAttribLocation = 0;
  #colorAttribLocation = 0;

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
