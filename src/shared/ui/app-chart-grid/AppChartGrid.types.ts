/** One line of the value axis */
export interface AppChartGridTick {
  value: number;
  /** Short label: "50k", "200" */
  label: string;
}

export interface AppChartGridProps {
  /** Value axis from the top line down to 0: exactly five ticks, the grid height is laid out for them */
  ticks: readonly AppChartGridTick[];
  /** Dates under the plot, spread from the first to the last column (`formatDateLabels`: 3 labels) */
  dateLabels: readonly string[];
}
