import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { fireworkParticleVertSource } from 'src/shared/resources/shaders/particle-systems/fireworks/particleVert';
import { fireworkParticleFragSource } from 'src/shared/resources/shaders/particle-systems/fireworks/particleFrag';
import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import { loadImage } from 'src/shared/utils/resource-loaders/image-loader';
import { createTexture } from 'src/shared/utils/webgl/create-texture';
import { BUFFERS_CONFIG } from 'src/features/lab-08-bengal-sparkler/resources/buffers-config';

const useFireworkParticleRenderer = async (
  glContext: WebGL2RenderingContext,
  config: {
    worldMatrix: Float32Array,
    viewMatrix: Float32Array,
    projMatrix: Float32Array,
    particleTextureSrc: string,
}) => {
  const particleShader = new BaseShaderProgram(
    fireworkParticleVertSource,
    fireworkParticleFragSource,
    glContext
  );
  if (!particleShader.program) throw new Error('no sparks program');

  const initParticleBuffers = () => {
    const posLocation = glContext.getAttribLocation(
      <WebGLProgram>particleShader.program,
      attributes.vertPosition
    );

    const colorLocation = glContext.getAttribLocation(
      <WebGLProgram>particleShader.program,
      attributes.vertColor
    );

    const sizeLocation = glContext.getAttribLocation(
      <WebGLProgram>particleShader.program,
      attributes.vertSize
    );

    const posBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, posBuffer);

    const colorBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);

    const sizeBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, sizeBuffer);

    return {
      posLocation, posBuffer,
      colorLocation, colorBuffer,
      sizeLocation, sizeBuffer
    }
  }

  const {
    posLocation, posBuffer,
    colorLocation, colorBuffer,
    sizeLocation, sizeBuffer
  } = initParticleBuffers();

  if (!posBuffer) throw new Error('no pos buffer');
  if (!colorBuffer) throw new Error('no color buffer');
  if (!sizeBuffer) throw new Error('no size buffer');

  const initTextures = async () => {
    const particleImage = await loadImage(config.particleTextureSrc)
    const particleUnitIdx = 1;
    const particleTexture = createTexture(
      glContext,
      particleImage,
      particleUnitIdx,
    );

    const bindParticleTexture = () => {
      glContext.activeTexture(particleTexture.textureUnit);
      glContext.bindTexture(glContext.TEXTURE_2D, particleTexture.texture);
      particleShader.setInteger('u_pointTexture', particleUnitIdx);
    }

    return {
      bindParticleTexture,
    }
  }

  const { bindParticleTexture } = await initTextures();

  const enableBuffer = (
    loc: number,
    buffer: WebGLBuffer,
    data: number[],
    attrSize: number
  ) => {
    glContext.enableVertexAttribArray(loc);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(data), glContext.DYNAMIC_DRAW);
    glContext.vertexAttribPointer(
      loc,
      attrSize,
      glContext.FLOAT,
      false,
      attrSize * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
  }

  const drawParticles = (
    posData: number[],
    colorData: number[],
    sizeData: number[],
  ) => {
    particleShader.use();

    particleShader.setMat4(uniforms.mWorld, config.worldMatrix);
    particleShader.setMat4(uniforms.mView, config.viewMatrix);
    particleShader.setMat4(uniforms.mProj, config.projMatrix)

    enableBuffer(posLocation, posBuffer, posData, BUFFERS_CONFIG.POSITION_SIZE);
    enableBuffer(posLocation, colorBuffer, colorData, BUFFERS_CONFIG.COLOR_SIZE);
    enableBuffer(posLocation, sizeBuffer, sizeData, BUFFERS_CONFIG.SIZE_SIZE);

    bindParticleTexture();

    glContext.drawArrays(glContext.POINTS, 0, posData.length / 3);

    glContext.disableVertexAttribArray(posLocation);
    glContext.disableVertexAttribArray(colorLocation);
    glContext.disableVertexAttribArray(sizeLocation);
  }

  return {
    drawParticles
  }
}

export {
  useFireworkParticleRenderer
}
