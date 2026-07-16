import { createRouter, createWebHistory } from 'vue-router';

import { AuthCallbackPage } from '@/pages/auth-callback';
import { BillingPage } from '@/pages/billing-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { DatasetsPage } from '@/pages/datasets-page';
import { IntegrationsPage } from '@/pages/integrations-page';
import { PredictionsPage } from '@/pages/predictions-page';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/datasets',
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/integrations',
      component: IntegrationsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/datasets',
      component: DatasetsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/predictions',
      component: PredictionsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/billing',
      component: BillingPage,
      meta: { requiresAuth: true },
    },
  ],
});

/**
 * 2. Глобальный навигационный хук (Navigation Guard)
 * Проверяет наличие токена перед каждым переходом по страницам.
 */
// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore();
//
//   // Если приложение только загрузилось в браузере, проверяем localStorage на живую сессию
//   if (userStore.isLoading.value) {
//     await userStore.initAuth();
//   }
//
//   // Если роут требует авторизации, а пользователь еще не вошел в систему
//   if (to.meta.requiresAuth && !userStore.isAuthenticated.value) {
//     // Триггерим метод login() — он перенаправит пользователя на Authentik
//     await userStore.login();
//   } else {
//     // Если пользователь авторизован или страница публичная — пропускаем дальше
//     next();
//   }
// });
