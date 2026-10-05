<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'PredictionRunHistoryErrorState',
});

defineEmits<{
  retry: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <AppIcon name="spam-2-line" class="mb-2 size-6 text-(--danger-failed)" />
      <p class="text-lg font-medium leading-6 text-(--text-primary)">
        {{ t('predictions.history.error.title') }}
      </p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        {{ t('predictions.history.error.description') }}
      </p>
    </div>

    <AppButton variant="outline" size="small" @click="$emit('retry')">{{
      t('predictions.history.error.retry')
    }}</AppButton>
  </div>
</template>
