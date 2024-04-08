import { ReadonlyVec3, vec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { BaseMaterial } from 'src/shared/entities/material/base-material';
import { bronze, gold, silver } from 'src/shared/resources/materials/metals';

const cubesData: Array<{
  color: ReadonlyVec3,
  center: vec3,
  material?: BaseMaterial,
  textureData: [string, string]
}> = [
  {
    color: palette.silver, // todo remove?
    center: [-2, 0, 0],
    material: silver,
    textureData: ['/src/assets/textures/second.png', '/src/assets/textures/angel.png'],
  },{
    color: palette.gold,
    center: [0, 0, 0],
    material: gold,
    textureData: ['/src/assets/textures/first.png', '/src/assets/textures/artem.png'],
  },{
    color: palette.gold,
    center: [0, 2, 0],
    material: gold,
    textureData: ['/src/assets/textures/first.png', '/src/assets/textures/artem.png'],
  },
  {
    color: palette.bronze,
    center: [2, 0, 0],
    material: bronze,
    textureData: ['/src/assets/textures/third.png', '/src/assets/textures/tylko-jedno-w-glowie-mam.png'],
  },
];

const pedestalOffset: ReadonlyVec3 = [-5, 0, 0];

export {
  pedestalOffset,
  cubesData
}
