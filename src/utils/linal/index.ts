import { mat4, ReadonlyVec3 } from 'gl-matrix';

const makeZero4x4 = () => new Float32Array(16);
const makeIdentity4x4 = () => {
  const identityMatrix = makeZero4x4();
  mat4.identity(identityMatrix);
  return identityMatrix
};

const translate4x4 = (v: ReadonlyVec3) => {
  const out = makeZero4x4();
  mat4.fromTranslation(out, v);
  return out;
}

const scale4x4 = (v: ReadonlyVec3) => {
  const out = makeZero4x4();
  mat4.fromScaling(out, v);
  return out;
}

const rotate4x4 = (rad: number, axis: ReadonlyVec3) => {
  const out = makeZero4x4();
  mat4.fromRotation(out, rad, axis);
  return out;
}

export {
  makeIdentity4x4,
  makeZero4x4,
  translate4x4,
  scale4x4,
  rotate4x4
}
