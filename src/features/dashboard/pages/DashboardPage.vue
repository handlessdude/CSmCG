<template>
  <q-page padding class="row">
    <div class="column full-width q-gutter-y-md">
      <q-banner rounded class="q-pa-md">
        <div class="text-h6">Dashboard</div>
      </q-banner>
      <div class="overflow-auto">
        <div class="row workfield__container q-gutter-md">
          <q-card flat class="q-pa-md column full-width">
            <NoImagePlaceholder />
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import NoImagePlaceholder from 'components/NoImagePlaceholder.vue';
</script>

<style scoped lang="scss">
.half-opacity {
  opacity: 0.5;
}

.q-table__title {
  font-weight: 500;
}

.q-table__top {
  padding-left: 0;
  padding-right: 0;
}

.q-table__container {
  color: $basic-dark !important;
}
</style>
