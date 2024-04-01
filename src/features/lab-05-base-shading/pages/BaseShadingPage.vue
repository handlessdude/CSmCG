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
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { glMatrix, ReadonlyVec3 } from 'gl-matrix';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { useBaseShadingScene } from 'src/features/lab-05-base-shading/hooks/use-base-shading-scene';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { setKeyboardListener } from 'src/features/lab-05-base-shading/utils/keyboard-controller';
import { vertexShaderSource } from 'src/shared/resources/shaders/phong/vertex-shader';
import { fragmentShaderSource } from 'src/shared/resources/shaders/phong/fragment-shader';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const setupAnimation = () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const program = new BaseShaderProgram(
    vertexShaderSource,
    fragmentShaderSource,
    glContext
  );

  const viewPos: ReadonlyVec3 = [0, 5, -15];
  setupCamera(program,{
      eye: viewPos,
      center: [0, 0, 0],
      up: [0, 1, 0],
    },
    {
      fovy: glMatrix.toRadian(45),
      aspect: glCanvas.value.width / glCanvas.value.height,
      nearPlane: 0.1,
      farPlane: 1000.0,
    }
  )

  const {
    runSceneLoop,
    cubeRotate,
    groupSelfRotate,
    groupAbsRotate
  } = useBaseShadingScene(
    program,
    viewPos as unknown as Float32List,
    viewPos as unknown as Float32List
  )

  setKeyboardListener(cubeRotate, groupSelfRotate, groupAbsRotate);

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
