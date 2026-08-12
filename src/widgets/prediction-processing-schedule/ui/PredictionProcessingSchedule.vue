<script setup lang="ts">
import {
  CollapsibleContent,
  CollapsibleRoot,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'radix-vue';
import { computed } from 'vue';

import chevronDownIcon from '../assets/icons/chevron-down.svg';
import { getDayCellClasses } from '../model/calendarCellClasses';
import { monthShortNames } from '../model/constants';
import { useScheduleCalendar } from '../model/useScheduleCalendar';
import PredictionProcessingScheduleErrorState from './PredictionProcessingScheduleErrorState.vue';
import PredictionProcessingScheduleItem from './PredictionProcessingScheduleItem.vue';
import PredictionProcessingScheduleSkeleton from './PredictionProcessingScheduleSkeleton.vue';
import ScheduleMonthPicker from './ScheduleMonthPicker.vue';

defineOptions({
  name: 'PredictionProcessingSchedule',
});

const {
  calendarOpened,
  monthPickerOpened,
  selectedMonthName,
  selectedYear,
  selectedMonth,
  calendarRows,
  sortedScheduleItems,
  toggleCalendar,
  toggleMonthPicker,
  selectMonth,
  isLoading,
  isError,
  refetch,
} = useScheduleCalendar();

const isPaddingBottomRemoved = computed(
  () => calendarOpened.value && sortedScheduleItems.value.length >= 6,
);

const asideClasses = computed(() => [
  'w-[332px] pt-2 bg-[var(--bg-surface-neutral)] rounded-(--radius-xl) relative inline-flex flex-col justify-start items-start gap-3 overflow-hidden shrink-0',
  !isPaddingBottomRemoved.value && 'pb-4',
]);
</script>

<template>
  <PredictionProcessingScheduleSkeleton v-if="isLoading" />
  <PredictionProcessingScheduleErrorState v-else-if="isError" @retry="refetch" />

  <aside v-else :class="asideClasses">
    <CollapsibleRoot v-model:open="calendarOpened" class="w-full">
      <div class="self-stretch flex flex-col justify-start items-start gap-3">
        <header class="self-stretch h-8 px-5 pt-2 flex flex-col justify-start items-start gap-2">
          <div class="self-stretch inline-flex justify-between items-center">
            <h2
              class="flex-1 justify-start text-[var(--text-primary)] text-base font-medium leading-6"
            >
              Расписание обработки
            </h2>

            <button
              type="button"
              class="h-6 py-1 rounded-(--radius-4xl) flex justify-start items-center gap-1"
              aria-label="Показать или скрыть календарь расписания обработки"
              @click="toggleCalendar"
            >
              <span
                class="justify-start text-[var(--text-primary)] text-sm font-medium leading-5"
                @click="toggleMonthPicker"
              >
                {{ selectedMonth }}
              </span>

              <span
                class="relative flex size-3.5 shrink-0 items-center justify-center overflow-hidden"
              >
                <img
                  :src="chevronDownIcon"
                  alt=""
                  class="h-[9.546px] w-[5.834px] transition-transform duration-200"
                  :class="calendarOpened ? 'rotate-[270deg]' : 'rotate-90'"
                />
              </span>
            </button>
          </div>
        </header>

        <CollapsibleContent class="relative w-full overflow-hidden">
          <div class="w-full pb-2 pt-1 bg-[var(--bg-surface-neutral)]">
            <div class="flex flex-col gap-1">
              <div
                v-for="(row, rowIndex) in calendarRows"
                :key="rowIndex"
                class="flex items-center justify-between px-4"
              >
                <div
                  v-for="day in row"
                  :key="day.id"
                  :data-state="day.disabled ? 'disabled' : day.selected ? 'active' : 'default'"
                  :class="getDayCellClasses(day)"
                >
                  {{ day.value }}
                </div>
              </div>
            </div>
          </div>

          <ScheduleMonthPicker
            v-if="monthPickerOpened"
            :year="selectedYear"
            :months="monthShortNames"
            :selected-month-name="selectedMonthName"
            @select="selectMonth"
          />
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>

    <!-- Секция ScrollArea для списка событий под календарем -->
    <div class="w-full pl-2 pr-1">
      <ScrollAreaRoot class="w-full overflow-hidden pr-2" type="auto">
        <ScrollAreaViewport class="w-full max-h-[376px]">
          <div class="flex flex-col gap-2">
            <PredictionProcessingScheduleItem
              v-for="item in sortedScheduleItems"
              :key="item.id"
              :item="item"
            />

            <p
              v-if="sortedScheduleItems.length === 0"
              class="px-3 py-6 text-center text-sm text-(--text-secondary)"
            >
              Событий в этом месяце нет
            </p>
          </div>
        </ScrollAreaViewport>

        <!-- Тонкий кастомный скроллбар -->
        <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-transparent w-1.5 absolute right-1 top-0 bottom-0 transition-colors hover:bg-black/5"
          orientation="vertical"
        >
          <ScrollAreaThumb class="flex-1 bg-[var(--text-secondary)] opacity-30 rounded-(--radius-full)" />
        </ScrollAreaScrollbar>
      </ScrollAreaRoot>
    </div>
  </aside>
</template>
