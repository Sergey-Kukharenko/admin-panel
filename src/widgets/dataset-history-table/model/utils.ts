import dayjs from 'dayjs';

import type { DatasetPeriod } from './types';

/**
 * Переводит ISO-дату с бэкенда, например "2026-07-24T09:57:23.585609Z",
 * в формат "24 июл. 2026 г., 11:57"
 */
export function formatDatasetGroupDate(dateIso: string): string {
  if (!dateIso) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateIso));
}

export function getPeriodDates(period: DatasetPeriod | '') {
  if (!period) return { gte: undefined, lte: undefined };

  const now = dayjs();
  let gte = dayjs();

  switch (period) {
    case 'today':
      gte = now.startOf('day');
      break;
    case 'week':
      gte = now.subtract(7, 'day').startOf('day');
      break;
    case 'month':
      gte = now.subtract(1, 'month').startOf('day');
      break;
    default:
      return { gte: undefined, lte: undefined };
  }

  return {
    gte: gte.toISOString(),
    lte: now.endOf('day').toISOString(),
  };
}
