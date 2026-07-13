<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

import {
  predictionProcessingScheduleItems,
  predictionProcessingScheduleMonth,
} from '../model/constants';
import PredictionProcessingScheduleItem from './PredictionProcessingScheduleItem.vue';

defineOptions({
  name: 'PredictionProcessingSchedule',
});

const scheduleWidthClass = 'w-[332px]';
const scheduleListWidthClass = 'w-[306px]';
</script>

<template>
  <aside
    :class="[
      scheduleWidthClass,
      'h-[512px] pt-2 bg-[var(--bg-surface-neutral)] rounded-xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden shrink-0',
    ]"
  >
    <div class="self-stretch h-[504px] flex flex-col justify-center items-start gap-3">
      <header class="self-stretch h-8 px-5 pt-2 flex flex-col justify-start items-start gap-2">
        <div class="self-stretch inline-flex justify-between items-center">
          <h2
            class="flex-1 justify-start text-[var(--text-primary)] text-base font-medium font-['Geist'] leading-6"
          >
            Расписание обработки
          </h2>

          <button
            type="button"
            class="h-6 py-1 rounded-[32px] flex justify-start items-center gap-1"
            aria-label="Выбрать месяц расписания обработки"
          >
            <span
              class="justify-start text-[var(--text-primary)] text-sm font-medium font-['Geist'] leading-5"
            >
              {{ predictionProcessingScheduleMonth }}
            </span>

            <ChevronDown class="size-3.5 text-[var(--icon-primary)]" />
          </button>
        </div>
      </header>

      <div
        :class="[
          scheduleWidthClass,
          'h-[457px] pl-2 pr-4 relative flex flex-col justify-start items-start gap-1 overflow-hidden',
        ]"
      >
        <div
          :class="[
            scheduleListWidthClass,
            'h-80 rounded-lg flex flex-col justify-start items-start gap-1',
          ]"
        >
          <PredictionProcessingScheduleItem
            v-for="item in predictionProcessingScheduleItems"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
