<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

defineOptions({
  name: 'ChangePasswordModal',
});

defineProps<{
  open: boolean;
  email: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppModal :open="open" :title="t('changePassword.title')" @close="emit('close')">
    <div class="flex flex-col gap-4 px-5 pb-5 text-sm text-(--text-secondary)">
      <p>{{ t('changePassword.description', { email }) }}</p>
      <p>{{ t('changePassword.linkValidity') }}</p>
    </div>

    <template #footer>
      <AppButton variant="outline" size="medium" @click="emit('close')">
        {{ t('changePassword.cancel') }}
      </AppButton>

      <AppButton variant="primary" size="medium" @click="emit('confirm')">
        {{ t('changePassword.submit') }}
      </AppButton>
    </template>
  </AppModal>
</template>
