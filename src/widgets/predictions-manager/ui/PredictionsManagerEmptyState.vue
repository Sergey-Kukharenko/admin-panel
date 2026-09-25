<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PredictionsManagerEmptyState',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <p class="text-lg font-medium leading-6 text-(--text-primary)">
        {{ t('predictions.manager.empty.title') }}
      </p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        {{ t('predictions.manager.empty.description') }}
      </p>
    </div>
  </div>
</template>
