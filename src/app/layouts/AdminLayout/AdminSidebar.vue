<script setup lang="ts">
import logoUrl from '@/shared/assets/images/logo.svg';

import SidebarNavigation from './SidebarNavigation.vue';
</script>

<template>
  <aside
    class="flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--border)] bg-[var(--sidebar)]"
  >
    <div class="flex h-16 items-center px-6">
      <img :src="logoUrl" alt="Logo" class="h-8 w-auto" />
    </div>

    <div class="px-3">
      <SidebarNavigation />
    </div>

    <div class="mt-auto p-3">
      <AppCard class="bg-[var(--muted)] p-4">
        <p class="text-sm font-medium text-[var(--foreground)]">
          Обучение модели занимает от 5 до 14 дней
        </p>

        <p class="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
          После завершения вы получите уведомление на email.
        </p>
      </AppCard>
    </div>
  </aside>
</template>
