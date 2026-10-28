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

/**
 * Day of a chart tooltip: "12 мая 2026" / "May 12, 2026", in UTC as the period. The mockup writes
 * «12 Мая, 2026» (Figma chart tooltip 55:2287); the portal dates keep the lowercase month without a
 * comma (asked in WT-328). Intl adds " г." after the year in ru-RU: everything after the year is cut.
 */
export function formatTooltipDate(day: string, intlLocale: string): string {
  const parts = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(`${day}T00:00:00Z`));
  const yearIndex = parts.findIndex((part) => part.type === 'year');

  return parts
    .slice(0, yearIndex + 1)
    .map((part) => part.value)
    .join('');
}
