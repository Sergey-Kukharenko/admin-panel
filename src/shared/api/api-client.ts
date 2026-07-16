import axios from 'axios';

// Импортируем наш глобальный стор пользователя из слоя entities
import { useUserStore } from '@/entities/user';

// 1. Создаем изолированный экземпляр Axios
export const apiClient = axios.create({
  // Замените на ваш реальный URL бэкенда (или оставьте относительный /api, если настроен прокси в Vite)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 2. Перехватчик запросов (Request Interceptor)
 * Срабатывает автоматически ПЕРЕД каждым сетевым запросом к бэкенду.
 */
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.accessToken.value;

    // Если токен доступа существует и пользователь авторизован,
    // автоматически добавляем его в заголовки в формате Bearer-токена
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 3. Перехватчик ответов (Response Interceptor)
 * Полезен на случай, если токен протух во время работы пользователя в системе.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore();

    // Если бэкенд вернул 401 Unauthorized, значит токен невалиден или истёк
    if (error.response?.status === 401) {
      console.warn('Токен авторизации недействителен. Перенаправление на вход...');
      // Разлогиниваем пользователя на фронте и отправляем обратно в Authentik
      await userStore.login();
    }

    return Promise.reject(error);
  },
);
