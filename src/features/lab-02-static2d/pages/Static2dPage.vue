<template>
  <q-page padding>
    <div
      class="column
        q-gutter-lg
        items-center
        justify-center"
    >
<!--      layout doesnt work without q-card as containers-->
        <q-card flat class="bg-black q-pa-xs">
          <GLCanvas ref="quadCanvas" />
        </q-card>
        <q-card flat class="bg-black q-pa-xs">
          <GLCanvas ref="triangleCanvas" />
        </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GLCanvas from 'src/shared/components/webgl/GLCanvas.vue';
import { onMounted, Ref, ref } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';
import { useQuadScene } from 'src/features/lab-02-static2d/hooks/use-quad-scene';
import { useTriangleScene } from 'src/features/lab-02-static2d/hooks/use-triangle-scene';

const quadCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);
const triangleCanvas: Ref<MaybeUndefined<typeof GLCanvas>> = ref(undefined);


const run = () => {
  if (!quadCanvas.value || !quadCanvas.value.glContext) {
    console.log('No canvas context found for quad scene')
  } else {
    const {
      runScene: runQuadScene
    } = useQuadScene(quadCanvas.value);
    runQuadScene();
  }

  if (!triangleCanvas.value || !triangleCanvas.value.glContext) {
    console.log('No canvas context found for triangle scene')
  } else {
    const {
      runScene: runTriangleScene
    } = useTriangleScene(triangleCanvas.value);
    runTriangleScene()
  }
}

onMounted(run)

</script>
