<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppDropdown } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'HelpMenu',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-(--radius-sm) hover:bg-(--muted)"
        :aria-label="t('layout.helpMenu.ariaLabel')"
      >
        <Info class="size-4 text-(--icon-tertiary)" />
      </button>
    </template>

    <div class="flex w-70 flex-col gap-3 p-2">
      <div class="flex flex-col gap-1">
        <h4 class="text-body-sm font-medium text-(--text-primary)">{{ t('layout.helpMenu.title') }}</h4>
        <p class="text-body-sm text-(--text-secondary)">
          {{ t('layout.helpMenu.description') }}
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <AppButton variant="outline" size="small" class="w-full">{{ t('layout.helpMenu.docs') }}</AppButton>
        <AppButton variant="primary" size="small" class="w-full text-(--text-inverse-soft)">
          {{ t('layout.helpMenu.contactManager') }}
        </AppButton>
      </div>
    </div>
  </AppDropdown>
</template>
