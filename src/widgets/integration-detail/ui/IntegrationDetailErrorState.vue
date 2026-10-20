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
  <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <AppIcon name="spam-2-line" class="mb-2 size-6 text-(--text-error)" />
      <p class="text-lg leading-6 font-medium text-(--text-primary)">
        {{ t('integrations.statusError.title') }}
      </p>
      <p class="text-sm leading-5 text-(--text-secondary)">
        {{ t('integrations.statusError.description') }}
      </p>
    </div>

    <AppButton variant="outline" size="small" @click="emit('retry')">
      {{ t('integrations.statusError.retry') }}
    </AppButton>
  </div>
</template>
