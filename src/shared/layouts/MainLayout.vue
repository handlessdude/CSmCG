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

        <q-toolbar-title> CSmCG </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :show-if-above="false" bordered>
      <q-list>
        <q-item-label header> Menu</q-item-label>
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
  {
    title: 'Lab 01. Cube',
    icon: 'view_in_ar',
    routeName: RouteName.ROTATING_CUBE_O1,
  },
  {
    title: 'Lab 02. Static2d',
    icon: 'square',
    routeName: RouteName.STATIC_2D_02,
  },
  {
    title: 'Lab 03. Static2d3d',
    icon: 'texture',
    routeName: RouteName.STATIC_2D_3D_03,
  },
  {
    title: 'Lab 04. Pedestal',
    icon: 'leaderboard',
    routeName: RouteName.PEDESTAL,
  },
  {
    title: 'Lab 05. Base Shading',
    icon: 'leaderboard',
    routeName: RouteName.BASE_SHADING,
  },
  {
    title: 'Lab 06. Textures',
    icon: 'leaderboard',
    routeName: RouteName.TEXTURES,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss"></style>
