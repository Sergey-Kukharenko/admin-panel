import type { ChartSeriesColor } from '@/shared/lib/chart';

// Square of every data type in the column tooltip: the color of the columns themselves
// (stats/bets-daily, as `bg-(--stats-bets-daily)` in DashboardDataChartPlot), one for all types. The
// analyst's decision (Natalia, Slack 2026-11-10, WT-571), instead of the grey agreed on 2026-11-06.
// The product chart tooltips keep the line colors.
export const DATA_TYPE_TOOLTIP_COLOR: ChartSeriesColor = 'var(--stats-bets-daily)';
