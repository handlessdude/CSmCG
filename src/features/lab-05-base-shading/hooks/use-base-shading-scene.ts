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
import { PointLightSource } from 'src/shared/entities/light-source/point-light-source';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { ref, Ref } from 'vue';
import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import { ShaderType } from 'src/shared/resources/shaders/shader-type';
import { LightingModelType } from 'src/shared/resources/lighting/lighting-model-type';


const positionSize = 3;

const useBaseShadingScene = (
  shaders: {
    [shaderType in ShaderType]: BaseShaderProgram
  },
  lightSource: PointLightSource,
  camera: {
    position: ReadonlyVec3,
    aspect: number,
  },
  currentShaderType: Ref<ShaderType>,
  currentLightingModelType: Ref<LightingModelType>,
  currentAttenuation: Ref<{ 0: number, 1: number, 2: number }>,
  currentToonCoefficients: Ref<{ 0: number, 1: number, 2: number }>,
  currentToonThresholds: Ref<{ 0: number, 1: number, 2: number }>,
) => {

  const shaderType = ref(currentShaderType);
  const lightingModelType = ref(currentLightingModelType);
  const attenuation = ref(currentAttenuation);
  const toonCoefficients = ref(currentToonCoefficients);
  const toonThresholds = ref(currentToonThresholds);

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
    mesh.setupEBO(
      shader.program as WebGLProgram,
      shader.glContext
    );
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributes.vertPosition,
      mesh.vertices,
      positionSize
    )
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributes.vertNormal,
      boxNormals,
      positionSize
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

    shaders[shaderType.value].setMat4(uniforms.mView, viewMatrix);
    shaders[shaderType.value].setMat4(uniforms.mProj, projMatrix)

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
    const isPhongEnabled = Number(lightingModelType.value === LightingModelType.PHONG);
    const isBlinnEnabled = Number(lightingModelType.value === LightingModelType.BLINN_PHONG);
    const isToonShadingEnabled = Number(lightingModelType.value === LightingModelType.TOON_SHADING);

    shaders[shaderType.value].setFloat(uniforms.isBlinnLightingEnabled, isBlinnEnabled);
    shaders[shaderType.value].setFloat(uniforms.isPhongLightingEnabled, isPhongEnabled);
    shaders[shaderType.value].setFloat(uniforms.isToonLightingEnabled, isToonShadingEnabled);

    shaders[shaderType.value].setVec3(uniforms.lightPos, lightSource.position as Float32List);
    shaders[shaderType.value].setFloat(uniforms.lightAmbientStrength, lightSource.ambient.strength);
    shaders[shaderType.value].setFloat(uniforms.lightSpecularStrength, lightSource.specular.strength);
    shaders[shaderType.value].setVec3(uniforms.lightAmbientColor, lightSource.ambient.color as Float32List);
    shaders[shaderType.value].setVec3(uniforms.lightDiffuseColor, lightSource.diffuse.color as Float32List);
    shaders[shaderType.value].setVec3(uniforms.lightSpecularColor, lightSource.specular.color as Float32List);

    shaders[shaderType.value].setVec3(uniforms.attenuation, [attenuation.value[0], attenuation.value[1], attenuation.value[2]]);
    shaders[shaderType.value].setVec3(uniforms.toonCoefs, [toonCoefficients.value[0], toonCoefficients.value[1], toonCoefficients.value[2]]);
    shaders[shaderType.value].setVec3(uniforms.toonThresholds, [toonThresholds.value[0], toonThresholds.value[1], toonThresholds.value[2]]);

    // eye uniforms
    shaders[shaderType.value].setVec3(
      uniforms.viewPos,
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
