/**
 * Date and time of an event in tables: "10 июл 2026, 14:23" (en: "10 Jul 2026, 14:23"), as the run
 * history and the dashboard operations mockups (Figma 1574:181319). Built from the parts: Intl adds
 * "г." and a dot after the short month for ru-RU. Shown in UTC, as the backend timestamps.
 * An unparsable value gives "-": Intl throws a RangeError on an invalid date and would break the row.
 */
export function formatDateTime(value: string, intlLocale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const parts = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const month = getPart('month').replace(/\.$/, '');

  return `${getPart('day')} ${month} ${getPart('year')}, ${getPart('hour')}:${getPart('minute')}`;
}
