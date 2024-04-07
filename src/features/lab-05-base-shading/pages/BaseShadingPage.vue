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
        <q-separator spaced/>
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
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 q-mb-sm">Shader type</div>
          <div class="q-gutter-sm">
            <q-radio dense v-model="currentShaderType" :val="ShaderType.PHONG" label="Phong" />
            <q-radio dense v-model="currentShaderType" :val="ShaderType.GOURAD" label="Gourad" />
          </div>
        </q-card-section>
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 q-mb-sm">Lighting model</div>
          <div class="q-gutter-sm">
            <q-radio
              dense
              v-model="currentLightingModelType"
              :val="LightingModelType.PHONG"
              label="Phong"
            />
            <q-radio
              dense
              v-model="currentLightingModelType"
              :val="LightingModelType.LAMBERT"
              label="Lambert"
            />
            <q-radio
              dense
              v-model="currentLightingModelType"
              :val="LightingModelType.BLINN_PHONG"
              label="Blinn-Phong"
            />
<!--            <q-radio
              dense
              v-model="currentLightingModelType"
              :val="LightingModelType.TOON_SHADING"
              label="Toon Shading"
            />-->
          </div>
        </q-card-section>
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 q-mb-sm">Attenuation</div>
          <div class="row no-wrap q-gutter-md q-mb-sm">
            <q-badge color="secondary">k0</q-badge>
            <q-slider
              v-model="currentAttenuation[0]"
              :min="attenuationConfig.min"
              :max="attenuationConfig.max"
              :step="attenuationConfig.step"
              label
            />
          </div>
          <div class="row no-wrap q-gutter-md q-mb-sm">
            <q-badge color="secondary">k1</q-badge>
            <q-slider
              v-model="currentAttenuation[1]"
              :min="0.0"
              :max="attenuationConfig.max"
              :step="attenuationConfig.step"
              label
            />
          </div>
          <div class="row no-wrap q-gutter-md q-mb-sm">
            <q-badge color="secondary">k2</q-badge>
            <q-slider
              v-model="currentAttenuation[2]"
              :min="0.0"
              :max="attenuationConfig.max"
              :step="attenuationConfig.step"
              label
            />
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
import { LightingModelType } from 'src/features/lab-05-base-shading/resources/lighting-model-type';

const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const viewPos: ReadonlyVec3 = [0, 3, -15];

const attenuationConfig = {
  min: 0.001,
  max: 1.0,
  step: 0.001,
}

const lantern = new PointLightSource(
  viewPos,
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
const currentLightingModelType = ref(LightingModelType.PHONG);

const currentAttenuation = ref({
  0: attenuationConfig.max,
  1: 0.01,
  2: 0.0,
});

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
    lantern,
    {
      position: viewPos,
      aspect: glCanvas.value.width / glCanvas.value.height,
    },
    currentShaderType,
    currentLightingModelType,
    currentAttenuation
  )

  setKeyboardListener(cubeRotate, groupSelfRotate, groupAbsRotate);

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
