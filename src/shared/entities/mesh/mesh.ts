import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { setupEBO, setupVBO } from 'src/shared/utils/webgl/setup-buffers';
import { vertColorKey, vertPositionKey } from 'src/shared/resources/basic-shaders';

const positionSize = 3;
const colorSize = 3;

class Mesh {
  #elementBufferObject: WebGLBuffer | null = null;
  #bufferPool: Record<string, {
    vertexBufferObject: WebGLBuffer | null;
    attribLocation: number;
    componentsPerAttribute: number;
  }> = {}

  constructor(
    private readonly vertices: Float32Array,
    private readonly indices: Uint16Array,
    readonly center: vec3 = [0, 0, 0],
    private readonly color: ReadonlyVec3 = [0, 0, 1],
    readonly worldMat = makeIdentity4x4(),
  ) { }

  attachBuffer = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
    bufferKey: string,
    bufferData: Float32Array,
    componentsPerAttribute: number,
  ) => {
    const {
      vertexBufferObject,
      attribLocation
    } = setupVBO(glContext, program, bufferData, bufferKey);
    this.#bufferPool[bufferKey] = {
      vertexBufferObject, attribLocation, componentsPerAttribute
    }
  }

  setupBaseBuffers = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    this.attachBuffer(
      program,
      glContext,
      vertPositionKey,
      this.vertices,
      positionSize
    )

    const verticesCount = this.vertices.length / positionSize;
    const colorData = Array(verticesCount).fill(this.color).flat();

    this.attachBuffer(
      program,
      glContext,
      vertColorKey,
      colorData as unknown as Float32Array,
      colorSize
    )

    const {
      indexBufferObject
    } = setupEBO(glContext, program, this.indices);

    this.#elementBufferObject = indexBufferObject;
  }

  #enableBuffers = (glContext: WebGL2RenderingContext) => {
   Object.values(this.#bufferPool).forEach(({
      vertexBufferObject,
      attribLocation,
      componentsPerAttribute
   }) => {
     glContext.enableVertexAttribArray(attribLocation);
     glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferObject);
     glContext.vertexAttribPointer(
       attribLocation,
       componentsPerAttribute,
       glContext.FLOAT,
       false,
       componentsPerAttribute * Float32Array.BYTES_PER_ELEMENT,
       0
     );
   })
  }

  #disableBuffers = (glContext: WebGL2RenderingContext) => {
    Object.values(this.#bufferPool).forEach(({attribLocation}) => {
      glContext.disableVertexAttribArray(attribLocation);
    })
  }

  draw = (
    glContext: WebGL2RenderingContext,
  ) => {
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.#elementBufferObject);
    this. #enableBuffers(glContext);
    glContext.drawElements(
      glContext.TRIANGLES,
      this.indices.length,
      glContext.UNSIGNED_SHORT,
      0
    );
    this.#disableBuffers(glContext);
  }
}

export {
  Mesh
}
