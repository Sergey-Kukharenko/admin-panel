<script setup lang="ts">
import { Calendar, FileText, PieChart } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/AppButton';
import { AppFilter } from '@/shared/ui/AppFilter';

const types = defineModel<string[]>('types', {
  default: [],
});

const status = defineModel<string>('status', {
  default: '',
});

const period = defineModel<string>('period', {
  default: '',
});

defineEmits<{
  openUpload: [];
}>();

const statusOptions = [
  {
    label: 'Загрузка',
    value: 'LOADING',
  },
  {
    label: 'Успешно',
    value: 'SUCCESS',
  },
  {
    label: 'Ошибка',
    value: 'ERROR',
  },
];

const typeOptions = [
  {
    label: 'Users',
    value: 'users',
  },
  {
    label: 'Vip-users',
    value: 'vip-users',
  },
  {
    label: 'Bets',
    value: 'bets',
  },
  {
    label: 'Payments',
    value: 'payments',
  },
];

const periodOptions = [
  {
    label: 'Сегодня',
    value: 'today',
  },
  {
    label: 'Неделя',
    value: 'week',
  },
  {
    label: 'Месяц',
    value: 'month',
  },
];
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <div class="flex flex-1 items-center gap-2">
      <AppFilter
        v-model="types"
        title="Тип данных"
        :icon="FileText"
        :options="typeOptions"
        multiple
      />

      <AppFilter v-model="status" title="Статус" :icon="PieChart" :options="statusOptions" />

      <AppFilter v-model="period" title="Период" :icon="Calendar" :options="periodOptions" />
    </div>

    <div class="flex-shrink-0">
      <AppButton
        variant="primary"
        size="small"
        class="!h-8 !gap-1.5 !px-3 rounded-(--radius-sm) text-[#FCFCFC]"
        @click="$emit('openUpload')"
      >
        Загрузить CSV
      </AppButton>
    </div>
  </div>
</template>
