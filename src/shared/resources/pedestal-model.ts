import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { BaseMaterial } from 'src/shared/entities/material/base-material';
import { bronze, gold, silver } from 'src/shared/resources/materials/metals';

const cubesData: Array<{
  color: ReadonlyVec3,
  center: vec3,
  material?: BaseMaterial,
}> = [
  {
    color: palette.silver, // todo remove?
    center: [-2, 0, 0],
    material: silver,
  },{
    color: palette.gold,
    center: [0, 0, 0],
    material: gold
  },{
    color: palette.gold,
    center: [0, 2, 0],
    material: gold
  },
  {
    color: palette.bronze,
    center: [2, 0, 0],
    material: bronze
  },
];

const pedestalOffset: ReadonlyVec3 = [-5, 0, 0];

export {
  pedestalOffset,
  cubesData
}
