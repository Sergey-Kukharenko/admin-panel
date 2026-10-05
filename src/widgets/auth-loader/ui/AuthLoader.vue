<script setup lang="ts">
import { AppIcon } from '@/shared/ui/app-icon';
</script>
<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-[var(--background)] select-none"
  >
    <div class="flex flex-col items-center gap-2">
      <AppIcon name="loader-2-line" class="w-8 h-8 animate-spin text-[var(--primary)]" />
      <span class="text-sm text-[var(--text-secondary)] font-sans font-medium">
        Авторизация в системе...
      </span>
    </div>
  </div>
</template>
