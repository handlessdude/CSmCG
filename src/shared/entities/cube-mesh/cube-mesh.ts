import { Mesh } from 'src/shared/entities/mesh/mesh';
import { ReadonlyVec3 } from 'gl-matrix';
import { boxIndices, boxVertices } from 'src/shared/resources/box-model';

class CubeMesh extends Mesh {
  constructor(
    center: ReadonlyVec3 = [0, 0, 0],
  ) {
    super(boxVertices, boxIndices, center);
  }
}

export {
  CubeMesh
}
