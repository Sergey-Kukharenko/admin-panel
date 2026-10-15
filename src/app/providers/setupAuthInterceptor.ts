import { useUserStore } from '@/entities/user';
import { apiClient, getHttpStatus } from '@/shared/api';

// 401 от этих запросов обрабатывает сам стор: /user/me — штатный ответ «не залогинен»
// при старте, /authorization/* — вход и выход
const AUTH_URL_PATTERN = /^\/?(user\/me|authorization\/)/;

/**
 * Сессия истекла во время работы → уходим на логин. Подключается после initAuth(),
 * иначе 401 от /user/me на старте опередил бы гард роутера. Если бэк уже вернул ошибку
 * авторизации (authError), не редиректим: экран ошибки защищает от цикла логина.
 */
export function setupAuthInterceptor() {
  const userStore = useUserStore();
  let isRedirecting = false;

  apiClient.interceptors.response.use(undefined, (error) => {
    const url = error?.config?.url ?? '';

    if (
      getHttpStatus(error) === 401 &&
      !AUTH_URL_PATTERN.test(url) &&
      !userStore.authError &&
      !isRedirecting
    ) {
      // Параллельные запросы могут вернуть 401 одновременно — редиректим один раз
      isRedirecting = true;
      userStore.login();
    }

    return Promise.reject(error);
  });
}
