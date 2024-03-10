import { blue, cyan, green, magenta, red, yellow } from 'src/shared/resources/colors';


const boxVertices = [
  //top
  -1.0, 1.0, -1.0, ...red,
  -1.0, 1.0, 1.0,  ...red,
  1.0, 1.0, 1.0,   ...red,
  1.0, 1.0, -1.0,  ...red,
  //left
  -1.0, 1.0, 1.0,   ...yellow,
  -1.0, -1.0, 1.0,  ...yellow,
  -1.0, -1.0, -1.0, ...yellow,
  -1.0, 1.0, -1.0,  ...yellow,
  //right
  1.0, 1.0, 1.0,   ...green,
  1.0, -1.0, 1.0,  ...green,
  1.0, -1.0, -1.0, ...green,
  1.0, 1.0, -1.0,  ...green,
  //front
  1.0, 1.0, 1.0,   ...cyan,
  1.0, -1.0, 1.0,  ...cyan,
  -1.0, -1.0, 1.0, ...cyan,
  -1.0, 1.0, 1.0,  ...cyan,
  //back
  1.0, 1.0, -1.0,   ...blue,
  1.0, -1.0, -1.0,  ...blue,
  -1.0, -1.0, -1.0, ...blue,
  -1.0, 1.0, -1.0,  ...blue,
  //bottom
  -1.0, -1.0, -1.0, ...magenta,
  -1.0, -1.0, 1.0,  ...magenta,
  1.0, -1.0, 1.0,   ...magenta,
  1.0, -1.0, -1.0,  ...magenta,
];

const boxIndices = [
  //top
  0, 1, 2, 0, 2, 3,
  //left
  5, 4, 6, 6, 4, 7,
  // right
  8, 9, 10, 8, 10, 11,
  //front
  13, 12, 14, 15, 14, 12,
  //back
  16, 17, 18, 16, 18, 19,
  //bottom
  21, 20, 22, 22, 20, 23,
];

export { boxIndices, boxVertices };
