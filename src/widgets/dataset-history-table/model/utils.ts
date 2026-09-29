import dayjs from 'dayjs';

import type { DatasetPeriod } from './types';

/**
 * Переводит ISO-дату с бэкенда, например "2026-07-24T09:57:23.585609Z",
 * в формат "24 июл. 2026 г."
 */
export function formatDatasetGroupDate(dateIso: string): string {
  if (!dateIso) return '';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateIso));
}

/**
 * Стабильный ключ дня для day-группы. В отличие от сырого uploaded_at с бэка,
 * который пересчитывается на любое изменение внутри группы (например, когда
 * в неё дозагружается файл), этот ключ не меняется, пока группа остаётся тем
 * же календарным днём — иначе :key и expandedGroups теряют группу между
 * рефетчами и уже раскрытая секция неожиданно схлопывается (см. WT-448).
 */
export function getDatasetGroupDayKey(dateIso: string): string {
  return dayjs(dateIso).format('YYYY-MM-DD');
}

export function getPeriodDates(period: DatasetPeriod | '') {
  if (!period) return { gte: undefined, lte: undefined };

  const now = dayjs();
  let gte = dayjs();

  switch (period) {
    case 'week':
      gte = now.subtract(7, 'day').startOf('day');
      break;
    case 'month':
      gte = now.subtract(30, 'day').startOf('day');
      break;
    default:
      return { gte: undefined, lte: undefined };
  }

  return {
    gte: gte.toISOString(),
    lte: now.endOf('day').toISOString(),
  };
}
