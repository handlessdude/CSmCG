import { RouteRecordRaw } from 'vue-router';
import { RouteName } from 'src/router/route-name';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/shared/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: RouteName.DASHBOARD,
        component: () =>
          import('src/features/dashboard/pages/DashboardPage.vue'),
      },
      {
        path: '/01-rotating-cube',
        name: RouteName.ROTATING_CUBE_O1,
        component: () =>
          import('src/features/lab-01-rotating-cube/pages/CubePage.vue'),
      },
      {
        path: '/02-static2d',
        name: RouteName.STATIC_2D_02,
        component: () =>
          import('src/features/lab-02-static2d/pages/Static2dPage.vue'),
      },
      {
        path: '/03-static2d3d',
        name: RouteName.STATIC_2D_3D_03,
        component: () =>
          import('src/features/lab-03-static2d3d/pages/Static2d3dPage.vue'),
      },
      {
        path: '/04-pedestal',
        name: RouteName.PEDESTAL,
        component: () =>
          import('src/features/lab-04-pedestal/pages/PedestalPage.vue'),
      },
      {
        path: '/05-base-shading',
        name: RouteName.BASE_SHADING,
        component: () =>
          import('src/features/lab-05-base-shading/pages/BaseShadingPage.vue'),
      },
      {
        path: '/06-textures',
        name: RouteName.TEXTURES,
        component: () =>
          import('src/features/lab-06-textures/pages/BaseTexturesPage.vue'),
      },
      {
        path: '/07-bump-mapping',
        name: RouteName.BUMP_MAPPING,
        component: () =>
          import('src/features/lab-07-bump-mapping/pages/BumpMappingPage.vue'),
      },
      {
        path: '/08-bengal-sparkler',
        name: RouteName.BENGAL_SPARKLER,
        component: () =>
          import('src/features/lab-08-bengal-sparkler/pages/BengalSparklerPage.vue'),
      },
      {
        path: '/08-fireworks',
        name: RouteName.FIREWORKS,
        component: () =>
          import('src/features/lab-08-fireworks/pages/FireworksPage.vue'),
      },
      {
        path: '/08-smoke',
        name: RouteName.SMOKE,
        component: () =>
          import('src/features/lab-08-smoke/pages/SmokePage.vue'),
      },
      {
        path: '/08-fountain',
        name: RouteName.FOUNTAIN,
        component: () =>
          import('src/features/lab-08-fountain/pages/FountainPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/features/lab-02-static2d/pages/ErrorNotFound.vue'),
  },
];

export default routes;
