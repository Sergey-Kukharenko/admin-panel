function formatDisplayDate(value: string, intlLocale: string): string {
  const parts = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(value));

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const month = getPart('month').replace(/\.$/, '');

  return `${getPart('day')} ${month}, ${getPart('year')}`;
}

/** next_prediction_date — дата без времени (format: date в схеме бэкенда) */
export function formatNextCalculation(value: string | null, intlLocale: string): string {
  if (!value) return '-';

  return formatDisplayDate(value, intlLocale);
}

/**
 * last_prediction_at — date-time, но в карточке по макетам только дата, без времени;
 * null, если успешных расчетов еще не было
 */
export function formatLastCalculation(value: string | null, intlLocale: string): string | null {
  if (!value) return null;

  return formatDisplayDate(value, intlLocale);
}
