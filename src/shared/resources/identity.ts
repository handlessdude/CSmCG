import { mat4 } from 'gl-matrix';

const identity = new Float32Array(16);
mat4.identity(identity);

export {
  identity
}
