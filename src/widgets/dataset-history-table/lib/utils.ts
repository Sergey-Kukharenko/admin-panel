import dayjs from 'dayjs';

import type { DatasetHistoryDayGroup } from '@/entities/dataset';

import type { DatasetPeriod } from '../model/types';

/**
 * ISO date from the backend ("2026-07-24T09:57:23.585609Z") → "24 июл. 2026 г." / "Jul 24, 2026"
 * in the interface locale
 */
export function formatDatasetGroupDate(dateIso: string, intlLocale: string): string {
  if (!dateIso) return '';

  return new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateIso));
}

/**
 * File upload time from the backend → "09:05" in the user's timezone; 24-hour clock in every
 * locale (WT-570). "-" without a value.
 */
export function formatUploadTime(dateIso: string | null, intlLocale: string): string {
  if (!dateIso) return '-';

  return new Intl.DateTimeFormat(intlLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
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

/** Source of files uploaded via the portal UI; also the fallback for a group without files */
const DEFAULT_SOURCE_TYPE = 'client_portal';

/**
 * Raw `source_type` of a group, lower case. The backend groups files by «day + source» but keeps
 * the source on each file, not on the group (WT-590).
 */
export function getDatasetGroupSourceType(dayGroup: DatasetHistoryDayGroup): string {
  const firstFile = dayGroup.dataset_groups.find((group) => group.files.length > 0)?.files[0];

  return (firstFile?.source_type ?? DEFAULT_SOURCE_TYPE).toLowerCase();
}

/**
 * Card key for :key, expanding and auto-expanding: "2026-11-13:client_portal". Several groups of
 * one day differ only by source, so the day alone collides (WT-590); the day part stays stable
 * across refetches (WT-448).
 */
export function getDatasetGroupKey(dayGroup: DatasetHistoryDayGroup): string {
  return `${getDatasetGroupDayKey(dayGroup.uploaded_at)}:${getDatasetGroupSourceType(dayGroup)}`;
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
