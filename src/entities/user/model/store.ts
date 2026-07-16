import type { User } from 'oidc-client-ts';
import { computed, ref } from 'vue';

// Импортируем наш менеджер из shared слоя
import { userManager } from '@/shared/api/auth';

// Делаем стейт глобальным (вне функции), чтобы при каждом вызове useUserStore данные сохранялись
const user = ref<User | null>(null);
const isLoading = ref<boolean>(true);

export const useUserStore = () => {
  // Проверяет: есть ли пользователь и не истёк ли токен
  const isAuthenticated = computed<boolean>(() => !!user.value && !user.value.expired);

  // Возвращает профиль (имя, email и т.д.)
  const userProfile = computed(() => user.value?.profile ?? null);

  // Токен доступа для прикрепления к запросам API
  const accessToken = computed<string>(() => user.value?.access_token ?? '');

  /**
   * Инициализация авторизации.
   * Вызывается один раз при старте приложения: проверяет localStorage на наличие живой сессии.
   */
  async function initAuth(): Promise<void> {
    try {
      user.value = await userManager.getUser();
    } catch (err) {
      console.error('Ошибка при инициализации OIDC сессии:', err);
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Запуск процесса авторизации.
   * Перенаправляет пользователя на страницу входа Authentik.
   */
  async function login(): Promise<void> {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error('Ошибка редиректа на Authentik:', err);
    }
  }

  /**
   * Выход из системы.
   * Очищает локальный стейт и перенаправляет в Authentik для завершения сессии.
   */
  async function logout(): Promise<void> {
    try {
      await userManager.signoutRedirect();
      user.value = null;
    } catch (err) {
      console.error('Ошибка при выходе из системы:', err);
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    userProfile,
    accessToken,
    initAuth,
    login,
    logout,
  };
};
