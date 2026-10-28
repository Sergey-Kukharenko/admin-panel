<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

import type { ErrorDetails } from '../model/types';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
  title?: string;
  details: ErrorDetails | null;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  download: [];
}>();

const detailsRows = computed(() => {
  if (!props.details) {
    return [];
  }

  return [
    {
      label: t('datasets.errorDialog.checkDate'),
      value: props.details.checkDate,
    },
    {
      label: t('datasets.errorDialog.dataType'),
      value: props.details.dataType,
    },
    {
      label: t('datasets.errorDialog.checkedRows'),
      value: props.details.checkedRows,
    },
    {
      label: t('datasets.errorDialog.errorsFound'),
      value: props.details.errorsFound,
    },
  ];
});
</script>

<template>
  <AppModal
    v-model:open="open"
    :title="title || t('datasets.errorDialog.defaultTitle')"
    size="sm"
    title-size="md"
    overlay="soft"
  >
    <div v-if="detailsRows.length" class="flex w-full flex-col items-start gap-2 pb-16">
      <div
        v-for="row in detailsRows"
        :key="row.label"
        class="flex min-h-6 w-full items-start gap-3 py-0.5"
      >
        <span class="w-41 shrink-0 text-sm leading-5 text-(--text-secondary)">
          {{ row.label }}
        </span>

        <span class="text-sm leading-5 text-(--text-primary)">
          {{ row.value }}
        </span>
      </div>
    </div>

    <template #footer>
      <AppButton class="flex-1" variant="primary" size="medium" @click="emit('download')">
        {{ t('datasets.errorDialog.downloadFile') }}
      </AppButton>
    </template>
  </AppModal>
</template>
