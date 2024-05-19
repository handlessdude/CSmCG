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
  POSITIONSIZE: 3,
  TEXTURECOORDSIZE: 2,
}

class Spark {
  static sparksCount =200;

  // задаём направление полёта искры в градусах, от 0 до 360
  angle = Math.random() * 360;
  // радиус - это расстояние, которое пролетит искра
  radius = Math.random();

  // у каждой искры своя скорость. multiplier подбирается эмпирически
  multiplier = 125 + Math.random() * 125;

  // время создания искры
  timeFromCreation = performance.now();

  xMax = 0;
  yMax = 0;

  dx = 0;
  dy = 0;

  x = 0;
  y = 0;

  init(){
    // отмеряем точки на окружности - максимальные координаты искры
    this.xMax = Math.cos(this.angle) * this.radius;
    this.yMax = Math.sin(this.angle) * this.radius;

    // dx и dy - приращение искры за вызов отрисовки, то есть её скорость,
    this.dx = this.xMax / this.multiplier;
    this.dy = this.yMax / this.multiplier;

    // Для того, чтобы не все искры начинали движение из начала координат,
    // делаем каждой искре свой отступ, но не более максимальных значений.
    this.x = (this.dx * 1000) % this.xMax;
    this.y = (this.dy * 1000) % this.yMax;
  }

  move(time: number) {
    // находим разницу между вызовами отрисовки, чтобы анимация работала
    // одинаково на компьютерах разной мощности
    const timeShift = time - this.timeFromCreation;
    this.timeFromCreation = time;
    // приращение зависит от времени между отрисовками
    const speed = timeShift;
    this.x += this.dx * speed;
    this.y += this.dy * speed;
    // если искра достигла конечной точки, запускаем её заново из начала координат
    if (Math.abs(this.x) > Math.abs(this.xMax) || Math.abs(this.y) > Math.abs(this.yMax)) {
      this.init();
      return;
    }
  }
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

  /*  const colors = [];
    const positionsFromCenter = [];
    for (let i = 0; i < positions.length; i += 3) {
      // для каждой координаты добавляем точку начала координат, чтобы получить след искры
      positionsFromCenter.push(0, 0, 0);
      positionsFromCenter.push(positions[i], positions[i + 1], positions[i + 2]);
      // цвет в начале координат будет белый (горячий), а дальше будет приближаться к оранжевому
      colors.push(
        1, 1, 1,
        0.47, 0.31, 0.24,
      );
    }*/

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
    const bytesPerAttr = 3;
    glContext.enableVertexAttribArray(sparkPosLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, sparksPositionsBuffer);
    glContext.vertexAttribPointer(
      sparkPosLocation,
      bytesPerAttr,
      glContext.FLOAT,
      false,
      bytesPerAttr * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
      0 // Offset from the beginning of a single vertex to this attribute
    );
    glContext.activeTexture(particleTexture.textureUnit);
    glContext.bindTexture(glContext.TEXTURE_2D, particleTexture.texture);
    bengalParticleShader.setInteger('u_pointTexture', particleTextureUnitIdx);
    glContext.drawArrays(glContext.POINTS, 0, sparksPositions.length / 3)
  };

  const initTracks = () => {
    if (!bengalParticleTrackShader.program) throw new Error('no tracks program');
    const positionAttributeLocationTrack = glContext.getAttribLocation(
      bengalParticleTrackShader.program,
      attributes.vertPosition
    );
    const colorAttributeLocationTrack = glContext.getAttribLocation(
      bengalParticleTrackShader.program,
      attributes.vertColor
    );
    return {
      positionAttributeLocationTrack,
      colorAttributeLocationTrack
    }
  };

  const loop = () => {
    timer.updateDelta();

    bengalParticleShader.use();

    bengalParticleShader.setMat4(uniforms.mWorld, worldMatrix);
    bengalParticleShader.setMat4(uniforms.mView, viewMatrix);
    bengalParticleShader.setMat4(uniforms.mProj, projMatrix)

    bengalParticleShader.glContext.clearColor(
      ...(palette.darkBlue as [number, number, number]),
      1.0
    );
    bengalParticleShader.glContext.clear(
      bengalParticleShader.glContext.DEPTH_BUFFER_BIT
      | bengalParticleShader.glContext.COLOR_BUFFER_BIT
    );

    drawSparks();

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
