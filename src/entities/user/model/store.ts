import { computed, ref } from 'vue';

import { apiClient } from '@/shared/api';
import { API_URL } from '@/shared/config/env';

export interface UserProfile {
  authenticated: boolean;
  email: string;
  project_id: string;
  authentik_user_id: string;
}

const user = ref<UserProfile | null>(null);
const isLoading = ref(true);

export function useUserStore() {
  const isAuthenticated = computed(() => user.value?.authenticated === true);

  const userProfile = computed(() => user.value);

  async function initAuth() {
    try {
      const { data } = await apiClient.get<UserProfile>('/user/me');

      user.value = data;

      if (window.location.search.includes('auth=success')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (error) {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  function login() {
    window.location.href = `${API_URL}/authorization/login`;
  }

  function logout() {
    user.value = null;
    window.location.reload();
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
}
