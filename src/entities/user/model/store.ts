import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { authorizationApi, sessionApi } from '@/shared/api';
import { API_URL } from '@/shared/config/api';
import { IS_DEV } from '@/shared/config/env';

import type { UserProfile } from './types';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null);

  const isLoading = ref(true);

  const isAuthenticated = computed(() => user.value?.authenticated ?? false);

  async function initAuth() {
    try {
      const { data } = await sessionApi.me();

      user.value = data;
    } catch {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
    isLoading.value = false;
  }

  function login() {
    const url = new URL(`${API_URL}/authorization/login`);

    if (IS_DEV) {
      url.searchParams.set('frontend', 'local');
    }

    window.location.href = url.toString();
  }

  async function logout() {
    user.value = null;

    try {
      const { data } = await authorizationApi.logout();

      window.location.href = data.authentik_logout_url ?? '/';
    } catch {
      window.location.href = '/';
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    initAuth,
    login,
    logout,
  };
});
