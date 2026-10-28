<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

defineProps<{
  email: string;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  confirm: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppModal v-model:open="open" :title="t('changePassword.title')" title-size="md">
    <div class="flex flex-col gap-4 pb-3 text-sm text-(--text-secondary)">
      <p>{{ t('changePassword.description', { email }) }}</p>
      <p>{{ t('changePassword.linkValidity') }}</p>
    </div>

    <template #footer>
      <AppButton variant="outline" size="medium" @click="open = false">{{
        t('common.cancel')
      }}</AppButton>

      <AppButton variant="primary" size="medium" @click="emit('confirm')">
        {{ t('changePassword.submit') }}
      </AppButton>
    </template>
  </AppModal>
</template>
