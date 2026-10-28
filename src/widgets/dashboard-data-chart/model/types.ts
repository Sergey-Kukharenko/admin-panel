import type { ChartTooltip } from '@/shared/lib/chart';
import type { AppChartGridTick } from '@/shared/ui/app-chart-grid';

/** One day of the chart */
export interface DataVolumeBar {
  /** UTC day, `YYYY-MM-DD` */
  date: string;
  /** Sum of the day; 0 — nothing was uploaded, drawn as a hatched column */
  total: number;
  /**
   * The day and every data type of the response in the API order, zeros included; the type name is
   * shown as is (it matches Swagger). null for a day without uploads: the hatching already says
   * «no data», no tooltip (WT-328)
   */
  tooltip: ChartTooltip | null;
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
