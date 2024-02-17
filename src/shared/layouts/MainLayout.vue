<template>
  <q-layout view="lHh Lpr lFf" class="bg-dull">
    <q-header elevated>
      <q-toolbar class="bg-teal-7">
        <q-btn
          flat
          dense
          round
          icon="linear_scale"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App Template</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :show-if-above="false" bordered>
      <q-list>
        <q-item-label header> Color correction</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouteName } from 'src/router/route-name';
import EssentialLink, {
  EssentialLinkProps,
} from 'src/shared/components/EssentialLink.vue';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    routeName: RouteName.DASHBOARD,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss"></style>
