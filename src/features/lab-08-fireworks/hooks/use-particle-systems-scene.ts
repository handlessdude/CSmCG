import { Timer } from 'src/shared/utils/webgl/timer';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { glMatrix, mat4, ReadonlyVec3 } from 'gl-matrix';
import { palette } from 'src/shared/resources/palette';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import {
  bengalParticleVertSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particles/particleVert';
import {
  bengalParticleFragSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particles/particleFrag';

import { loadImage } from 'src/shared/utils/resource-loaders/image-loader';
import { createTexture } from 'src/shared/utils/webgl/create-texture';
import {
  bengalParticleTrackVertSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particle-tracks/trackVert';
import {
  bengalParticleTrackFragSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particle-tracks/trackFrag';

const BUFFERS_CONFIG = {
  POSITION_SIZE: 3,
  COLOR_SIZE: 3,
  TRACK_SIZE: 6,
  UV_SIZE: 2,
}

const useParticleSystemsScene = async (
  glContext: WebGL2RenderingContext,
  camera: {
    position: ReadonlyVec3,
    aspect: number,
  },
) => {
  const bengalParticleShader = new BaseShaderProgram(
    bengalParticleVertSource,
    bengalParticleFragSource,
    glContext
  );

  const bengalParticleTrackShader = new BaseShaderProgram(
    bengalParticleTrackVertSource,
    bengalParticleTrackFragSource,
    glContext
  );

  const {
    viewMatrix,
    projMatrix
  } = setupCamera({
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

  const particleTextureSrc = '/src/assets/textures/clown-emoji.png';
  const particleTextureImage = await loadImage(particleTextureSrc)

  const particleTextureUnitIdx = 0;
  const particleTexture = createTexture(
    glContext,
    particleTextureImage,
    particleTextureUnitIdx,
  );

  const worldMatrix = new Float32Array(16);
  mat4.identity(worldMatrix);

  const sparksPositions = [
    1, 0, 0,
    -1, 0.5, 0,
    -0.5, -1, 0
  ];

  const tracksColors: number[] = [];
  const tracksPositions: number[] = [];
  for (let i = 0; i < sparksPositions.length; i += 3) {
    tracksPositions.push(
      // для каждой координаты добавляем точку начала координат, чтобы получить след искры
      0, 0, 0,
      sparksPositions[i], sparksPositions[i + 1], sparksPositions[i + 2]
    );
    // цвет в начале координат будет белый (горячий), а дальше будет приближаться к оранжевому
    tracksColors.push(
      1, 1, 1,
      // 0.47, 0.31, 0.24,
      1, 0, 0,
    );
  }

  const initSparks = () => {
    if (!bengalParticleShader.program) throw new Error('no sparks program');
    const sparkPosLocation = glContext.getAttribLocation(
      bengalParticleShader.program,
      attributes.vertPosition
    );

    const vertexBufferObject = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferObject);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(sparksPositions), glContext.STATIC_DRAW);

    return {
      sparkPosLocation,
      sparksPositionsBuffer: vertexBufferObject,
    }
  };

  const {
    sparkPosLocation,
    sparksPositionsBuffer
  } = initSparks();

  const drawSparks = () => {
    bengalParticleShader.use();

    bengalParticleShader.setMat4(uniforms.mWorld, worldMatrix);
    bengalParticleShader.setMat4(uniforms.mView, viewMatrix);
    bengalParticleShader.setMat4(uniforms.mProj, projMatrix)

    glContext.enableVertexAttribArray(sparkPosLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, sparksPositionsBuffer);
    glContext.vertexAttribPointer(
      sparkPosLocation,
      BUFFERS_CONFIG.POSITION_SIZE,
      glContext.FLOAT,
      false,
      BUFFERS_CONFIG.POSITION_SIZE * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    glContext.activeTexture(particleTexture.textureUnit);
    glContext.bindTexture(glContext.TEXTURE_2D, particleTexture.texture);
    bengalParticleShader.setInteger('u_pointTexture', particleTextureUnitIdx);
    glContext.drawArrays(glContext.POINTS, 0, sparksPositions.length / 3);

    glContext.disableVertexAttribArray(sparkPosLocation);
  };

  const initTracks = () => {
    if (!bengalParticleTrackShader.program) throw new Error('no tracks program');
    const trackPosLocation = glContext.getAttribLocation(
      bengalParticleTrackShader.program,
      attributes.vertPosition
    );
    const trackColorLocation = glContext.getAttribLocation(
      bengalParticleTrackShader.program,
      attributes.vertColor
    );

    const tracksPositionsBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksPositionsBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(tracksPositions), glContext.STATIC_DRAW);

    const tracksColorsBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksColorsBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(tracksColors), glContext.STATIC_DRAW);

    return {
      trackPosLocation,
      trackColorLocation,
      tracksPositionsBuffer,
      tracksColorsBuffer
    }
  };

  const {
    trackPosLocation,
    trackColorLocation,
    tracksPositionsBuffer,
    tracksColorsBuffer
  } = initTracks();

  const drawTracks = () => {
    bengalParticleTrackShader.use();

    bengalParticleTrackShader.setMat4(uniforms.mWorld, worldMatrix);
    bengalParticleTrackShader.setMat4(uniforms.mView, viewMatrix);
    bengalParticleTrackShader.setMat4(uniforms.mProj, projMatrix)

    glContext.enableVertexAttribArray(trackPosLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksPositionsBuffer);
    glContext.vertexAttribPointer(
      trackPosLocation,
      BUFFERS_CONFIG.POSITION_SIZE,
      glContext.FLOAT,
      false,
      BUFFERS_CONFIG.POSITION_SIZE * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );

    glContext.enableVertexAttribArray(trackColorLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksColorsBuffer);
    glContext.vertexAttribPointer(
      trackColorLocation,
      BUFFERS_CONFIG.COLOR_SIZE,
      glContext.FLOAT,
      false,
      BUFFERS_CONFIG.COLOR_SIZE * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );

    glContext.drawArrays(glContext.LINES, 0, tracksPositions.length / 3);

    glContext.disableVertexAttribArray(trackPosLocation);
    glContext.disableVertexAttribArray(trackColorLocation);
  };


  const loop = () => {
    timer.updateDelta();

    glContext.clearColor(
      ...(palette.darkBlue as [number, number, number]),
      1.0
    );
    glContext.clear(
      bengalParticleShader.glContext.DEPTH_BUFFER_BIT
      | bengalParticleShader.glContext.COLOR_BUFFER_BIT
    );

    drawSparks();
    drawTracks();

    requestAnimationFrame(loop);
  };

  const runSceneLoop = () => {
    timer.init();

    bengalParticleShader.glContext.enable(bengalParticleShader.glContext.BLEND);
    bengalParticleShader.glContext.blendFunc(
      bengalParticleShader.glContext.SRC_ALPHA,
      bengalParticleShader.glContext.ONE
    );
    requestAnimationFrame(loop);
  }

  return {
    runSceneLoop,
  }
}
export { useParticleSystemsScene }
