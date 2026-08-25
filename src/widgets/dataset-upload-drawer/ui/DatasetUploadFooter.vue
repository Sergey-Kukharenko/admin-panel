<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';

defineProps<{
  disabled?: boolean;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex items-center justify-end w-full h-19 px-5 py-4 gap-2 bg-(--background)">
    <AppButton
      variant="outline"
      size="medium"
      :disabled="submitting"
      @click="emit('cancel')"
    >
      {{ t('datasets.upload.footer.cancel') }}
    </AppButton>

    <AppButton variant="primary" size="medium" :disabled="disabled" @click="emit('submit')">
      {{ submitting ? t('datasets.upload.footer.submitting') : t('datasets.upload.footer.submit') }}
    </AppButton>
  </div>
</template>
