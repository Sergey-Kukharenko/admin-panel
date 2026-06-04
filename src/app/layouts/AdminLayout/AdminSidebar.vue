<script setup lang="ts">
import logoUrl from '@/shared/assets/images/logo.svg';

import SidebarNavigation from './SidebarNavigation.vue';
</script>

<template>
  <aside
    class="flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)]"
  >
    <!-- Logo -->

    <div class="flex h-16 items-center justify-between px-6">
      <img :src="logoUrl" alt="MiCo" class="h-8 w-auto" />

      <button
        class="flex size-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-muted)]"
      >
        <span class="text-sm">◫</span>
      </button>
    </div>

    <!-- Navigation -->

    <div class="px-3">
      <SidebarNavigation />
    </div>

    <!-- Bottom card -->

    <div class="mt-auto p-3">
      <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
        <div class="mb-4 flex items-start justify-between">
          <div class="flex size-10 items-center justify-center rounded-full bg-white">🧠</div>

          <button class="text-sm text-[var(--color-text-muted)]">✕</button>
        </div>

        <p class="text-sm font-medium text-[var(--color-foreground)]">
          Обучение модели занимает от 5 до 14 дней
        </p>

        <p class="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
          После завершения вы получите уведомление на email.
        </p>
      </div>
    </div>
  </aside>
</template>
