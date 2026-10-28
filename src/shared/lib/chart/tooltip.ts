import { formatTooltipDate } from './dateLabels';

/**
 * Series colors of the dashboard charts: the stats/* tokens (Figma stats variables). A closed list:
 * the chart tooltip draws every one of them in its own way, so a new color is added here first
 */
export type ChartSeriesColor =
  | 'var(--stats-bets)'
  | 'var(--stats-users)'
  | 'var(--stats-bets-daily)'
  | 'var(--stats-balance-daily)'
  | 'var(--stats-payments)'
  | 'var(--stats-vip-users)'
  | 'var(--stats-neutral)'
  | 'var(--stats-empty-line)';

/** One series of a day in a chart tooltip */
export interface ChartTooltipRow {
  key: string;
  label: string;
  /** Value formatted for the locale: "148 000" */
  value: string;
  color: ChartSeriesColor;
}

/** Tooltip of a chart day (Figma chart tooltip 55:2287) */
export interface ChartTooltip {
  /** "12 мая 2026" */
  title: string;
  rows: ChartTooltipRow[];
  /** What a screen reader announces for the day: the title and the rows */
  description: string;
}

/** What a screen reader announces for a tooltip: "12 мая 2026, bets 50 120, users 148 000" */
export function describeTooltip(
  title: string,
  rows: readonly { label: string; value: string }[],
): string {
  return [title, ...rows.map((row) => `${row.label} ${row.value}`)].join(', ');
}

/** Tooltip of a chart day: the date, a row per series with its value in the locale */
export function buildChartTooltip(
  date: string,
  series: readonly { key: string; label: string; value: number; color: ChartSeriesColor }[],
  intlLocale: string,
): ChartTooltip {
  const title = formatTooltipDate(date, intlLocale);
  const rows = series.map(({ key, label, value, color }) => ({
    key,
    label,
    value: value.toLocaleString(intlLocale),
    color,
  }));

  return { title, rows, description: describeTooltip(title, rows) };
}
