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

export type PaginationItem = number | 'ellipsis';

const PAGINATION_MAX_SLOTS = 7;
const PAGINATION_SIBLINGS_AFTER = 2;

/**
 * Строит список номеров страниц для пагинации: показывает первую и последнюю
 * страницу всегда, текущую страницу и до двух следующих, скрывая остальные за
 * многоточием. Если с одной из сторон нет многоточия, освободившиеся слоты
 * уходят на расширение окна — общее число элементов держится на PAGINATION_MAX_SLOTS.
 */
export function getPaginationRange(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= PAGINATION_MAX_SLOTS) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = currentPage;
  let end = Math.min(currentPage + PAGINATION_SIBLINGS_AFTER, totalPages);

  let hasLeftEllipsis = start - 2 > 1;
  if (!hasLeftEllipsis) start = 1;

  let hasRightEllipsis = totalPages - end - 1 > 1;
  if (!hasRightEllipsis) end = totalPages;

  let slotsUsed = (hasLeftEllipsis ? 2 : 0) + (hasRightEllipsis ? 2 : 0) + (end - start + 1);

  while (slotsUsed < PAGINATION_MAX_SLOTS && (hasLeftEllipsis || hasRightEllipsis)) {
    if (hasRightEllipsis) {
      end++;
      hasRightEllipsis = totalPages - end - 1 > 1;
      if (!hasRightEllipsis) end = totalPages;
    } else if (hasLeftEllipsis) {
      start--;
      hasLeftEllipsis = start - 2 > 1;
      if (!hasLeftEllipsis) start = 1;
    }

    slotsUsed = (hasLeftEllipsis ? 2 : 0) + (hasRightEllipsis ? 2 : 0) + (end - start + 1);
  }

  const pages: PaginationItem[] = [];
  if (hasLeftEllipsis) {
    pages.push(1, 'ellipsis');
  }
  for (let page = start; page <= end; page++) {
    pages.push(page);
  }
  if (hasRightEllipsis) {
    pages.push('ellipsis', totalPages);
  }

  return pages;
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
