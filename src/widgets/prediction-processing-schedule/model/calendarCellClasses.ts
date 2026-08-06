import type { CalendarDay } from './types';

// Общие классы "пилюли" (кружка) для дня и месяца в календаре
const basePillClasses = 'rounded-full inline-flex items-center justify-center transition-colors';

export function getDayCellClasses(day: CalendarDay): string[] {
  return [
    basePillClasses,
    'size-8 text-xs font-normal',
    day.selected && 'bg-[var(--bg-tag-active)] text-[var(--icon-primary)]',
    !day.disabled && !day.selected && 'text-[var(--icon-secondary)]',
    day.disabled && 'opacity-70 text-[rgba(48,48,50,0.25)]',
  ].filter((value): value is string => Boolean(value));
}

export function getMonthCellClasses(month: string, selectedMonthName: string): string[] {
  return [
    basePillClasses,
    'h-8 w-12 text-xs font-normal',
    month === selectedMonthName
      ? 'bg-[var(--bg-tag-active)] text-[var(--icon-primary)]'
      : 'text-[var(--icon-secondary)] hover:bg-[var(--bg-tag-active)]',
  ];
}
