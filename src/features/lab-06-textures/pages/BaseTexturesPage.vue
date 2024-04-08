<template>
  <q-page id="sosi" padding>
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
          <div class="text-body2 text-bold">Ambient light strength</div>
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
          <div class="text-body2 text-bold q-mb-sm">Shader type</div>
          <div class="q-gutter-sm">
            <q-radio dense v-model="currentShaderType" :val="ShaderType.PHONG" label="Phong" />
            <q-radio dense v-model="currentShaderType" :val="ShaderType.GOURAD" label="Gourad" />
          </div>
        </q-card-section>
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 text-bold q-mb-sm">Lighting model</div>
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
            <q-radio
              dense
              v-model="currentLightingModelType"
              :val="LightingModelType.TOON_SHADING"
              label="Toon Shading"
            />
          </div>
        </q-card-section>
        <q-separator spaced/>
        <q-card-section class="no-padding full-width" horizontal>
          <div class="col">
            <div class="text-body2 text-bold q-mb-sm">Toon coefficients</div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k0</q-badge>
              <q-slider
                v-model="currentToonCoefficients[0]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k1</q-badge>
              <q-slider
                v-model="currentToonCoefficients[1]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k2</q-badge>
              <q-slider
                v-model="currentToonCoefficients[2]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
          </div>
          <q-separator
            vertical
            spaced/>
          <div class="col">
            <div class="text-body2 text-bold q-mb-sm">Toon thresholds</div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k0</q-badge>
              <q-slider
                v-model="currentToonThresholds[0]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k1</q-badge>
              <q-slider
                v-model="currentToonThresholds[1]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
            <div class="row no-wrap q-gutter-md q-mb-sm">
              <q-badge color="secondary">k2</q-badge>
              <q-slider
                v-model="currentToonThresholds[2]"
                :min="0.0"
                :max="1.0"
                :step="0.1"
                label
              />
            </div>
          </div>
        </q-card-section>
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 text-bold q-mb-sm">Attenuation</div>
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
        <q-separator spaced/>
        <q-card-section class="no-padding">
          <div class="text-body2 text-bold q-mb-sm">Texture contribution</div>
          <div class="row">
            <div class="
              col
              column
              no-wrap
              q-gutter-md
              q-mb-sm
            ">
              <div class="row">
<!--                <div class="row text-body2 col justify-center">
                  Color
                </div>-->
                <div class="row text-caption col justify-center">
                  Number texture
                </div>
                <div class="row text-caption col justify-center">
                  Material texture
                </div>
              </div>
<!--              <q-range
                class="q-mt-lg"
                v-model="sliderModel"
                :min="sliderConfig.MIN_PERCENT"
                :max="sliderConfig.MAX_PERCENT"
                :step="sliderConfig.STEP"
                :left-label-value="`${sliderModel.min * toFrac}`"
                :right-label-value="`${sliderModel.max  * toFrac}`"
                label-always
                track-color="blue"
                inner-track-color="transparent"
                selection-color="transparent"
              />-->
              <q-slider
                v-model="sliderModel"
                :min="sliderConfig.MIN_PERCENT"
                :max="sliderConfig.MAX_PERCENT"
                :step="sliderConfig.STEP"
                label
                :label-value="`${sliderModel * toFrac}`"
                label-always
                color="primary"
              />
            </div>
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
import { setKeyboardListener } from 'src/features/lab-05-base-shading/utils/keyboard-controller';
import {
  vertexShaderSource as phongVertexShaderSource
} from 'src/shared/resources/shaders/base-textures/phong/vertex-shader';
import {
  fragmentShaderSource as phongFragmentShaderSource
} from 'src/shared/resources/shaders/base-textures/phong/fragment-shader';
import {
  vertexShaderSource as gouradVertexShaderSource
} from 'src/shared/resources/shaders/base-textures/gourad/vertex-shader';
import {
  fragmentShaderSource as gouradFragmentShaderSource
} from 'src/shared/resources/shaders/base-textures/gourad/fragment-shader';

import { PointLightSource } from 'src/shared/entities/light-source/point-light-source';
import { ShaderType } from 'src/shared/resources/shaders/shader-type';
import { LightingModelType } from 'src/shared/resources/lighting/lighting-model-type';
import { useBaseTexturesScene } from 'src/features/lab-06-textures/hooks/use-base-textures-scene';

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

const currentToonCoefficients = ref({
  0: 0.3,
  1: 0.7,
  2: 0.3,
});

const currentToonThresholds = ref({
  0: 0.0,
  1: 0.4,
  2: 0.7,
});

/*const sliderModel =ref({
  min: 25,
  max: 75
});*/

const sliderModel = ref(50);

const sliderConfig = {
  MIN_PERCENT: 0,
  MAX_PERCENT: 100,
  STEP: 1,
}
const toFrac = 0.01;

/*const colorContribution = computed(() => ({
  color: sliderModel.value.min * toFrac,
  numberTexture: (sliderModel.value.max - sliderModel.value.min) * toFrac,
  materialTexture: (sliderConfig.MAX_PERCENT - sliderModel.value.max) * toFrac,
}))*/

const textureContribution = computed(() => ({
  numberTexture: sliderModel.value * toFrac,
  materialTexture: (sliderConfig.MAX_PERCENT - sliderModel.value) * toFrac,
}))

const textureSources = [
  '/src/assets/textures/artem.png',
  '/src/assets/textures/first.png',
  '/src/assets/textures/second.png',
  '/src/assets/textures/angel.png',
  '/src/assets/textures/third.png',
  '/src/assets/textures/tylko-jedno-w-glowie-mam.png',
]

const loadImage = async (src: string) => {
  console.log(`Loading texture ${src}...`);
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;
  await image.decode();
  return image;
}

const setupAnimation = async () => {
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

  const textureImages = await Promise.all(
    textureSources.map(
      async (src) => [src, await loadImage(src)] as [string, HTMLImageElement]
    )
  );

  const {
    runSceneLoop,
    cubeRotate,
    groupSelfRotate,
    groupAbsRotate
  } = useBaseTexturesScene(
    shaders,
    lantern,
    {
      position: viewPos,
      aspect: glCanvas.value.width / glCanvas.value.height,
    },
    currentShaderType,
    currentLightingModelType,
    currentAttenuation,
    currentToonCoefficients,
    currentToonThresholds,
    textureImages,
    textureContribution
  )

  setKeyboardListener(cubeRotate, groupSelfRotate, groupAbsRotate);

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
