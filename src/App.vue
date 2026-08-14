<script setup lang="ts">
import { Toaster } from 'vue-sonner';

import { AdminLayout } from '@/app/layouts/admin-layout';
import { useUserStore } from '@/entities/user';
import { AuthLoader } from '@/widgets/auth-loader';

const userStore = useUserStore();
</script>

<template>
  <AuthLoader v-if="userStore.isLoading" />
  <AdminLayout v-else />

  <Toaster theme="dark" position="bottom-center" />
</template>
