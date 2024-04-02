import { ReadonlyVec3 } from 'gl-matrix';

class BaseMaterial {
  constructor(
    public ambientColor: ReadonlyVec3,
    public diffuseColor: ReadonlyVec3,
    public specularColor: ReadonlyVec3,
    public shininess: number,
  ) {}
}

export {
  BaseMaterial
}
