import { createRouter, createWebHistory } from 'vue-router';

import { useUserStore } from '@/entities/user';
import { BillingPage } from '@/pages/billing-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { DatasetsPage } from '@/pages/datasets-page';
import { IntegrationsPage } from '@/pages/integrations-page';
import { PredictionsPage } from '@/pages/predictions-page';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/datasets' },
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

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    userStore.login();

    return false;
  }

  return true;
});
