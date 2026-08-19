<script setup lang="ts">
import { Info } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';
import { AppDropdown } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'HelpMenu',
});
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-(--radius-sm) hover:bg-(--muted)"
        aria-label="Помощь"
      >
        <Info class="size-4 text-(--icon-tertiary)" />
      </button>
    </template>

    <div class="flex w-70 flex-col gap-3 p-2">
      <div class="flex flex-col gap-1">
        <h4 class="text-body-sm font-medium text-(--text-primary)">Помощь</h4>
        <p class="text-body-sm text-(--text-secondary)">
          ML Portal — продвинутая среда для iGaming. Анализ поведения игроков на основе
          ML-моделей.
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <AppButton variant="outline" size="small" class="w-full">Документация</AppButton>
        <AppButton variant="primary" size="small" class="w-full text-(--text-inverse-soft)">
          Связаться с менеджером
        </AppButton>
      </div>
    </div>
  </AppDropdown>
</template>
