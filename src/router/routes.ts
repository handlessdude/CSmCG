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
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/features/lab-02-static2d/pages/ErrorNotFound.vue'),
  },
];

export default routes;
