<template>
  <div class="text-body1 row items-center no-wrap" style="width: fit-content">
    <q-icon v-if="icon" :name="icon" class="q-mr-md" />
    <div>
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface ParagraphTitleProps {
  icon?: string;
  text: string;
}

defineProps<ParagraphTitleProps>();
</script>

<style scoped lang="scss"></style>
