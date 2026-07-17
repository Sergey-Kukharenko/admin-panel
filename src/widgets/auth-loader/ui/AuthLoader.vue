<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
</script>
<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-[var(--background)] select-none"
  >
    <div class="flex flex-col items-center gap-2">
      <!-- Наш красивый лоадер из lucide-vue-next -->
      <Loader2 class="w-8 h-8 animate-spin text-[var(--primary)]" />
      <span class="text-sm text-[var(--text-secondary)] font-sans font-medium">
        Авторизация в системе...
      </span>
    </div>
  </div>
</template>
