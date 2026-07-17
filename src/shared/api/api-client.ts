import axios from 'axios';

import { useUserStore } from '@/entities/user';

export const apiClient = axios.create({
  // Если есть переменная в env — берем её, если нет — оставляем относительный путь
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Перехватчик ответов бэкенда.
 * Если сессия протухла, любой запрос вернет 401, и мы уведем юзера на логин.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore();

    // Если бэк вернул 401 на любой запрос (кроме самой проверки юзера /user/me), уводим на логин
    if (error.response?.status === 401 && !error.config.url?.includes('/user/me')) {
      console.warn('Сессия истекла. Перенаправление на авторизацию...');
      userStore.login();
    }

    return Promise.reject(error);
  },
);
