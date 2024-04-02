import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { setupEBO, setupVBO } from 'src/shared/utils/webgl/setup-buffers';
import { vertColorKey, vertPositionKey } from 'src/shared/resources/shaders/base/base-shaders';
import { BaseMaterial } from 'src/shared/entities/material/base-material';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { uniformKeys } from 'src/shared/resources/shaders/shader-keys';

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
    public material: BaseMaterial | undefined = undefined,
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
    shader: BaseShaderProgram
  ) => {
    if (this.material) {
      shader.setFloat(uniformKeys.materialShininess, this.material.shininess);
    }
    shader.glContext.bindBuffer(shader.glContext.ELEMENT_ARRAY_BUFFER, this.#elementBufferObject);
    this.#enableBuffers(shader.glContext);
    shader.glContext.drawElements(
      shader.glContext.TRIANGLES,
      this.indices.length,
      shader.glContext.UNSIGNED_SHORT,
      0
    );
    this.#disableBuffers(shader.glContext);
  }
}

export {
  Mesh
}
