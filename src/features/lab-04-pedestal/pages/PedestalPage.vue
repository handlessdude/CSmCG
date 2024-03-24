<template>
  <q-page padding>
    <div class="
        column
        q-gutter-lg
        items-center
        justify-center
      ">
      <q-card flat class="q-pa-xs">
        <GLCanvas ref="glCanvas" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { glMatrix } from 'gl-matrix';
import { setupShaderProgram } from 'src/shared/utils/webgl/setup-shader-program';
import { setupTransformationMatrices } from 'src/shared/utils/webgl';
import { identity } from 'src/shared/resources/identity';
import { usePedestalScene } from 'src/features/lab-04-pedestal/hooks/use-pedestal-scene';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

enum UserControls {
  RotateClockwise = '1',
  RotateCounterclockwise = '2',
}

const setupAnimation = () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  // compile shaders
  const program = setupShaderProgram(
    glContext,
    vertexShaderSource,
    fragmentShaderSource
  ) as WebGLProgram;

  glContext.useProgram(program);

  const {
    worldMatrix,
    matWorldUniformLocation,
  } = setupTransformationMatrices(
    glContext,
    program,
    {
      translation: identity,
      rotation: identity,
      scale: identity,
    },
    {
      eye: [0, 3, -8],
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: glCanvas.value.width / glCanvas.value.height,
      nearPlane: 0.1,
      farPlane: 1000.0,
    },
  )

  const {
    runSceneLoop,
    decAngle,
    incAngle
  } = usePedestalScene(
    program, glContext, worldMatrix, matWorldUniformLocation
  )

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key;
      if (key === UserControls.RotateClockwise) { decAngle(); }
      if (key === UserControls.RotateCounterclockwise) { incAngle(); }
    },
    false,
  );
  runSceneLoop()
};

onMounted(setupAnimation)
</script>
