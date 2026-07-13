<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import {
  CollapsibleContent,
  CollapsibleRoot,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'radix-vue';
import { computed, ref } from 'vue';

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

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const [initialMonthName, initialYear] = predictionProcessingScheduleMonth.split(' ');

const calendarOpened = ref(false);
const monthPickerOpened = ref(false);
const selectedMonthName = ref(initialMonthName);
const selectedYear = ref(initialYear);

const selectedMonth = computed(() => {
  return `${selectedMonthName.value} ${selectedYear.value}`;
});

const defaultSelectedDays = Array.from(
  new Set(predictionProcessingScheduleItems.map((item) => Number.parseInt(item.dayOfMonth, 10))),
);

const selectedDaysByMonth = ref<Record<string, number[]>>({
  [predictionProcessingScheduleMonth]: defaultSelectedDays,
});

const selectedDays = computed(() => {
  return selectedDaysByMonth.value[selectedMonth.value] ?? [];
});

const calendarDays = computed(() => {
  const currentMonthDays = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;

    return {
      id: `${selectedMonth.value}-${day}`,
      value: day,
      disabled: false,
      selected: selectedDays.value.includes(day),
    };
  });

  const nextMonthDays = Array.from({ length: 5 }, (_, index) => {
    const day = index + 1;

    return {
      id: `${selectedMonth.value}-next-${day}`,
      value: day,
      disabled: true,
      selected: false,
    };
  });

  return [...currentMonthDays, ...nextMonthDays];
});

const calendarRows = computed(() => {
  const rows = [];

  for (let index = 0; index < calendarDays.value.length; index += 7) {
    rows.push(calendarDays.value.slice(index, index + 7));
  }

  return rows;
});

const sortedPredictionProcessingScheduleItems = computed(() => {
  if (selectedMonth.value !== predictionProcessingScheduleMonth) {
    return [];
  }

  return predictionProcessingScheduleItems
    .filter((item) => {
      const itemDay = Number.parseInt(item.dayOfMonth, 10);

      return selectedDays.value.includes(itemDay);
    })
    .sort((firstItem, secondItem) => {
      const firstDay = Number.parseInt(firstItem.dayOfMonth, 10);
      const secondDay = Number.parseInt(secondItem.dayOfMonth, 10);

      const firstSelectedIndex = selectedDays.value.indexOf(firstDay);
      const secondSelectedIndex = selectedDays.value.indexOf(secondDay);

      if (firstSelectedIndex !== secondSelectedIndex) {
        return firstSelectedIndex - secondSelectedIndex;
      }

      return firstDay - secondDay;
    });
});

function toggleSelectedDay(day: number) {
  const currentMonthSelectedDays = selectedDaysByMonth.value[selectedMonth.value] ?? [];

  if (currentMonthSelectedDays.includes(day)) {
    selectedDaysByMonth.value = {
      ...selectedDaysByMonth.value,
      [selectedMonth.value]: currentMonthSelectedDays.filter((selectedDay) => selectedDay !== day),
    };

    return;
  }

  selectedDaysByMonth.value = {
    ...selectedDaysByMonth.value,
    [selectedMonth.value]: [...currentMonthSelectedDays, day],
  };
}

function toggleCalendar() {
  calendarOpened.value = !calendarOpened.value;

  if (!calendarOpened.value) {
    monthPickerOpened.value = false;
  }
}

function toggleMonthPicker(event: MouseEvent) {
  event.stopPropagation();

  if (!calendarOpened.value) {
    calendarOpened.value = true;
    monthPickerOpened.value = false;
    return;
  }

  monthPickerOpened.value = !monthPickerOpened.value;
}

function selectMonth(month: string) {
  selectedMonthName.value = month;
  monthPickerOpened.value = false;
}
</script>

