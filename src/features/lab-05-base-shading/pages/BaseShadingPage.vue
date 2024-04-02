<template>
  <q-page padding>
    <div class="row q-gutter-lg">
      <q-card flat class="q-pa-md">
        <GLCanvas ref="glCanvas" />
      </q-card>
      <q-card flat class="q-pa-md full-height col">
        <q-card-section class="no-padding q-mb-md">
          <div class="text-body1">
            Settings
          </div>
        </q-card-section>
        <q-card-section class="no-padding">
          <div class="text-body2">Ambient light strength</div>
          <q-slider
            v-model="lightAmbientStrength"
            :min="0.0"
            :max="1.0"
            :step="0.1"
            label
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { computed, onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { glMatrix, ReadonlyVec3 } from 'gl-matrix';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { useBaseShadingScene } from 'src/features/lab-05-base-shading/hooks/use-base-shading-scene';
import { setupCamera } from 'src/shared/utils/webgl/setup-camera';
import { setKeyboardListener } from 'src/features/lab-05-base-shading/utils/keyboard-controller';
import {
  vertexShaderSource as phongVertexShaderSource
} from 'src/shared/resources/shaders/phong/vertex-shader';
import {
  fragmentShaderSource as phongFragmentShaderSource
} from 'src/shared/resources/shaders/phong/fragment-shader';
import {
  vertexShaderSource as gouradVertexShaderSource
} from 'src/shared/resources/shaders/gourad/vertex-shader';
import {
  fragmentShaderSource as gouradFragmentShaderSource
} from 'src/shared/resources/shaders/gourad/fragment-shader';

import { PointLightSource } from 'src/shared/entities/light-source/point-light-source';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const viewPos: ReadonlyVec3 = [0, 5, -15];

const lightPos: ReadonlyVec3 = [0, 3, -15];

const lantern = new PointLightSource(
  lightPos,
  {
    color: [1.0, 1.0, 1.0],
    strength: 0.2,
  },
  {
    color: [1.0, 1.0, 1.0],
  },
  {
    color: [1.0, 1.0, 1.0],
    strength: 0.9,
  });

const lightAmbientStrength = computed({
  get: () => lantern.ambient.strength,
  set: (newVal) => {
    lantern.ambient.strength = newVal;
    console.log(`Update lightAmbientStrength: ${newVal}`)
  }
});

const setupAnimation = () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const phongShader = new BaseShaderProgram(
    phongVertexShaderSource,
    phongFragmentShaderSource,
    glContext
  );
  /*  const gouradShader = new BaseShaderProgram(
    gouradVertexShaderSource,
    gouradFragmentShaderSource,
    glContext
  );*/


  const {
    viewMatrix,
    projMatrix
  } = setupCamera(phongShader,{
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

  phongShader.setViewMat(viewMatrix);
  phongShader.setProjMat(projMatrix)

  const {
    runSceneLoop,
    cubeRotate,
    groupSelfRotate,
    groupAbsRotate
  } = useBaseShadingScene(
    phongShader,
    lantern,
    viewPos as unknown as Float32List
  )

  setKeyboardListener(cubeRotate, groupSelfRotate, groupAbsRotate);

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
