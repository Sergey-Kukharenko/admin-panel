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
  <!-- No frame for the error state in the mockup: the pattern of the prediction history error state,
       as high as the chart (32px total + 236px plot + 32px filter + gaps) so the page does not jump -->
  <div class="flex h-82 flex-col items-center justify-center gap-4">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <AppIcon name="spam-2-line" class="mb-2 size-6 text-(--danger-failed)" />
      <p class="text-body-sm font-medium text-(--text-primary)">
        {{ t('dashboard.dataChart.error.title') }}
      </p>
      <p class="text-body-sm text-(--text-secondary)">
        {{ t('dashboard.dataChart.error.description') }}
      </p>
    </div>
    <AppButton variant="outline" size="small" @click="emit('retry')">
      {{ t('dashboard.dataChart.error.retry') }}
    </AppButton>
  </div>
</template>
