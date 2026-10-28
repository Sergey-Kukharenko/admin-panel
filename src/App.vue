<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';
import { Toaster } from 'vue-sonner';

import { AdminLayout } from '@/app/layouts/admin-layout';
import { useUserStore } from '@/entities/user';
import { AppIcon } from '@/shared/ui/app-icon';
import { AuthErrorScreen } from '@/widgets/auth-error-screen';
import { AuthLoader } from '@/widgets/auth-loader';

const userStore = useUserStore();
</script>

<template>
  <!-- One provider for the whole app: shared delay and instant switching between tooltips -->
  <TooltipProvider :delay-duration="100">
    <AuthLoader v-if="userStore.isLoading" />
    <AuthErrorScreen
      v-else-if="!userStore.isAuthenticated && userStore.authError"
      :error-code="userStore.authError"
    />
    <AdminLayout v-else />
  </TooltipProvider>

  <Toaster theme="dark" position="bottom-center" :style="{ '--width': '483px' }">
    <template #success-icon>
      <AppIcon name="check-line" class="size-4" />
    </template>
  </Toaster>
</template>