<template>
  <aside
    :class="[
      scheduleWidthClass,
      'h-[512px] pt-2 bg-[var(--bg-surface-neutral)] rounded-xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden shrink-0',
    ]"
  >
    <CollapsibleRoot v-model:open="calendarOpened" class="w-full">
      <div class="self-stretch h-[504px] flex flex-col justify-start items-start gap-3">
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
              aria-label="Показать или скрыть календарь расписания обработки"
              @click="toggleCalendar"
            >
              <span
                class="justify-start text-[var(--text-primary)] text-sm font-medium font-['Geist'] leading-5"
                @click="toggleMonthPicker"
              >
                {{ selectedMonth }}
              </span>

              <ChevronDown
                :class="[
                  'size-3.5 text-[var(--icon-primary)] transition-transform duration-200',
                  calendarOpened && 'rotate-180',
                ]"
              />
            </button>
          </div>
        </header>

        <CollapsibleContent class="w-full overflow-hidden">
          <div class="w-full px-4 pb-2 pt-1 bg-[var(--bg-surface-neutral)]">
            <Transition
              mode="out-in"
              enter-from-class="opacity-0 translate-y-2"
              enter-active-class="transition duration-150 ease-out"
              enter-to-class="opacity-100 translate-y-0"
              leave-from-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="monthPickerOpened" key="months" class="rounded-xl py-1">
                <div
                  class="mb-3 text-center text-[var(--text-primary)] text-sm font-medium font-['Geist'] leading-5"
                >
                  {{ selectedYear }}
                </div>

                <div class="grid grid-cols-3 gap-x-4 gap-y-3">
                  <button
                    v-for="month in months"
                    :key="month"
                    type="button"
                    :class="[
                      'h-7 rounded-full px-2 text-xs font-normal font-[\'Geist\'] leading-4 transition-colors',
                      selectedMonthName === month
                        ? 'bg-[var(--bg-tag-active)] text-[var(--icon-primary)]'
                        : 'text-[var(--icon-secondary)] hover:bg-[var(--bg-tag-active)]',
                    ]"
                    @click="selectMonth(month)"
                  >
                    {{ month }}
                  </button>
                </div>
              </div>

              <div v-else key="days" class="flex flex-col gap-1">
                <div
                  v-for="(row, rowIndex) in calendarRows"
                  :key="rowIndex"
                  class="grid grid-cols-7 gap-3"
                >
                  <button
                    v-for="day in row"
                    :key="day.id"
                    type="button"
                    :disabled="day.disabled"
                    :aria-pressed="day.selected"
                    :data-state="day.disabled ? 'disabled' : day.selected ? 'active' : 'default'"
                    :class="[
                      'size-8 rounded-full inline-flex items-center justify-center transition-colors',
                      day.selected && 'bg-[var(--bg-tag-active)]',
                      !day.disabled && 'hover:bg-[var(--bg-tag-active)]',
                      day.disabled && 'opacity-70 cursor-default',
                    ]"
                    @click="toggleSelectedDay(day.value)"
                  >
                    <span
                      :class="[
                        'text-xs font-normal font-[\'Geist\'] leading-4',
                        day.disabled
                          ? 'text-[var(--icon-disabled)]'
                          : day.selected
                            ? 'text-[var(--icon-primary)]'
                            : 'text-[var(--icon-secondary)]',
                      ]"
                    >
                      {{ day.value }}
                    </span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </CollapsibleContent>

        <div
          :class="[
            scheduleWidthClass,
            'pl-2 pr-4 relative flex flex-col justify-start items-start gap-1 overflow-hidden',
            calendarOpened ? 'h-[285px]' : 'h-[457px]',
          ]"
        >
          <div
            :class="[
              scheduleWidthClass,
              'pl-2 pr-4 relative flex flex-col justify-start items-start gap-1 overflow-hidden',
              calendarOpened ? 'h-[285px]' : 'h-[457px]',
            ]"
          >
            <ScrollAreaRoot
              :class="['relative overflow-hidden', calendarOpened ? 'h-[285px]' : 'h-80']"
            >
              <ScrollAreaViewport
                :class="[scheduleListWidthClass, 'h-full rounded-lg overflow-x-hidden']"
              >
                <div class="flex flex-col justify-start items-start gap-1">
                  <PredictionProcessingScheduleItem
                    v-for="item in sortedPredictionProcessingScheduleItems"
                    :key="item.id"
                    :item="item"
                  />

                  <div
                    v-if="!sortedPredictionProcessingScheduleItems.length"
                    class="w-[306px] h-14 p-2 bg-[var(--bg-surface-primary)] rounded-lg inline-flex items-center justify-center"
                  >
                    <span class="text-sm font-normal text-[var(--text-tertiary)]">
                      Нет событий на выбранные даты
                    </span>
                  </div>
                </div>
              </ScrollAreaViewport>

              <ScrollAreaScrollbar
                orientation="vertical"
                class="absolute right-[-16px] top-0 flex h-full w-4 touch-none select-none justify-center overflow-hidden px-[3px] py-3"
              >
                <ScrollAreaThumb
                  class="w-1 rounded-sm bg-[var(--icon-neutral)] opacity-30 outline outline-1 outline-white/10"
                />
              </ScrollAreaScrollbar>
            </ScrollAreaRoot>
          </div>
        </div>
      </div>
    </CollapsibleRoot>
  </aside>
</template>
