<template>
  <q-item v-ripple clickable :to="{ name: routeName }">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" :color="iconColor" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="titleClasses">{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { RouteName } from 'src/router/route-name';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  routeName: RouteName;
  icon?: string;
}
const props = defineProps<EssentialLinkProps>();

const route = useRoute();
const isLinkActive = computed(() => route.name === props.routeName);
const titleClasses = computed(() => [
  'text-weight-bold',
  {
    'text-teal': isLinkActive.value,
    'text-black': !isLinkActive.value,
  },
]);

const iconColor = computed(() => (isLinkActive.value ? 'teal' : 'black'));
</script>
