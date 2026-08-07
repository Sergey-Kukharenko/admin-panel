function formatDisplayDate(value: string | null, withTime: boolean): string {
  if (!value) return '-';

  const date = new Date(value);

  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit' as const, minute: '2-digit' as const } : {}),
    timeZone: 'UTC',
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const month = getPart('month').replace(/\.$/, '');
  const timeSuffix = withTime ? `, ${getPart('hour')}:${getPart('minute')}` : '';

  return `${getPart('day')} ${month}, ${getPart('year')}${timeSuffix}`;
}

/** next_prediction_date — дата без времени (format: date в схеме бэкенда) */
export function formatNextCalculation(value: string | null): string {
  return formatDisplayDate(value, false);
}

/** last_prediction_at — полноценный date-time */
export function formatLastCalculation(value: string | null): string {
  return formatDisplayDate(value, true);
}
