<template>
  <q-page padding>
    <div class="row justify-center items-center">
      <q-card flat class="q-pa-md">
        <GLCanvas ref="glCanvas" :depth-test="false"/>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { ReadonlyVec3 } from 'gl-matrix';
import { useSmokeScene } from 'src/features/lab-08-smoke/hooks/use-smoke-scene';
const glCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);

const viewPos: ReadonlyVec3 = [0, 200, 500];
const lookAt: ReadonlyVec3 = [0, 100, 0];

const setupAnimation = async () => {
  if (!glCanvas.value || !glCanvas.value.glContext) {
    throw new Error('No canvas context found')
  }

  const glContext = glCanvas.value.glContext as WebGL2RenderingContext;

  const { runSceneLoop } = await useSmokeScene(glContext,{
    position: viewPos,
    lookAt,
    aspect: glCanvas.value.width / glCanvas.value.height,
  });

  runSceneLoop()
};

onMounted(setupAnimation)
</script>
