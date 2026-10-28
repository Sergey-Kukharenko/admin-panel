import './shared/assets/styles/main.css';

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { setupAuthInterceptor } from '@/app/providers';
import { router } from '@/app/router';
import { useUserStore } from '@/entities/user';
import { isRetryableError } from '@/shared/api';
import { i18n } from '@/shared/i18n';

async function bootstrap() {
  const app = createApp(App);

  const pinia = createPinia();

  app.use(pinia);
  app.use(i18n);

  // Создаем глобальный клиент кэша с базовыми настройками админ-панели
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Отключаем повторные запросы при переключении вкладок
        // Retry once on network failures and 5xx only: repeating a 4xx or a cancelled request will not help
        retry: (failureCount, error) => failureCount < 1 && isRetryableError(error),
      },
    },
  });

  // Регистрируем плагин в контексте Vue приложения
  app.use(VueQueryPlugin, { queryClient });

  const userStore = useUserStore();

  await userStore.initAuth();

  // After initAuth: a 401 from /user/me at startup means "not logged in" and is handled by the router guard
  setupAuthInterceptor();

  app.use(router);

  await router.isReady();

  app.mount('#app');
}

bootstrap();
