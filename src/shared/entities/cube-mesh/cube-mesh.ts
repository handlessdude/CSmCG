import { Mesh } from 'src/shared/entities/mesh/mesh';
import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { boxIndices } from 'src/shared/resources/box-model';

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

const initVertices = (
  vertices: Array<ReadonlyVec3>,
  color: ReadonlyVec3
) => {
  return vertices.map((val) => [...val, ...color]).flat()
}

class CubeMesh extends Mesh {
  constructor(
    center: vec3 = [0, 0, 0],
    color: ReadonlyVec3 = [0, 0, 1]
  ) {
    super(initVertices(cubeVertices, color), boxIndices, center);
  }
}

export {
  CubeMesh
}
