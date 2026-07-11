import { createRouter, createWebHistory } from 'vue-router';

import BillingPage from '@/pages/billing-page/ui/BillingPage.vue';
import DashboardPage from '@/pages/dashboard-page/ui/DashboardPage.vue';
import DatasetsPage from '@/pages/datasets-page/ui/DatasetsPage.vue';
import IntegrationsPage from '@/pages/integrations-page/ui/IntegrationsPage.vue';
import PredictionsPage from '@/pages/predictions-page/ui/PredictionsPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/datasets',
    },
    {
      path: '/dashboard',
      component: DashboardPage,
    },
    {
      path: '/integrations',
      component: IntegrationsPage,
    },
    {
      path: '/datasets',
      component: DatasetsPage,
    },
    {
      path: '/predictions',
      component: PredictionsPage,
    },
    {
      path: '/billing',
      component: BillingPage,
    },
  ],
});
