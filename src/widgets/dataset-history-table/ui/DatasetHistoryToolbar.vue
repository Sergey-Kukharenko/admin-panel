<script setup lang="ts">
import { Calendar, FileText, PieChart } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';
import { AppFilter } from '@/shared/ui/app-filter';

import { DATASET_PERIOD_OPTIONS, DATASET_STATUS_OPTIONS, DATASET_TYPE_OPTIONS } from '../model';
import type { DatasetPeriod, DatasetStatus } from '../model/types';

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
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-1 items-center gap-2">
      <AppFilter
        v-model="types"
        multiple
        title="Тип данных"
        :icon="FileText"
        :options="DATASET_TYPE_OPTIONS"
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
