<template>
  <q-page>
    <div class="row">
      <GLCanvas ref="pentagonCanvas" />
    </div>
    <div class="row">
      <GLCanvas ref="cubeCanvas" />
    </div>
    <div class="row">
      <GLCanvas ref="quadCanvas" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { usePentagonScene } from 'src/features/lab-03-static2d3d/hooks/use-pentagon-scene';
import { useCubeScene } from 'src/features/lab-03-static2d3d/hooks/use-cube-scene';
import { useStrippedQuadScene } from 'src/features/lab-03-static2d3d/hooks/use-stripped-quad-scene';

const pentagonCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);
const cubeCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);
const quadCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);


const run = () => {
  if (!pentagonCanvas.value || !pentagonCanvas.value.glContext) {
    console.log('No canvas context found for quad scene')
  } else {
    const {
      runScene: runPentagonScene
    } = usePentagonScene(pentagonCanvas.value);
    runPentagonScene();
  }
  if (!cubeCanvas.value || !cubeCanvas.value.glContext) {
    console.log('No canvas context found for cube scene')
  } else {
    const {
      runScene: runCubeScene
    } = useCubeScene(cubeCanvas.value);
    runCubeScene();
  }
  if (!quadCanvas.value || !quadCanvas.value.glContext) {
    console.log('No canvas context found for cube scene')
  } else {
    const {
      runScene: runQuadScene
    } = useStrippedQuadScene(quadCanvas.value);
    runQuadScene();
  }
}

onMounted(run)

</script>
