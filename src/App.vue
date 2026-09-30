<script setup lang="ts">
import { Toaster } from 'vue-sonner';

import { AdminLayout } from '@/app/layouts/admin-layout';
import { useUserStore } from '@/entities/user';
import { AuthErrorScreen } from '@/widgets/auth-error-screen';
import { AuthLoader } from '@/widgets/auth-loader';

const userStore = useUserStore();
</script>

<template>
  <AuthLoader v-if="userStore.isLoading" />
  <AuthErrorScreen
    v-else-if="!userStore.isAuthenticated && userStore.authError"
    :error-code="userStore.authError"
  />
  <AdminLayout v-else />

  <Toaster theme="dark" position="bottom-center" />
</template>
