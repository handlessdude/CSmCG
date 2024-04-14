import { Timer } from 'src/shared/utils/webgl/timer';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { RotationAngle } from 'src/shared/utils/controls/rotation-angle';
import { glMatrix, mat4, ReadonlyVec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { Mesh } from 'src/shared/entities/mesh/mesh';
import { PointLightSource } from 'src/shared/entities/light-source/point-light-source';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { ref, Ref } from 'vue';
import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import { ShaderType } from 'src/shared/resources/shaders/shader-type';
import { LightingModelType } from 'src/shared/resources/lighting/lighting-model-type';
import { OBJParser } from 'src/shared/utils/obj-loader/obj-loader';
import { MeshTextured } from 'src/shared/entities/mesh/mesh-textured';
import { loadImage } from 'src/shared/utils/image-loader';

const positionSize = 3;
const textureCoordSize = 2;

const createTexture = (
  glContext: WebGL2RenderingContext,
  image: HTMLImageElement,
  textureUnitIdx: number,
  ) => {
  const texture = glContext.createTexture();
  const textureUnit = glContext[`TEXTURE${textureUnitIdx}` as keyof typeof glContext] as number;
  glContext.activeTexture(textureUnit);
  glContext.bindTexture(glContext.TEXTURE_2D, texture);
  glContext.texImage2D(
    glContext.TEXTURE_2D,
    0,
    glContext.RGBA,
    glContext.RGBA,
    glContext.UNSIGNED_BYTE,
    image,
  );
  // glContext.generateMipmap(glContext.TEXTURE_2D);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);

  return {
    textureUnitIdx,
    textureUnit,
    texture: texture as WebGLTexture
  };
}
// todo: make injection of base lighting scene
const useBumpMappingScene = async (
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

  const objSrc = '/src/assets/meshes/sphere.obj';
  const textureSrc = '/src/assets/textures/help_me.png';

  const objLoader = new OBJParser();
  const sphereMeshData = await objLoader.load(objSrc);
  const textureImage = await loadImage(textureSrc)

  const texture = createTexture(
    shaders[shaderType.value].glContext,
    textureImage,
    0,
  )

  const sphere = new MeshTextured(
    sphereMeshData,
    [0, 0, 0],
    [texture],
    {}
  );

  const setupBuffersInShader = (mesh: Mesh, shader: BaseShaderProgram) => {
    const vertices = new Float32Array(mesh.meshData.vertices.flat());
    const normals = new Float32Array( mesh.meshData.normals.flat());
    const texCoords = new Float32Array(mesh.meshData.texCoords.flat());
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributes.vertPosition,
      vertices,
      positionSize
    )
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributes.vertNormal,
      normals,
      positionSize
    );
    mesh.attachBuffer(
      shader.program as WebGLProgram,
      shader.glContext,
      attributes.vertTextureCoord,
      texCoords,
      textureCoordSize
    );
  }

  const setupShaderPool = () => {
    Object.values(shaders).forEach((shader) => {
      shader.use();
      setupBuffersInShader(sphere, shader);
    })
  }

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
      mat4.identity(member.worldMat);
      mat4.rotate(member.worldMat, member.worldMat, cubeAngle.value, [0, 1, 0]);
    }

    placeMemberOnScene(sphere);

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

    sphere.draw(shaders[shaderType.value]);

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
  }
}
export { useBumpMappingScene }
