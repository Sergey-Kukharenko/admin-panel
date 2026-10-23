/**
 * Date axis labels of a chart over UTC days: the first, the middle and the last day of the period,
 * "13 мая" / "May 13" — a day label, not a month one: it fits a period of days. A period of one or
 * two days repeats a label. Formatted in UTC: the period comes in UTC days.
 */
export function formatDateLabels(days: readonly string[], intlLocale: string): string[] {
  const format = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  const labelDays = [days[0], days[Math.floor((days.length - 1) / 2)], days[days.length - 1]];

  return labelDays
    .filter((day): day is string => Boolean(day))
    .map((day) => format.format(new Date(`${day}T00:00:00Z`)));
}
