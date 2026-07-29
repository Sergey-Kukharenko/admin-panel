<script setup lang="ts">
import { Calendar, FileText, PieChart } from 'lucide-vue-next';
import { computed } from 'vue';

import { getDatasetTypeContent, useDatasetTemplates } from '@/entities/dataset';
import { AppButton } from '@/shared/ui/app-button';
import { AppFilter } from '@/shared/ui/app-filter';

import { DATASET_PERIOD_OPTIONS, DATASET_STATUS_OPTIONS } from '../model';
import type { DatasetPeriod, DatasetStatus } from '../model/types';

defineOptions({
  name: 'DatasetHistoryToolbar',
});

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
        title="Тип данных"
        :icon="FileText"
        :options="dynamicTypeOptions"
      />

      <AppFilter
        v-model="status"
        title="Статус"
        :icon="PieChart"
        :options="DATASET_STATUS_OPTIONS"
      />

      <AppFilter
        v-model="period"
        title="Период"
        :icon="Calendar"
        :options="DATASET_PERIOD_OPTIONS"
      />
    </div>

    <div class="shrink-0">
      <AppButton variant="primary" size="small" @click="$emit('openUpload')">
        Загрузить CSV
      </AppButton>
    </div>
  </div>
</template>
