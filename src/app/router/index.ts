import { createRouter, createWebHistory } from 'vue-router';

import DatasetUploadPage from '@/pages/dataset-upload-page/ui/DatasetUploadPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/datasets',
    },
    {
      path: '/datasets',
      component: DatasetUploadPage,
    },
  ],
});
