import { formatDateTime } from '@/shared/lib/formatDateTime';

/** Date and time of a run (`formatDateTime`); "-" without a date (a run that failed early) */
export function formatRunTimestamp(value: string | null, intlLocale: string): string {
  return value ? formatDateTime(value, intlLocale) : '-';
}

export function formatRunRecordsCount(value: number | null, intlLocale: string): string {
  return value === null ? '-' : value.toLocaleString(intlLocale);
}
