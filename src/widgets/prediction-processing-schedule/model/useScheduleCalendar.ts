import { computed, ref } from 'vue';

import { useProducts } from '@/entities/product';

import { monthShortNames } from './constants';
import { buildScheduleEvents, toScheduleEvent } from './scheduleMapper';
import type { CalendarDay } from './types';

const DAYS_PER_WEEK = 7;
const NEXT_MONTH_PREVIEW_DAYS = 5;
const FALLBACK_MONTH_NAME = 'Янв';

export function useScheduleCalendar() {
  const { data: productsResponse, isLoading, isError, refetch } = useProducts();

  const now = new Date();

  const calendarOpened = ref(false);
  const monthPickerOpened = ref(false);
  // Дефолт — реальный текущий месяц/год, а не захардкоженная дата мока
  const selectedMonthName = ref(monthShortNames[now.getMonth()] ?? FALLBACK_MONTH_NAME);
  const selectedYear = ref(String(now.getFullYear()));

  const selectedMonth = computed(() => `${selectedMonthName.value} ${selectedYear.value}`);
  const selectedMonthIndex = computed(() => monthShortNames.indexOf(selectedMonthName.value));

  const allEvents = computed(() => buildScheduleEvents(productsResponse.value ?? []));

  // События выбранного месяца — фильтруем по году и индексу месяца, а не по строковому ключу
  const currentMonthEvents = computed(() =>
    allEvents.value.filter(
      (event) =>
        event.date.getUTCFullYear() === Number(selectedYear.value) &&
        event.date.getUTCMonth() === selectedMonthIndex.value,
    ),
  );

  // Дни месяца, на которые запланированы события — календарь только подсвечивает их, без выбора пользователем
  const eventDays = computed(() =>
    Array.from(new Set(currentMonthEvents.value.map((event) => event.date.getUTCDate()))),
  );

  // Реальное количество дней в выбранном месяце (вместо заглушки "31 для июля/августа, иначе 30")
  const daysInCurrentMonth = computed(
    () => new Date(Number(selectedYear.value), selectedMonthIndex.value + 1, 0).getDate(),
  );

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

  // Сортируем события выбранного месяца по дате и приводим к виду для отображения
  const sortedScheduleItems = computed(() =>
    [...currentMonthEvents.value]
      .sort((first, second) => first.date.getTime() - second.date.getTime())
      .map(toScheduleEvent),
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
    isLoading,
    isError,
    refetch,
  };
}
