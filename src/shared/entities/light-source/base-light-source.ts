import { ReadonlyVec3 } from 'gl-matrix';

class BaseLightSource {
  constructor(
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
    }
  ) { }
}

export {
  BaseLightSource
}
