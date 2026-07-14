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

// Импортируем обновленные константы
import { initialScheduleMonth, predictionProcessingSchedule } from '../model/constants';
import PredictionProcessingScheduleItem from './PredictionProcessingScheduleItem.vue';

defineOptions({
  name: 'PredictionProcessingSchedule',
});

const scheduleWidthClass = 'w-[332px]';

const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

// Разбиваем дефолтный месяц ("Июл 2026" -> "Июл", "2026")
const [initialMonthName = '', initialYear = ''] = initialScheduleMonth.split(' ');

const calendarOpened = ref(false);
const monthPickerOpened = ref(false);
const selectedMonthName = ref(initialMonthName);
const selectedYear = ref(initialYear);

// Текущий выбранный месяц строкой (например, "Авг 2026")
const selectedMonth = computed(() => {
  return `${selectedMonthName.value} ${selectedYear.value}`;
});

// Автоматически вытаскиваем все активные дни для ВСЕХ месяцев из констант
const defaultSelectedDaysByMonth = Object.entries(predictionProcessingSchedule).reduce<
  Record<string, number[]>
>((accumulator, [monthKey, events]) => {
  accumulator[monthKey] = Array.from(
    new Set(events.map((item) => Number.parseInt(item.dayOfMonth, 10))),
  );
  return accumulator;
}, {});

// Стейт выбранных дней в календаре
const selectedDaysByMonth = ref<Record<string, number[]>>(defaultSelectedDaysByMonth);

// Дни, выбранные в текущем активном месяце
const selectedDays = computed(() => {
  return selectedDaysByMonth.value[selectedMonth.value] ?? [];
});

// Динамически определяем количество дней в месяце (31 для июля и августа)
const daysInCurrentMonth = computed(() => {
  const isAugustOrJuly = ['Июл', 'Авг'].includes(selectedMonthName.value);
  return isAugustOrJuly ? 31 : 30; // Базовая заглушка, соответствующая вашему коду
});

const calendarDays = computed(() => {
  const currentMonthDays = Array.from({ length: daysInCurrentMonth.value }, (_, index) => {
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

// Фильтруем и сортируем элементы в зависимости от ВЫБРАННОГО месяца
const sortedPredictionProcessingScheduleItems = computed(() => {
  // Берем события конкретно для выбранного месяца (если их нет — пустой массив)
  const currentMonthEvents = predictionProcessingSchedule[selectedMonth.value] ?? [];

  return currentMonthEvents
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

const isPaddingBottomRemoved = computed(() => {
  return calendarOpened.value && sortedPredictionProcessingScheduleItems.value.length >= 6;
});

const asideClasses = computed(() => [
  scheduleWidthClass,
  'pt-2 bg-[var(--bg-surface-neutral)] rounded-xl inline-flex flex-col justify-start items-start gap-3 overflow-hidden shrink-0',
  !isPaddingBottomRemoved.value && 'pb-4',
]);
</script>

<template>
  <aside :class="asideClasses">
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
              class="h-6 py-1 rounded-[32px] flex justify-start items-center gap-1"
              aria-label="Показать или скрыть календарь расписания обработки"
              @click="toggleCalendar"
            >
              <span
                class="justify-start text-[var(--text-primary)] text-sm font-medium leading-5"
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
                  class="mb-3 text-center text-[var(--text-primary)] text-sm font-medium leading-5"
                >
                  {{ selectedYear }}
                </div>

                <div class="grid grid-cols-3 gap-x-4 gap-y-3">
                  <button
                    v-for="month in months"
                    :key="month"
                    type="button"
                    :class="[
                      'h-7 rounded-full px-2 text-xs font-normal leading-4 transition-colors',
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
                      'size-8 rounded-full inline-flex items-center justify-center transition-colors text-sm font-medium',
                      day.selected && 'bg-[var(--bg-tag-active)] text-[var(--text-primary)]',
                      !day.disabled &&
                        !day.selected &&
                        'text-[var(--text-secondary)] hover:bg-[var(--bg-tag-active)]',
                      day.disabled && 'opacity-30 cursor-default',
                    ]"
                    @click="toggleSelectedDay(day.value)"
                  >
                    {{ day.value }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </CollapsibleContent>
      </div>
    </CollapsibleRoot>

    <!-- Секция ScrollArea для списка событий под календарем -->
    <div class="w-full pl-2 pr-1">
      <ScrollAreaRoot class="w-full overflow-hidden pr-2" type="auto">
        <ScrollAreaViewport class="w-full max-h-[376px]">
          <div class="flex flex-col gap-2">
            <PredictionProcessingScheduleItem
              v-for="item in sortedPredictionProcessingScheduleItems"
              :key="item.id"
              :item="item"
            />
          </div>
        </ScrollAreaViewport>

        <!-- Тонкий кастомный скроллбар -->
        <ScrollAreaScrollbar
          class="flex select-none touch-none p-0.5 bg-transparent w-1.5 absolute right-1 top-0 bottom-0 transition-colors hover:bg-black/5"
          orientation="vertical"
        >
          <ScrollAreaThumb class="flex-1 bg-[var(--text-secondary)] opacity-30 rounded-full" />
        </ScrollAreaScrollbar>
      </ScrollAreaRoot>
    </div>
  </aside>
</template>
