<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <q-card flat class="q-pa-md">
        <GLCanvas ref="glCanvas" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { ReadonlyVec3 } from 'gl-matrix';
import { useBengalSparklerScene } from 'src/features/lab-08-bengal-sparkler/hooks/use-bengal-sparkler-scene';
const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const viewPos: ReadonlyVec3 = [0, 3, -2];

const setupAnimation = async () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const { runSceneLoop } = await useBengalSparklerScene(glContext,{
    position: viewPos,
    aspect: glCanvas.value.width / glCanvas.value.height,
  });

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
