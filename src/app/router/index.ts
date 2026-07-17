import { createRouter, createWebHistory } from 'vue-router';

import { BillingPage } from '@/pages/billing-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { DatasetsPage } from '@/pages/datasets-page';
import { IntegrationsPage } from '@/pages/integrations-page';
import { PredictionsPage } from '@/pages/predictions-page';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/datasets' },
    { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/integrations', component: IntegrationsPage, meta: { requiresAuth: true } },
    { path: '/datasets', component: DatasetsPage, meta: { requiresAuth: true } },
    { path: '/predictions', component: PredictionsPage, meta: { requiresAuth: true } },
    { path: '/billing', component: BillingPage, meta: { requiresAuth: true } },
  ],
});

/**
 * Глобальный навигационный хук защиты роутов
 */
// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore();
//
//   // При первой загрузке приложения проверяем куку сессии через /user/me
//   if (userStore.isLoading.value) {
//     await userStore.initAuth();
//   }
//
//   // Если роут приватный, а пользователь не авторизован — уводим на бэк-редирект
//   if (to.meta.requiresAuth && !userStore.isAuthenticated.value) {
//     userStore.login();
//   } else {
//     next();
//   }
// });
