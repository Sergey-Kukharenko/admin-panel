<script setup lang="ts">
import { AdminLayout } from '@/app/layouts/admin-layout';
import { useUserStore } from '@/entities/user';
import { AuthLoader } from '@/widgets/auth-loader';

const userStore = useUserStore();
</script>

<template>
  <AuthLoader v-if="userStore.isLoading" />
  <AdminLayout v-else />
</template>
