import { computed, ref } from 'vue';

import { initialScheduleMonth, predictionProcessingSchedule } from './constants';
import type { CalendarDay } from './types';

const DAYS_PER_WEEK = 7;
const NEXT_MONTH_PREVIEW_DAYS = 5;

export function useScheduleCalendar() {
  // Разбиваем дефолтный месяц ("Июл 2026" -> "Июл", "2026")
  const [initialMonthName = '', initialYear = ''] = initialScheduleMonth.split(' ');

  const calendarOpened = ref(false);
  const monthPickerOpened = ref(false);
  const selectedMonthName = ref(initialMonthName);
  const selectedYear = ref(initialYear);

  // Текущий выбранный месяц строкой (например, "Авг 2026")
  const selectedMonth = computed(() => `${selectedMonthName.value} ${selectedYear.value}`);

  // События выбранного месяца (если их нет — пустой массив)
  const currentMonthEvents = computed(
    () => predictionProcessingSchedule[selectedMonth.value] ?? [],
  );

  // Дни месяца, на которые запланированы события — календарь только подсвечивает их, без выбора пользователем
  const eventDays = computed(() =>
    Array.from(
      new Set(currentMonthEvents.value.map((item) => Number.parseInt(item.dayOfMonth, 10))),
    ),
  );

  // Динамически определяем количество дней в месяце (31 для июля и августа)
  const daysInCurrentMonth = computed(() => {
    const isAugustOrJuly = ['Июл', 'Авг'].includes(selectedMonthName.value);
    return isAugustOrJuly ? 31 : 30; // Базовая заглушка, соответствующая вашему коду
  });

  const calendarDays = computed<CalendarDay[]>(() => {
    const currentMonthDays = Array.from({ length: daysInCurrentMonth.value }, (_, index) => {
      const day = index + 1;

      return {
        id: `${selectedMonth.value}-${day}`,
        value: day,
        disabled: false,
        selected: eventDays.value.includes(day),
      };
    });

    const nextMonthDays = Array.from({ length: NEXT_MONTH_PREVIEW_DAYS }, (_, index) => {
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
    const rows: CalendarDay[][] = [];

    for (let index = 0; index < calendarDays.value.length; index += DAYS_PER_WEEK) {
      rows.push(calendarDays.value.slice(index, index + DAYS_PER_WEEK));
    }

    return rows;
  });

  // Сортируем события выбранного месяца по дню
  const sortedScheduleItems = computed(() =>
    [...currentMonthEvents.value].sort(
      (firstItem, secondItem) =>
        Number.parseInt(firstItem.dayOfMonth, 10) - Number.parseInt(secondItem.dayOfMonth, 10),
    ),
  );

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

  return {
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
  };
}
