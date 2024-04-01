import { Timer } from 'src/shared/utils/webgl/timer';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { MeshGroup } from 'src/shared/entities/mesh-group/mesh-group';
import { RotationAngle } from 'src/shared/utils/controls/rotation-angle';
import { mat4, vec3 } from 'gl-matrix';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';
import { palette } from 'src/shared/resources/palette';
import { cubesData, pedestalOffset } from 'src/shared/resources/pedestal-model';
import { Mesh } from 'src/shared/entities/mesh/mesh';
// import { boxNormals } from 'src/shared/resources/box-model';

const useBaseShadingScene = (
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

  const data = Array.from(cubesData)
  data.forEach(({ center })=> {
    vec3.add(center, center, pedestalOffset);
  });

  data.forEach(({ center, color }) => {
    const cube =  new CubeMesh(center, color);
    cube.setupBaseBuffers(
      shaderProgram.program as WebGLProgram,
      shaderProgram.glContext
    );
    /*cube.attachBuffer(
      shaderProgram.program as WebGLProgram,
      shaderProgram.glContext,
      'vertNormal',
      boxNormals,
      3
    );*/
    pedestal.members.push(cube);
  })

  const loop = () => {
    timer.updateDelta();

    shaderProgram.glContext.clearColor(
      ...(palette.darkBlue as [number, number, number]),
      1.0
    );
    shaderProgram.glContext.clear(
      shaderProgram.glContext.DEPTH_BUFFER_BIT | shaderProgram.glContext.COLOR_BUFFER_BIT
    );

    const placeMemberOnScene = (member: Mesh)=> {
      const memberCenter = member.center;

      const toMemberCenter: vec3 = [0, 0, 0];
      vec3.subtract(toMemberCenter, memberCenter, toPedestalCenter);

      mat4.identity(member.worldMat);
      mat4.rotate(member.worldMat, member.worldMat, pedestalAbsAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, toPedestalCenter); // global coordinates
      mat4.rotate(member.worldMat, member.worldMat, pedestalSelfAngle.value, [0, 1, 0]);
      mat4.translate(member.worldMat, member.worldMat, toMemberCenter); // pedestal coordinates

      mat4.rotate(member.worldMat, member.worldMat, cubeAngle.value, [0, 1, 0]);
    }

    // t r s
    const toPedestalCenter = pedestal.center;
    pedestal.members.forEach(placeMemberOnScene);

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
export { useBaseShadingScene }
