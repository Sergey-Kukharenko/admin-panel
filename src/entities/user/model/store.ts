import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { API_URL } from '@/shared/config/api';

import type { UserProfile } from './types';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null);

  const isLoading = ref(true);

  const isAuthenticated = computed(() => user.value?.authenticated ?? false);

  async function initAuth() {
    // try {
    //   const { data } = await sessionApi.me();
    //
    //   user.value = data;
    // } catch {
    //   user.value = null;
    // } finally {
    //   isLoading.value = false;
    // }
    isLoading.value = false;
  }

  function login() {
    window.location.href = `${API_URL}/authorization/login`;
  }

  function logout() {
    user.value = null;

    window.location.href = `${API_URL}/authorization/logout`;
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
