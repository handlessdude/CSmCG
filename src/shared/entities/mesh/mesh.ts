import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { setupEBO, setupVBO } from 'src/shared/utils/webgl/setup-buffers';
import { vertColorKey, vertPositionKey } from 'src/shared/resources/shaders/base/base-shaders';
import { BaseMaterial } from 'src/shared/entities/material/base-material';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { uniforms } from 'src/shared/resources/shaders/shader-keys';
import { baseMtl } from 'src/shared/resources/materials/base';
import { ObjData } from 'src/shared/utils/resource-loaders/obj-loader';

const positionSize = 3;
const colorSize = 3;

const VERTICES_PER_FACE = 3;

interface MeshParams {
  color?: ReadonlyVec3;
  material?: BaseMaterial;
  worldMat?: Float32Array;
}

class Mesh {
  public readonly material;
  public readonly color;
  public readonly indices: Uint16Array | undefined;
  public readonly worldMat;

  #elementBufferObject: WebGLBuffer | null = null;
  #bufferPool: Record<string, {
    vertexBufferObject: WebGLBuffer | null;
    attribLocation: number;
    componentsPerAttribute: number;
  }> = {}

  constructor(
    public readonly meshData: ObjData,
    readonly center: vec3 = [0, 0, 0],
   {
      color = [0, 0, 1],
      material = baseMtl,
      worldMat = makeIdentity4x4(),
    }: MeshParams,
  ) {
    this.material = material;
    this.color = color;
    this.worldMat = worldMat;
  }

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

  setupEBO = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    if (!this.indices) throw new Error('No indices in mesh!');
    const {
      indexBufferObject
    } = setupEBO(glContext, program, this.indices);

    this.#elementBufferObject = indexBufferObject;
  }

  setupBaseBuffers = (
    program: WebGLProgram,
    glContext: WebGL2RenderingContext,
  ) => {
    const vertices = new Float32Array(this.meshData.vertices.flat());
    this.attachBuffer(
      program,
      glContext,
      vertPositionKey,
      vertices,
      positionSize
    )

    const verticesCount = vertices.length / positionSize;
    const colorData = Array(verticesCount).fill(this.color).flat();

    this.attachBuffer(
      program,
      glContext,
      vertColorKey,
      colorData as unknown as Float32Array,
      colorSize
    )
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

  draw(shader: BaseShaderProgram) {
    shader.setWorldMat(this.worldMat);

    if (this.material) {
      shader.setFloat(uniforms.materialShininess, this.material.shininess);
      shader.setVec3(uniforms.materialAmbientColor, this.material.ambientColor as Float32List);
      shader.setVec3(uniforms.materialDiffuseColor, this.material.diffuseColor as Float32List);
      shader.setVec3(uniforms.materialSpecularColor, this.material.specularColor as Float32List);
    }

    if (this.meshData.indices) {
      shader.glContext.bindBuffer(shader.glContext.ELEMENT_ARRAY_BUFFER, this.#elementBufferObject);
    }
    this.#enableBuffers(shader.glContext);

    if (this.indices) {
      shader.glContext.drawElements(
        shader.glContext.TRIANGLES,
        this.indices.length,
        shader.glContext.UNSIGNED_SHORT,
        0
      );
    } else {
      shader.glContext.drawArrays(
        shader.glContext.TRIANGLES,
        0,
        this.meshData.faceCount * this.meshData.vertexPerFace, // remove
      );
    }

    this.#disableBuffers(shader.glContext);
  }
}

export type {
  MeshParams
}

export {
  Mesh
}
