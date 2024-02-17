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
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
