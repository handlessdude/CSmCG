import { ReadonlyVec3 } from 'gl-matrix';

const toFracIntensity = (
  color: ReadonlyVec3
): ReadonlyVec3 => color.map((component) => component / 255.0) as ReadonlyVec3;

export {
  toFracIntensity
}
