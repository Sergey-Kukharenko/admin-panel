<script setup lang="ts">
import { Calendar, FileText, PieChart } from 'lucide-vue-next';
import { ref } from 'vue';

import { AppButton } from '@/shared/ui/AppButton';
import { AppFilter } from '@/shared/ui/AppFilter';

const status = ref('');
const types = ref<string[]>([]);
const period = ref('');

defineEmits<{
  openUpload: []; // Событие клика на кнопку «Загрузить CSV»
}>();

const statusOptions = [
  {
    label: 'Обработка',
    value: 'processing',
  },
  {
    label: 'Загружено',
    value: 'uploaded',
  },
  {
    label: 'Ошибка',
    value: 'error',
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
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <div class="flex items-center gap-2">
      <AppFilter
        v-model="types"
        title="Тип данных"
        :icon="FileText"
        :options="typeOptions"
        multiple
      />

      <AppFilter v-model="status" title="Статус" :icon="PieChart" :options="statusOptions" />

      <AppFilter
        v-model="period"
        title="Период"
        :icon="Calendar"
        :options="[
          { label: 'Сегодня', value: 'today' },
          { label: 'Неделя', value: 'week' },
          { label: 'Месяц', value: 'month' },
        ]"
      />
    </div>
    <!-- Кнопка действия: Загрузить CSV -->
    <!-- Используем нашу AppButton, перебивая её высоту до 32px (!h-8) и паддинги по спецификации Figma -->
    <div class="flex-shrink-0">
      <AppButton
        variant="primary"
        size="small"
        class="!h-8 !px-3 !gap-1.5 text-[#FCFCFC] rounded-(--radius-sm)"
        @click="$emit('openUpload')"
      >
        Загрузить CSV
      </AppButton>
    </div>
  </div>
</template>
