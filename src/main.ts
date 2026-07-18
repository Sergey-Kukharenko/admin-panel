import './shared/assets/styles/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { router } from '@/app/router';
import { useUserStore } from '@/entities/user';

async function bootstrap() {
  const app = createApp(App);

  const pinia = createPinia();

  app.use(pinia);

  const userStore = useUserStore();

  await userStore.initAuth();

  app.use(router);

  await router.isReady();

  app.mount('#app');
}

bootstrap();
