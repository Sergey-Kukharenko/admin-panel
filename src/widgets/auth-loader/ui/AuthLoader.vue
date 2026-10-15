<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';

const { t } = useI18n({ useScope: 'global' });
</script>
<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-[var(--background)] select-none"
  >
    <div class="flex flex-col items-center gap-2">
      <AppIcon name="loader-2-line" class="w-8 h-8 animate-spin text-[var(--primary)]" />
      <span class="text-sm text-[var(--text-secondary)] font-sans font-medium">
        {{ t('auth.loading') }}
      </span>
    </div>
  </div>
</template>
