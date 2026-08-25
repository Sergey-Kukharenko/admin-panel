<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';

const emit = defineEmits<{
  upload: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex flex-1 items-center justify-center min-h-112.5 w-full">
    <AppEmptyState
      :title="t('datasets.emptyState.title')"
      :description="t('datasets.emptyState.description')"
    >
      <template #action>
        <AppButton variant="secondary" size="small" @click="emit('upload')">
          {{ t('datasets.emptyState.uploadButton') }}
        </AppButton>
      </template>
    </AppEmptyState>
  </div>
</template>
