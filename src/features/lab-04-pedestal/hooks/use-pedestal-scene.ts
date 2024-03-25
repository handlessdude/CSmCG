import { Timer } from 'src/shared/utils/webgl/timer';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { MeshGroup } from 'src/features/lab-04-pedestal/utils/entities/mesh-group';
import { RotationAngle } from 'src/features/lab-04-pedestal/utils/controls/rotation-angle';
import { mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';

const usePedestalScene = (
  shaderProgram: BaseShaderProgram,
) => {
  if (!shaderProgram.program) {
    throw new Error('Shader program not found')
  }
  const timer = new Timer();

  const cubeAngle = new RotationAngle(() => timer.delta);
  const pedestalSelfAngle = new RotationAngle(() => timer.delta);
  const pedestalAbsAngle = new RotationAngle(() => timer.delta);

  const pedestal = new MeshGroup(shaderProgram);

  const cubeCenters: Array<vec3> = [
    [-2, 0, 0],
    [0, 0, 0],
    [2, 0, 0],
    [0, 2, 0],
  ];

  const pedestalOffset: ReadonlyVec3 = [-5, 0, 0];
  cubeCenters.forEach((center)=> {
    vec3.add(center, center, pedestalOffset);
  })
  cubeCenters.forEach((center) => {
    const cube =  new CubeMesh(center);
    cube.setupBuffers(
      shaderProgram.program as WebGLProgram,
      shaderProgram.glContext
    );
    pedestal.members.push(cube);
  })

  const loop = () => {
    timer.updateDelta();

    shaderProgram.glContext.clearColor(1.0, 1.0, 1.0, 1.0);
    shaderProgram.glContext.clear(
      shaderProgram.glContext.DEPTH_BUFFER_BIT | shaderProgram.glContext.COLOR_BUFFER_BIT
    );

    // t r s
    const pedestalCenter = pedestal.center;
    pedestal.members.forEach((member, index, array)=> {
      const memberCenter = member.center;

      const pedestalCenterDist: vec3 = [0, 0, 0];
      vec3.subtract(pedestalCenterDist, memberCenter, pedestalCenter);
      mat4.identity(member.worldMat);
      mat4.rotate(member.worldMat, member.worldMat, pedestalAbsAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, pedestalCenter);
      mat4.rotate(member.worldMat, member.worldMat, pedestalSelfAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, pedestalCenterDist);
      mat4.rotate(member.worldMat, member.worldMat, cubeAngle.value, [0, 1, 0]);
    });


    pedestal.draw();

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();
    shaderProgram.glContext.enable(shaderProgram.glContext.DEPTH_TEST);
    shaderProgram.glContext.depthFunc(shaderProgram.glContext.LEQUAL);
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
    cubeRotate: {
      dec: cubeAngle.decAngle,
      inc: cubeAngle.incAngle,
    },
    groupSelfRotate: {
      dec: pedestalSelfAngle.decAngle,
      inc: pedestalSelfAngle.incAngle,
    },
    groupAbsRotate: {
      dec: pedestalAbsAngle.decAngle,
      inc: pedestalAbsAngle.incAngle,
    },
  }
}
export { usePedestalScene }
