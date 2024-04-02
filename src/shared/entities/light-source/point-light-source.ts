import { ReadonlyVec3 } from 'gl-matrix';
import { BaseLightSource } from 'src/shared/entities/light-source/base-light-source';

class PointLightSource extends BaseLightSource {
  constructor(
    public position: ReadonlyVec3,
    public ambient: {
      color: ReadonlyVec3,
      strength: number,
    },
    public diffuse: {
      color: ReadonlyVec3,
    },
    public specular: {
      color: ReadonlyVec3,
      strength: number,
    },
  ) {
    super(ambient, diffuse, specular)
  }
}

export {
  PointLightSource
}
