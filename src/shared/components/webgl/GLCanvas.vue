<template>
  <q-page padding>
    <TableCard>
      <canvas
        ref="glCanvas"
        height="480" width="640" ID="gl-canvas">
        Your browser is for peasants. Get Chrome.
      </canvas>
      <p v-if="showPlaceholder">No WebGL context</p>
    </TableCard>
  </q-page>
</template>

<script setup lang="ts">
import TableCard from 'src/shared/components/TableCard.vue';
import { computed, ref, Ref, watch } from 'vue';
import { MaybeUndefined } from 'src/shared/models/generic';

const glCanvas: Ref<MaybeUndefined<HTMLCanvasElement>> = ref(undefined);

const showPlaceholder = ref(false);

const glContext = computed(() => glCanvas.value?.getContext(
  'webgl2'
) as MaybeUndefined<WebGL2RenderingContext>);
const width = computed(() => glCanvas.value?.width);
const height = computed(() => glCanvas.value?.height);

const setupCanvas = () => {
  if (!glCanvas.value) return;
  if (!glContext.value) {
    showPlaceholder.value = true;
    return;
  }
  console.log('webgl context found:', glContext.value);
  console.log('webgl context supported extensions:',glContext.value.getSupportedExtensions());

  glContext.value.viewport(0, 0, glCanvas.value.width, glCanvas.value.height);
  glContext.value.clearColor(2.55, 2.55, 2.55, 1);
  glContext.value.clear(
    glContext.value.COLOR_BUFFER_BIT | glContext.value.DEPTH_BUFFER_BIT
  );
  glContext.value.enable(glContext.value.DEPTH_TEST);
  glContext.value.enable(glContext.value.CULL_FACE);
  glContext.value.frontFace(glContext.value.CCW);
  glContext.value.cullFace(glContext.value.BACK);
  console.log('canvas setup complete')
};

watch(glCanvas, (val) => {
  if (!val) return;
  setupCanvas();
});

defineExpose({
  glContext,
  width,
  height
})
</script>

<style scoped lang="scss">
canvas {
  margin: auto;
}
</style>
