import { palette } from 'src/shared/resources/palette';

const boxVertices = new Float32Array( [
  //top
  -1.0, 1.0, -1.0, ...palette.red,
  -1.0, 1.0, 1.0,  ...palette.red,
  1.0, 1.0, 1.0,   ...palette.red,
  1.0, 1.0, -1.0,  ...palette.red,
  //left
  -1.0, 1.0, 1.0,   ...palette.yellow,
  -1.0, -1.0, 1.0,  ...palette.yellow,
  -1.0, -1.0, -1.0, ...palette.yellow,
  -1.0, 1.0, -1.0,  ...palette.yellow,
  //right
  1.0, 1.0, 1.0,   ...palette.green,
  1.0, -1.0, 1.0,  ...palette.green,
  1.0, -1.0, -1.0, ...palette.green,
  1.0, 1.0, -1.0,  ...palette.green,
  //front
  1.0, 1.0, 1.0,   ...palette.cyan,
  1.0, -1.0, 1.0,  ...palette.cyan,
  -1.0, -1.0, 1.0, ...palette.cyan,
  -1.0, 1.0, 1.0,  ...palette.cyan,
  //back
  1.0, 1.0, -1.0,   ...palette.blue,
  1.0, -1.0, -1.0,  ...palette.blue,
  -1.0, -1.0, -1.0, ...palette.blue,
  -1.0, 1.0, -1.0,  ...palette.blue,
  //bottom
  -1.0, -1.0, -1.0, ...palette.magenta,
  -1.0, -1.0, 1.0,  ...palette.magenta,
  1.0, -1.0, 1.0,   ...palette.magenta,
  1.0, -1.0, -1.0,  ...palette.magenta,
]);

const boxIndices = new Uint16Array([
  //top
  0, 1, 2,
  0, 2, 3,
  //left
  5, 4, 6,
  6, 4, 7,
  // right
  8, 9, 10,
  8, 10, 11,
  //front
  13, 12, 14,
  15, 14, 12,
  //back
  16, 17, 18,
  16, 18, 19,
  //bottom
  21, 20, 22,
  22, 20, 23
]);

const boxNormals = new Float32Array([
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
]);

export { boxIndices, boxVertices, boxNormals };
