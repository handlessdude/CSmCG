<template>
  <q-page padding>
    <div class="row q-gutter-lg">
      <q-card flat class="q-pa-md">
        <GLCanvas ref="glCanvas" />
      </q-card>
      <q-card flat class="q-pa-md full-height col">
        <q-card-section class="no-padding q-mb-md">
          <div class="text-body1 text-bold">
            Settings
          </div>
        </q-card-section>
        <q-card-section class="no-padding q-mb-sm">
          <div class="text-body2">Ambient light strength</div>
          <q-slider
            v-model="lightAmbientStrength"
            :min="0.0"
            :max="1.0"
            :step="0.1"
            label
          />
        </q-card-section>
        <q-card-section class="no-padding q-mb-sm">
          <div class="text-body2 q-mb-sm">Shader</div>
          <div class="q-gutter-sm">
            <q-radio dense v-model="currentShaderType" :val="ShaderType.PHONG" label="Phong" />
            <q-radio dense v-model="currentShaderType" :val="ShaderType.GOURAD" label="Gourad" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { computed, onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { ReadonlyVec3 } from 'gl-matrix';
import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { useBaseShadingScene } from 'src/features/lab-05-base-shading/hooks/use-base-shading-scene';
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
import { ShaderType } from 'src/features/lab-05-base-shading/resources/shader-type';

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

const currentShaderType = ref(ShaderType.PHONG);

const setupAnimation = () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const shaders: {
    [shaderType in ShaderType]: BaseShaderProgram
  } = {
    [ShaderType.PHONG] : new BaseShaderProgram(
      phongVertexShaderSource,
      phongFragmentShaderSource,
      glContext
    ),
    [ShaderType.GOURAD]: new BaseShaderProgram(
      gouradVertexShaderSource,
      gouradFragmentShaderSource,
      glContext
    )
  }

  const {
    runSceneLoop,
    cubeRotate,
    groupSelfRotate,
    groupAbsRotate
  } = useBaseShadingScene(
    shaders,
    currentShaderType,
    lantern,
    {
      position: viewPos,
      aspect: glCanvas.value.width / glCanvas.value.height,
    }
  )

  setKeyboardListener(cubeRotate, groupSelfRotate, groupAbsRotate);

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
