import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';
import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { BaseMaterial } from 'src/shared/entities/material/base-material';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { uniforms } from 'src/shared/resources/shaders/shader-keys';

type Uniforms = typeof uniforms;

class CubeTextured extends CubeMesh {
  constructor(
    readonly textures: Array<{
      textureUnitIdx: number;
      textureUnit: number;
      texture: WebGLTexture
    }>,
    readonly textureContrib: Array<{
      key: Uniforms[keyof Uniforms];
      value: number
    }>,
    center: vec3 = [0, 0, 0],
    color: ReadonlyVec3 = [0, 0, 1],
    public material: BaseMaterial | undefined = undefined,
  ) {
    console.log(textures)
    super(center, color, material);
  }

  draw(shader: BaseShaderProgram) {
    this.textures.forEach((value, idx)=>{
      shader.setInteger(
        uniforms[`sampler${idx}` as keyof typeof uniforms], value.textureUnitIdx
      );
      shader.setFloat(this.textureContrib[idx].key, this.textureContrib[idx].value);
    })
    super.draw(shader);
  }
}

export {
  CubeTextured
}
