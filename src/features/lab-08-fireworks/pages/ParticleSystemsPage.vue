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
          <div class="text-body2 text-bold q-mb-sm">Lighting model</div>
          <div class="q-gutter-sm">
            <q-radio
              dense
              v-model="particleSystemType"
              :val="ParticleSystemType.BENGAL_LIGHT"
              :label="ParticleSystemType.BENGAL_LIGHT"
            />
            <q-radio
              dense
              v-model="particleSystemType"
              :val="ParticleSystemType.FIREWORKS"
              :label="ParticleSystemType.FIREWORKS"
            />
            <q-radio
              dense
              v-model="particleSystemType"
              :val="ParticleSystemType.SMOKE"
              :label="ParticleSystemType.SMOKE"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { ReadonlyVec3 } from 'gl-matrix';
import { ParticleSystemType } from 'src/features/lab-08-fireworks/particle-system-type';
import { useParticleSystemsScene } from 'src/features/lab-08-fireworks/hooks/use-particle-systems-scene';
const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const viewPos: ReadonlyVec3 = [0, 3, -2];

const particleSystemType = ref(ParticleSystemType.BENGAL_LIGHT);

const setupAnimation = async () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const { runSceneLoop } = await useParticleSystemsScene(glContext,{
    position: viewPos,
    aspect: glCanvas.value.width / glCanvas.value.height,
  });

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
