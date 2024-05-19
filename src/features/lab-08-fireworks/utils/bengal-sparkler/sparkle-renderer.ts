import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import {
  bengalParticleVertSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particles/particleVert';
import {
  bengalParticleFragSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particles/particleFrag';
import { BUFFERS_CONFIG } from 'src/features/lab-08-fireworks/resources/buffers-config';
import { loadImage } from 'src/shared/utils/resource-loaders/image-loader';
import { createTexture } from 'src/shared/utils/webgl/create-texture';

const useSparksRenderer = async (
  glContext: WebGL2RenderingContext,
  config: {
    worldMatrix: Float32Array,
    viewMatrix: Float32Array,
    projMatrix: Float32Array,
    particleTextureSrc: string,
  },
) => {
  const bengalParticleShader = new BaseShaderProgram(
    bengalParticleVertSource,
    bengalParticleFragSource,
    glContext
  );

  const initSparks = () => {
    if (!bengalParticleShader.program) throw new Error('no sparks program');
    const sparkPosLocation = glContext.getAttribLocation(
      bengalParticleShader.program,
      attributes.vertPosition
    );

    const vertexBufferObject = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBufferObject);

    return {
      sparkPosLocation,
      sparksPositionsBuffer: vertexBufferObject,
    }
  };

  const {
    sparkPosLocation,
    sparksPositionsBuffer
  } = initSparks();

  const particleTextureImage = await loadImage(config.particleTextureSrc)

  const particleTextureUnitIdx = 0;
  const particleTexture = createTexture(
    glContext,
    particleTextureImage,
    particleTextureUnitIdx,
  );

  const drawSparks = (sparksPositions: number[]) => {
    bengalParticleShader.use();

    bengalParticleShader.setMat4(uniforms.mWorld, config.worldMatrix);
    bengalParticleShader.setMat4(uniforms.mView, config.viewMatrix);
    bengalParticleShader.setMat4(uniforms.mProj, config.projMatrix)

    glContext.enableVertexAttribArray(sparkPosLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, sparksPositionsBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(sparksPositions), glContext.STATIC_DRAW);
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

  return {
    drawSparks
  }
}

export {
  useSparksRenderer
}
