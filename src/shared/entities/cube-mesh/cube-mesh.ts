import { Mesh } from 'src/shared/entities/mesh/mesh';
import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { boxIndices } from 'src/shared/resources/box-model';
import { BaseMaterial } from 'src/shared/entities/material/base-material';

const cubeVertices: Array<ReadonlyVec3> = [
  //top
  [-1.0, 1.0, -1.0],
  [-1.0, 1.0, 1.0 ],
  [1.0, 1.0, 1.0  ],
  [1.0, 1.0, -1.0 ],
  //left
  [-1.0, 1.0, 1.0  ],
  [-1.0, -1.0, 1.0 ],
  [-1.0, -1.0, -1.0],
  [-1.0, 1.0, -1.0 ],
  //right
  [1.0, 1.0, 1.0  ],
  [1.0, -1.0, 1.0 ],
  [1.0, -1.0, -1.0],
  [1.0, 1.0, -1.0 ],
  //front
  [1.0, 1.0, 1.0  ],
  [1.0, -1.0, 1.0 ],
  [-1.0, -1.0, 1.0],
  [-1.0, 1.0, 1.0 ],
  //back
  [1.0, 1.0, -1.0  ],
  [1.0, -1.0, -1.0 ],
  [-1.0, -1.0, -1.0],
  [-1.0, 1.0, -1.0 ],
  //bottom
  [-1.0, -1.0, -1.0],
  [-1.0, -1.0, 1.0 ],
  [1.0, -1.0, 1.0  ],
  [1.0, -1.0, -1.0 ],
];

class CubeMesh extends Mesh {
  constructor(
    center: vec3 = [0, 0, 0],
    color: ReadonlyVec3 = [0, 0, 1],
    public material: BaseMaterial | undefined = undefined,
  ) {
    super(
      cubeVertices.flat()  as unknown as Float32Array,
      boxIndices,
      center,
      color,
      material
    );
  }
}

export {
  CubeMesh
}
