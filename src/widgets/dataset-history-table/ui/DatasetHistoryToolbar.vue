<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { Calendar, FileText, PieChart } from 'lucide-vue-next';
import { computed } from 'vue';

import { datasetApi } from '@/entities/dataset';
import { AppButton } from '@/shared/ui/app-button';
import { AppFilter } from '@/shared/ui/app-filter';

import { DATASET_PERIOD_OPTIONS } from '../model';
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
const { data: templatesServerResponse } = useQuery({
  queryKey: ['dataset-templates'],
  queryFn: async () => {
    const response = await datasetApi.getTemplates();
    return response.data;
  },
  staleTime: 1000 * 60 * 15, // Кэшируем типы на 15 минут
});

/**
 * 🗺️ Маппинг шаблонов бэкенда под контракт FilterOption
 * Записываем в value текстовое имя для красивого URL
 */
const dynamicTypeOptions = computed(() => {
  if (!templatesServerResponse.value) return [];

  return templatesServerResponse.value.map((tpl) => {
    const prettyLabel = tpl.name.charAt(0).toUpperCase() + tpl.name.slice(1).replace('_', ' ');

    return {
      value: tpl.name, // 🚀 Возвращаем tpl.name, чтобы в URL было ?types=balances_daily
      label: prettyLabel,
    };
  });
});

/**
 * 🎨 Опции фильтрации статусов в соответствии с вашим UI-стейтом
 */
const statusOptions = [
  { value: 'LOADING', label: 'Загрузка' },
  { value: 'SUCCESS', label: 'Успешно' },
  { value: 'ERROR', label: 'Ошибка' },
] as const;
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

      <AppFilter v-model="status" title="Статус" :icon="PieChart" :options="statusOptions" />

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
