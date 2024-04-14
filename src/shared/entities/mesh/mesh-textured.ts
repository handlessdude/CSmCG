import {  vec3 } from 'gl-matrix';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { uniforms } from 'src/shared/resources/shaders/shader-keys';
import { Mesh, MeshParams } from 'src/shared/entities/mesh/mesh';
import { baseMtl } from 'src/shared/resources/materials/base';
import { makeIdentity4x4 } from 'src/shared/utils/linal';
import { ObjData } from 'src/shared/utils/obj-loader/obj-loader';

class MeshTextured extends Mesh {
  constructor(
    public readonly meshData: ObjData,
    readonly center: vec3 = [0, 0, 0],
    readonly textures: Array<{
      textureUnitIdx: number;
      textureUnit: number;
      texture: WebGLTexture
    }>,
    {
      color = [0, 0, 1],
      material = baseMtl,
      worldMat = makeIdentity4x4(),
    }: MeshParams,
  ) {
    super(meshData, center, {
      color,
      material,
      worldMat,
    });
  }

  draw(shader: BaseShaderProgram) {
    this.textures.forEach((value, idx)=>{
      shader.setInteger(
        uniforms[`sampler${idx}` as keyof typeof uniforms], value.textureUnitIdx
      );
    });
    super.draw(shader);
  }
}

export {
  MeshTextured
}
