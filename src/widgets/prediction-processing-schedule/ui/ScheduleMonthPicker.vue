<script setup lang="ts">
import { computed } from 'vue';

import { getMonthCellClasses } from '../model/calendarCellClasses';

defineOptions({
  name: 'ScheduleMonthPicker',
});

const MONTHS_PER_ROW = 3;

const props = defineProps<{
  year: string;
  months: string[];
  selectedMonthName: string;
}>();

defineEmits<{
  select: [month: string];
}>();

const monthRows = computed(() => {
  const rows: string[][] = [];

  for (let index = 0; index < props.months.length; index += MONTHS_PER_ROW) {
    rows.push(props.months.slice(index, index + MONTHS_PER_ROW));
  }

  return rows;
});
</script>

<template>
  <div
    class="absolute right-4 top-12 z-10 w-[180px] flex flex-col gap-0.5 p-1 rounded-xl bg-(--surface) shadow-(--shadow-panel) backdrop-blur-floating-panel animate-in fade-in-50 zoom-in-95 duration-100"
  >
    <div
      class="w-full rounded-lg px-3 py-1.5 text-center text-[var(--text-primary)] text-sm font-medium leading-5"
    >
      {{ year }}
    </div>

    <div class="flex flex-col px-1">
      <div v-for="(row, rowIndex) in monthRows" :key="rowIndex" class="flex justify-between">
        <button
          v-for="month in row"
          :key="month"
          type="button"
          :class="getMonthCellClasses(month, selectedMonthName)"
          @click="$emit('select', month)"
        >
          {{ month }}
        </button>
      </div>
    </div>
  </div>
</template>
