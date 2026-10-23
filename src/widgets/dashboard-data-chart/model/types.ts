import type { AppChartGridTick } from '@/shared/ui/app-chart-grid';

/** One data type of a day: the breakdown for the column tooltip (WT-328); the column is one color */
export interface DataVolumeSegment {
  /** Data type name from the API (`bets`, `users`, …), shown as is: it matches Swagger */
  seriesKey: string;
  value: number;
}

/** One day of the chart */
export interface DataVolumeBar {
  /** UTC day, `YYYY-MM-DD` */
  date: string;
  /** Sum of the day; 0 — nothing was uploaded, drawn as a hatched column */
  total: number;
  /** Non-empty data types of the day in the API order */
  segments: DataVolumeSegment[];
}

export interface DataVolumeChartView {
  totalRows: number;
  /** totalRows formatted for the locale: "148 000" / "148,000" */
  totalRowsLabel: string;
  bars: DataVolumeBar[];
  /** Dates under the first, the middle and the last column */
  dateLabels: string[];
  /** Top of the value axis: column height = total / axisMax */
  axisMax: number;
  /** Value axis from the top line down to 0 */
  ticks: AppChartGridTick[];
}
