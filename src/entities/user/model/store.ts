import { computed, ref } from 'vue';

import { apiClient } from '@/shared/api';

// Строгая типизация профиля пользователя под схему из Swagger
export interface UserProfile {
  authenticated: boolean; // Статус авторизации
  email: string; // Рабочий email
  project_id: string; // ID текущего проекта
  authentik_user_id: string; // Идентификатор пользователя в Authentik
}

const user = ref<UserProfile | null>(null);
const isLoading = ref<boolean>(true);

export const useUserStore = () => {
  const isAuthenticated = computed<boolean>(() => !!user.value?.authenticated);
  const userProfile = computed<UserProfile | null>(() => user.value);

  /**
   * Проверка сессии при старте через GET /user/me
   */
  async function initAuth(): Promise<void> {
    try {
      const response = await apiClient.get<UserProfile>('/user/me');
      user.value = response.data;
    } catch (err) {
      // Если сессии нет (401), сбрасываем стейт в null
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Перенаправление браузера на нативный 307-редирект бэкенда /authorization/login
   */
  function login(): void {
    window.location.href = `${apiClient.defaults.baseURL}/authorization/login`;
  }

  /**
   * Выход из системы с получением ссылки и редиректом на IdP Authentik
   */
  async function logout(): Promise<void> {
    try {
      // Делаем POST-запрос на логаут и забираем урл
      const response = await apiClient.post<{ authentik_logout_url: string }>(
        '/authorization/logout',
      );
      const { authentik_logout_url } = response.data;

      user.value = null;

      if (authentik_logout_url) {
        // Уводим браузер, чтобы Authentik тоже сбросил глобальную сессию
        window.location.href = authentik_logout_url;
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Ошибка при выходе из системы:', err);
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    userProfile,
    initAuth,
    login,
    logout,
  };
};
