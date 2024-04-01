import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';

const cubesData: Array<{
  color: ReadonlyVec3,
  center: vec3,
}> = [
  {
    color: palette.silver,
    center: [-2, 0, 0],
  },{
    color: palette.gold,
    center: [0, 0, 0],
  },{
    color: palette.gold,
    center: [0, 2, 0],
  },
  {
    color: palette.bronze,
    center: [2, 0, 0],
  },
];

const pedestalOffset: ReadonlyVec3 = [-5, 0, 0];

export {
  pedestalOffset,
  cubesData
}
