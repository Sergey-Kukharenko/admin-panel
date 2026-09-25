<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PredictionRunHistoryEmptyState',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full flex-1 flex-col items-center justify-center py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <p class="text-lg font-medium leading-6 text-(--text-primary)">
        {{ t('predictions.history.empty.title') }}
      </p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        {{ t('predictions.history.empty.description') }}
      </p>
    </div>
  </div>
</template>
