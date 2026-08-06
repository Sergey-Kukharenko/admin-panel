/**
 * Форматирует ISO-дату в "10 июл 2026, 14:23" (без "г." и точки после месяца,
 * которые добавляет Intl по умолчанию для ru-RU). null/пустая дата -> "-" (например,
 * когда прогон завершился ошибкой и не досчитался).
 */
export function formatRunTimestamp(value: string | null): string {
  if (!value) return '-';

  const parts = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(new Date(value));

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const month = getPart('month').replace(/\.$/, '');

  return `${getPart('day')} ${month} ${getPart('year')}, ${getPart('hour')}:${getPart('minute')}`;
}

export function formatRunRecordsCount(value: number | null): string {
  return value === null ? '-' : value.toLocaleString('ru-RU');
}
