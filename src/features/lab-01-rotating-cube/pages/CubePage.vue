<template>
  <q-page>
    <GLCanvas ref="glCanvas" />
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';

import { boxIndices, boxVertices } from 'src/shared/resources/box-model';
import { fragmentShaderSource, vertexShaderSource } from 'src/shared/resources/basic-shaders';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { useCubeRotationLoop } from 'src/features/lab-01-rotating-cube/hooks/use-cube-rotation-loop';
import { glMatrix } from 'gl-matrix';
import { setupShaderProgram } from 'src/utils/webgl/setup-shader-program';
import { setupBuffers } from 'src/utils/webgl/setup-buffers';
import { setupTransformationMatrices } from 'src/utils/webgl';
import { identity } from 'src/shared/resources/identity';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);
const setupCubeAnimation = () => {
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

  // setup buffers
  setupBuffers(glContext, program, boxVertices, boxIndices);

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
      eye: [0, 0, -8],
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
    runCubeRotationLoop
  } = useCubeRotationLoop(
    glContext, worldMatrix, matWorldUniformLocation
  )

  runCubeRotationLoop()
};

onMounted(setupCubeAnimation)
</script>
