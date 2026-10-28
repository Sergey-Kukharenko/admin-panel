import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { useUserStore } from '@/entities/user';
import { ROUTE_NAMES } from '@/shared/config';
import type { IconName } from '@/shared/ui/app-icon';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    /** i18n key of the header title; also the sidebar label */
    titleKey?: string;
    /** Sidebar item; items follow the order of `routes` */
    nav?: { icon: IconName };
  }
}

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: ROUTE_NAMES.datasets } },
  {
    path: '/dashboard',
    name: ROUTE_NAMES.dashboard,
    component: () => import('@/pages/dashboard').then((m) => m.DashboardPage),
    meta: { requiresAuth: true, titleKey: 'layout.nav.dashboard', nav: { icon: 'function-line' } },
  },
  {
    path: '/integrations',
    name: ROUTE_NAMES.integrations,
    component: () => import('@/pages/integrations').then((m) => m.IntegrationsPage),
    meta: {
      requiresAuth: true,
      titleKey: 'layout.nav.integrations',
      nav: { icon: 'connector-line' },
    },
  },
  {
    path: '/integrations/:type',
    name: ROUTE_NAMES.integrationDetail,
    component: () => import('@/pages/integration-detail').then((m) => m.IntegrationDetailPage),
    meta: { requiresAuth: true, titleKey: 'layout.nav.integrations' },
  },
  {
    path: '/datasets',
    name: ROUTE_NAMES.datasets,
    component: () => import('@/pages/datasets').then((m) => m.DatasetsPage),
    meta: {
      requiresAuth: true,
      titleKey: 'layout.nav.datasets',
      nav: { icon: 'folder-check-line' },
    },
  },
  {
    path: '/predictions',
    name: ROUTE_NAMES.predictions,
    component: () => import('@/pages/predictions').then((m) => m.PredictionsPage),
    meta: {
      requiresAuth: true,
      titleKey: 'layout.nav.predictions',
      nav: { icon: 'sparkling-line' },
    },
  },
  {
    path: '/billing',
    name: ROUTE_NAMES.billing,
    component: () => import('@/pages/billing').then((m) => m.BillingPage),
    meta: { requiresAuth: true, titleKey: 'layout.nav.billing', nav: { icon: 'receipt-line' } },
  },
  {
    path: '/profile',
    name: ROUTE_NAMES.profile,
    component: () => import('@/pages/profile').then((m) => m.ProfilePage),
    meta: { requiresAuth: true, titleKey: 'layout.userMenu.profile' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
    meta: { requiresAuth: true, titleKey: 'notFound.title' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Бэк уже вернул ошибку авторизации — показываем экран ошибки (App.vue), а не уходим
    // на логин снова: иначе при живой сессии Authentik страница перезагружается по кругу
    if (userStore.authError) return true;

    userStore.login();

    return false;
  }

  return true;
});
