import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';
import { BUFFERS_CONFIG } from 'src/features/lab-08-bengal-sparkler/resources/buffers-config';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import {
  bengalParticleTrackVertSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particle-tracks/trackVert';
import {
  bengalParticleTrackFragSource
} from 'src/shared/resources/shaders/particle-systems/bengal-light/particle-tracks/trackFrag';
import {
  getTracksColors,
  getTracksPositions
} from 'src/features/lab-08-bengal-sparkler/utils/bengal-sparkler/system-manager';

const useTrackRenderer = (
  glContext: WebGL2RenderingContext,
  config: {
    worldMatrix: Float32Array,
    viewMatrix: Float32Array,
    projMatrix: Float32Array,
  }) => {

  const bengalParticleTrackShader = new BaseShaderProgram(
    bengalParticleTrackVertSource,
    bengalParticleTrackFragSource,
    glContext
  );

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

    const tracksColorsBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksColorsBuffer);

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

  const drawTracks = (sparksPositions: number[]) => {
    const tracksPositions = getTracksPositions(sparksPositions);
    const tracksColors = getTracksColors(sparksPositions);

    bengalParticleTrackShader.use();

    bengalParticleTrackShader.setMat4(uniforms.mWorld, config.worldMatrix);
    bengalParticleTrackShader.setMat4(uniforms.mView, config.viewMatrix);
    bengalParticleTrackShader.setMat4(uniforms.mProj, config.projMatrix)

    glContext.enableVertexAttribArray(trackPosLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, tracksPositionsBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(tracksPositions), glContext.STATIC_DRAW);
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
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(tracksColors), glContext.STATIC_DRAW);
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

  return {
    drawTracks
  }
}

export {
  useTrackRenderer
}
