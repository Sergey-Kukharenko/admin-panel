import './shared/assets/styles/main.css';

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'; // Добавляем импорт плагина
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { router } from '@/app/router';
import { useUserStore } from '@/entities/user';

async function bootstrap() {
  const app = createApp(App);

  const pinia = createPinia();

  app.use(pinia);

  // Создаем глобальный клиент кэша с базовыми настройками админ-панели
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Отключаем повторные запросы при переключении вкладок
        retry: 1, // В случае сбоя сети делаем только одну повторную попытку
      },
    },
  });

  // Регистрируем плагин в контексте Vue приложения
  app.use(VueQueryPlugin, { queryClient });

  const userStore = useUserStore();

  await userStore.initAuth();

  app.use(router);

  await router.isReady();

  app.mount('#app');
}

bootstrap();
