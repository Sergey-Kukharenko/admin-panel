<script setup lang="ts">
import { Calendar, FileText, PieChart } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { getDatasetTypeContent, useDatasetTemplates } from '@/entities/dataset';
import { AppButton } from '@/shared/ui/app-button';
import { AppFilter } from '@/shared/ui/app-filter';

import type { DatasetPeriod, DatasetStatus } from '../model/types';

defineOptions({
  name: 'DatasetHistoryToolbar',
});

const { t } = useI18n({ useScope: 'global' });

const periodOptions = computed(() => [
  { label: t('datasets.filters.period.allTime'), value: '' },
  { label: t('datasets.filters.period.last7Days'), value: 'week' },
  { label: t('datasets.filters.period.last30Days'), value: 'month' },
]);

// Статусы всегда на английском независимо от языка интерфейса — в макете нет
// русской версии этой терминологии (см. WT-439)
const statusOptions = [
  { label: 'Processing', value: 'LOADING' },
  { label: 'Validated', value: 'SUCCESS' },
  { label: 'Issue', value: 'ERROR' },
];

const types = defineModel<string[]>('types', {
  default: [],
});

const status = defineModel<DatasetStatus | ''>('status', {
  default: '',
});

const period = defineModel<DatasetPeriod | ''>('period', {
  default: '',
});

defineEmits<{
  openUpload: [];
}>();

/**
 * 📡 Загрузка динамических типов данных (шаблонов) с бэкенда
 */
const { data: templatesServerResponse } = useDatasetTemplates();

/**
 * 🗺️ Маппинг шаблонов бэкенда под контракт FilterOption
 * Записываем в value текстовое имя для красивого URL
 */
const dynamicTypeOptions = computed(() => {
  if (!templatesServerResponse.value) return [];

  return templatesServerResponse.value.map((tpl) => ({
    value: tpl.name, // 🚀 Возвращаем tpl.name, чтобы в URL было ?types=balances_daily
    label: getDatasetTypeContent(tpl.name).title,
  }));
});
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-1 items-center gap-2">
      <AppFilter
        v-model="types"
        multiple
        :title="t('datasets.toolbar.dataType')"
        :icon="FileText"
        :options="dynamicTypeOptions"
      />

      <AppFilter
        v-model="status"
        :title="t('datasets.toolbar.status')"
        :icon="PieChart"
        :options="statusOptions"
      />

      <AppFilter
        v-model="period"
        :title="t('datasets.toolbar.period')"
        :icon="Calendar"
        :options="periodOptions"
      />
    </div>

    <div class="shrink-0">
      <AppButton variant="primary" size="small" @click="$emit('openUpload')">
        {{ t('datasets.toolbar.uploadButton') }}
      </AppButton>
    </div>
  </div>
</template>
