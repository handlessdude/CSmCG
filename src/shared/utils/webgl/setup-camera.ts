import { mat4, ReadonlyVec3 } from 'gl-matrix';

const setupCamera = (
  viewConfig: {
    eye: ReadonlyVec3,
    center: ReadonlyVec3,
    up: ReadonlyVec3,
  },
  projectionConfig: {
    fovy: number,
    aspect: number,
    nearPlane: number,
    farPlane: number
  },
) => {
  const viewMatrix = new Float32Array(16);
  mat4.lookAt(viewMatrix,
    viewConfig.eye,
    viewConfig.center,
    viewConfig.up,
  );

  const projMatrix = new Float32Array(16);
  mat4.perspective(
    projMatrix,
    projectionConfig.fovy,
    projectionConfig.aspect,
    projectionConfig.nearPlane,
    projectionConfig.farPlane
  );

  return {
    viewMatrix,
    projMatrix,
  }
}

export {
  setupCamera
}
