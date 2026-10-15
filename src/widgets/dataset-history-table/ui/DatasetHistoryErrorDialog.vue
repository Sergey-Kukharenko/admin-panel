<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

import type { ErrorDetails } from '../model/types';

defineOptions({
  name: 'DatasetHistoryErrorDialog',
});

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
  open: boolean;
  title?: string;
  details: ErrorDetails | null;
}>();

const emit = defineEmits<{
  close: [];
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
    :open="open"
    :title="title || t('datasets.errorDialog.defaultTitle')"
    size="sm"
    overlay="soft"
    @close="emit('close')"
  >
    <!-- Content container -->
    <div class="flex flex-col items-start px-5 pb-18 w-full box-border">
      <div v-if="detailsRows.length" class="flex flex-col items-start gap-2 w-full">
        <div
          v-for="row in detailsRows"
          :key="row.label"
          class="flex w-full items-start gap-3 min-h-6 py-0.5"
        >
          <span
            class="w-41 shrink-0 font-sans text-sm font-normal leading-5 text-(--text-secondary)"
          >
            {{ row.label }}
          </span>

          <span class="font-sans text-sm font-normal leading-5 text-(--text-primary)">
            {{ row.value }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <AppButton class="flex-1" variant="primary" size="medium" @click="emit('download')">
        {{ t('datasets.errorDialog.downloadFile') }}
      </AppButton>
    </template>
  </AppModal>
</template>
