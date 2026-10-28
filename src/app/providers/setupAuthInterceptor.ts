import { useUserStore } from '@/entities/user';
import { apiClient, getHttpStatus } from '@/shared/api';

// The store handles 401 from these itself: /user/me answers "not logged in" at startup,
// /authorization/* is login and logout
const AUTH_URL_PATTERN = /^\/?(user\/me|authorization\/)/;

/**
 * Session expired during work → go to login. Attached after initAuth(), otherwise a 401 from
 * /user/me at startup would beat the router guard. With authError set the backend already
 * reported an auth failure: no redirect, the error screen protects from a login loop.
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
      // Parallel requests may fail with 401 together — redirect once
      isRedirecting = true;
      userStore.login();
    }

    return Promise.reject(error);
  });
}
