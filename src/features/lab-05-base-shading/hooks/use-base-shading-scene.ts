import { Timer } from 'src/shared/utils/webgl/timer';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { MeshGroup } from 'src/shared/entities/mesh-group/mesh-group';
import { RotationAngle } from 'src/shared/utils/controls/rotation-angle';
import { glMatrix, mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import { CubeMesh } from 'src/shared/entities/cube-mesh/cube-mesh';
import { palette } from 'src/shared/resources/palette';
import { cubesData, pedestalOffset } from 'src/shared/resources/pedestal-model';
import { Mesh } from 'src/shared/entities/mesh/mesh';
import { boxNormals } from 'src/shared/resources/box-model';
import { attributeKeys } from 'src/shared/resources/shaders/gourad/vertex-shader';
import { PointLightSource } from 'src/shared/entities/light-source/point-light-source';
import { uniformKeys } from 'src/shared/resources/shaders/phong/fragment-shader';
import { ShaderType } from 'src/features/lab-05-base-shading/resources/shader-type';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { ref, Ref } from 'vue';

const useBaseShadingScene = (
  shaders: {
    [shaderType in ShaderType]: BaseShaderProgram
  },
  currentShaderType: Ref<ShaderType>,
  lightSource: PointLightSource,
  camera: {
    position: ReadonlyVec3,
    aspect: number,
  }
) => {

  const shaderType = ref(currentShaderType);

  const {
    viewMatrix,
    projMatrix
  } = setupCamera(shaders[shaderType.value],{
      eye: camera.position,
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: camera.aspect,
      nearPlane: 0.1,
      farPlane: 1000.0,
    }
  )

  const timer = new Timer();

  const cubeAngle = new RotationAngle(() => timer.delta);
  const pedestalSelfAngle = new RotationAngle(() => timer.delta);
  const pedestalAbsAngle = new RotationAngle(() => timer.delta);

  const pedestal = new MeshGroup();

  const data = Array.from(cubesData)
  data.forEach(({ center })=> {
    vec3.add(center, center, pedestalOffset);
  });

  const setupBuffersInShader = (mesh: Mesh, shader: BaseShaderProgram) => {
    mesh.setupBaseBuffers(
      shader.program as WebGLProgram,
      shader.glContext
    );
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributeKeys.vertNormal,
      boxNormals,
      3
    );
  }

  const createScene = () => {
    data.forEach(({ center, color, material }) => {
      const cube =  new CubeMesh(center, color, material);
      pedestal.members.push(cube);
    })
  }

  const setupShaderPool = () => {
    Object.values(shaders).forEach((shader) => {
      shader.use();
      pedestal.members.forEach((mesh) => {
        setupBuffersInShader(mesh, shader);
      })
    })
  }

  createScene();
  setupShaderPool();

  const loop = () => {
    timer.updateDelta();

    shaders[shaderType.value].use();

    shaders[shaderType.value].setViewMat(viewMatrix);
    shaders[shaderType.value].setProjMat(projMatrix)

    shaders[shaderType.value].glContext.clearColor(
      ...(palette.darkBlue as [number, number, number]),
      1.0
    );
    shaders[shaderType.value].glContext.clear(
      shaders[shaderType.value].glContext.DEPTH_BUFFER_BIT | shaders[shaderType.value].glContext.COLOR_BUFFER_BIT
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

    const toPedestalCenter = pedestal.center;
    pedestal.members.forEach(placeMemberOnScene);

    // light uniforms
    shaders[shaderType.value].setVec3(uniformKeys.lightPos, lightSource.position as Float32List);
    shaders[shaderType.value].setFloat(uniformKeys.lightAmbientStrength, lightSource.ambient.strength);
    shaders[shaderType.value].setFloat(uniformKeys.lightSpecularStrength, lightSource.specular.strength);
    shaders[shaderType.value].setVec3(uniformKeys.lightAmbientColor, lightSource.ambient.color as Float32List);
    shaders[shaderType.value].setVec3(uniformKeys.lightDiffuseColor, lightSource.diffuse.color as Float32List);
    shaders[shaderType.value].setVec3(uniformKeys.lightSpecularColor, lightSource.specular.color as Float32List);

    // eye uniforms
    shaders[shaderType.value].setVec3(
      uniformKeys.viewPos,
      camera.position as Float32List,
    );

    // todo: maybe pass material uniforms in the following loop or just in mesh.draw
    pedestal.draw(shaders[shaderType.value]);

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();
    shaders[shaderType.value].glContext.enable(shaders[shaderType.value].glContext.DEPTH_TEST);
    shaders[shaderType.value].glContext.depthFunc(shaders[shaderType.value].glContext.LEQUAL);
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
