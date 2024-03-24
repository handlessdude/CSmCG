import { mat4, ReadonlyVec3 } from 'gl-matrix';

const setWorldMatrix = (
  worldMatrix: Float32Array,
  worldConfig: {
    translation: Float32Array,
    rotation: Float32Array,
    scale: Float32Array,
}) => {
  // T * R * S [* originVector]
  const temp = new Float32Array(16);
  mat4.mul(temp, worldConfig.translation, worldConfig.rotation);
  mat4.mul(worldMatrix, temp, worldConfig.scale);
}

const setupTransformationMatrices = (
  glContext: WebGL2RenderingContext,
  program: WebGLProgram,
  worldConfig: {
    translation: Float32Array,
    rotation: Float32Array,
    scale: Float32Array,
  },
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
  const matWorldUniformLocation = glContext.getUniformLocation(program, 'mWorld');
  const matViewUniformLocation = glContext.getUniformLocation(program, 'mView');
  const matProjUniformLocation = glContext.getUniformLocation(program, 'mProj');

  if (!matWorldUniformLocation || !matViewUniformLocation || !matProjUniformLocation) {
    throw new Error(`Error while getting matrices uniform location:
    world ${matWorldUniformLocation} |
    view ${matViewUniformLocation} |
    projection ${matProjUniformLocation} |
    `)
  }
  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);

  setWorldMatrix(worldMatrix, worldConfig);
  mat4.lookAt(viewMatrix,
    viewConfig.eye,
    viewConfig.center,
    viewConfig.up,
  );
  mat4.perspective(
    projMatrix,
    projectionConfig.fovy,
    projectionConfig.aspect,
    projectionConfig.nearPlane,
    projectionConfig.farPlane
  );

  glContext.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
  glContext.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
  glContext.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

  return {
    worldMatrix,
    viewMatrix,
    projMatrix,
    matWorldUniformLocation,
    matViewUniformLocation,
    matProjUniformLocation,
  }
}

export {
  setupTransformationMatrices,
};
