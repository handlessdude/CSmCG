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

  const colorToFrac = (
    color: ReadonlyVec3
  ): ReadonlyVec3 => [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0];

  const silver = colorToFrac ([218, 232, 240]);
  const gold = colorToFrac([249, 229, 164]);
  const bronze = colorToFrac([250, 189, 98]);

  const cubesData: Array<{
    color: ReadonlyVec3,
    center: vec3,
  }> = [
    {
      color: silver,
      center: [-2, 0, 0],
    },{
      color: gold,
      center: [0, 0, 0],
    },{
      color: gold,
      center: [0, 2, 0],
    },
    {
      color: bronze,
      center: [2, 0, 0],
    },
  ];

  const pedestalOffset: ReadonlyVec3 = [-5, 0, 0];
  cubesData.forEach(({ center })=> {
    vec3.add(center, center, pedestalOffset);
  })
  cubesData.forEach(({ center, color }) => {
    const cube =  new CubeMesh(center, color);
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
    const toPedestalCenter = pedestal.center;
    pedestal.members.forEach((member, index, array)=> {
      const memberCenter = member.center;

      const toMemberCenter: vec3 = [0, 0, 0];
      vec3.subtract(toMemberCenter, memberCenter, toPedestalCenter);

      mat4.identity(member.worldMat);
      mat4.rotate(member.worldMat, member.worldMat, pedestalAbsAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, toPedestalCenter); // global coordinates
      mat4.rotate(member.worldMat, member.worldMat, pedestalSelfAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, toMemberCenter); // pedestal coordinates

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
