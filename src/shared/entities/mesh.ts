import { setupBuffers } from 'src/shared/utils/webgl';

class Mesh {
  constructor(
    private readonly vertices: number[],
    private readonly indices: number[]
  ) { }

  #positionAttribLocation = 0;
  #colorAttribLocation = 0;

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
