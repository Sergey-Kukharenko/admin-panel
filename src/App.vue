<script setup lang="ts">
import { AdminLayout } from '@/app/layouts/admin-layout';
import { useUserStore } from '@/entities/user';
import { AuthLoader } from '@/widgets/auth-loader';

const userStore = useUserStore();
console.log(userStore);
</script>

<template>
  <AuthLoader v-if="userStore.isLoading.value" />
  <AdminLayout v-else />
</template>
