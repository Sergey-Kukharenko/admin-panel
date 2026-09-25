<script setup lang="ts">
import { AlertOctagon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'PredictionsManagerErrorState',
});

defineEmits<{
  retry: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-4 py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <AlertOctagon class="mb-2 size-6 text-(--danger-failed)" stroke-width="2" />
      <p class="text-lg font-medium leading-6 text-(--text-primary)">
        {{ t('predictions.manager.error.title') }}
      </p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        {{ t('predictions.manager.error.description') }}
      </p>
    </div>

    <AppButton variant="outline" size="small" @click="$emit('retry')">{{
      t('predictions.manager.error.retry')
    }}</AppButton>
  </div>
</template>
