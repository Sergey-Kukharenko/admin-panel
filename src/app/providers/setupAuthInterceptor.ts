import { useUserStore } from '@/entities/user';
import { apiClient, getHttpStatus } from '@/shared/api';

// The store handles 401 from these itself: /user/me answers "not logged in" at startup,
// /authorization/* is login and logout
const AUTH_URL_PATTERN = /^\/?(user\/me|authorization\/)/;

// When the session is alive (/user/me is 200) but some endpoint keeps answering 401, login() comes
// straight back from Authentik and the same request fails again — a reload loop. One redirect per
// window: a repeated 401 right after the return stays a regular request error on the screen
const LOGIN_REDIRECT_STORAGE_KEY = 'auth_401_redirect_at';
const LOGIN_REDIRECT_WINDOW_MS = 60_000;

function wasRedirectedRecently(): boolean {
  try {
    const at = Number(sessionStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY));
    return Number.isFinite(at) && Date.now() - at < LOGIN_REDIRECT_WINDOW_MS;
  } catch {
    return false;
  }
}

function rememberRedirect() {
  try {
    sessionStorage.setItem(LOGIN_REDIRECT_STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode): the in-memory flag still prevents parallel redirects
  }
}

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
      !isRedirecting &&
      !wasRedirectedRecently()
    ) {
      // Parallel requests may fail with 401 together — redirect once
      isRedirecting = true;
      rememberRedirect();
      userStore.login();
    }

    return Promise.reject(error);
  });
}
