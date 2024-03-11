<template>
  <q-page>
    <div class="row">
      <GLCanvas ref="pentagonCanvas" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { usePentagonScene } from 'src/features/lab-03-static2d3d/hooks/use-pentagon-scene';

const pentagonCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);


const run = () => {
  if (!pentagonCanvas.value || !pentagonCanvas.value.glContext) {
    console.log('No canvas context found for quad scene')
  } else {
    const {
      runScene: runQuadScene
    } = usePentagonScene(pentagonCanvas.value);
    runQuadScene();
  }
}

onMounted(run)

</script>
