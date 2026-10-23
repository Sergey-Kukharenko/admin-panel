<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

const emit = defineEmits<{
  retry: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- No frame for the error state in the mockup: the pattern of the data chart error state, as high
       as the plot (236px) so the page does not jump -->
  <div data-chart-error class="flex h-59 flex-col items-center justify-center gap-4">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <AppIcon name="spam-2-line" class="mb-2 size-6 text-(--danger-failed)" />
      <p class="text-body-sm font-medium text-(--text-primary)">
        {{ t('dashboard.productCharts.error.title') }}
      </p>
      <p class="text-body-sm text-(--text-secondary)">
        {{ t('dashboard.productCharts.error.description') }}
      </p>
    </div>
    <AppButton variant="outline" size="small" @click="emit('retry')">
      {{ t('dashboard.productCharts.error.retry') }}
    </AppButton>
  </div>
</template>
