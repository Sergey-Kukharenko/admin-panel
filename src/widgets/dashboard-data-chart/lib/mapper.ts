import type { DataVolumeChartResponse } from '@/entities/dataset';
import {
  buildAxisTicks,
  buildChartTooltip,
  formatDateLabels,
  getAxisMax,
  listDays,
} from '@/shared/lib/chart';

import { DATA_TYPE_COLORS, OTHER_DATA_TYPE_COLOR } from '../config/seriesColors';
import type { DataVolumeBar, DataVolumeChartView } from '../model/types';

/**
 * GET /dashboard/charts/data-volume → chart view. Columns follow the period, so a day missing from
 * every series is still drawn (as a day without uploads).
 */
export function mapDataVolumeToChart(
  response: DataVolumeChartResponse,
  intlLocale: string,
): DataVolumeChartView {
  const days = listDays(response.period.start_date, response.period.end_date);
  const valuesBySeries = response.series.map((series) => ({
    seriesKey: series.series_key,
    values: new Map(series.points.map((point) => [point.date, point.value])),
  }));

  const bars: DataVolumeBar[] = days.map((date) => {
    const values = valuesBySeries.map(({ seriesKey, values: byDate }) => ({
      seriesKey,
      value: byDate.get(date) ?? 0,
    }));
    const total = values.reduce((sum, { value }) => sum + value, 0);

    // every data type of the response, zeros included; the type name is the label
    const series = values.map(({ seriesKey, value }) => ({
      key: seriesKey,
      label: seriesKey,
      value,
      color: DATA_TYPE_COLORS[seriesKey] ?? OTHER_DATA_TYPE_COLOR,
    }));

    return { date, total, tooltip: total > 0 ? buildChartTooltip(date, series, intlLocale) : null };
  });

  const axisMax = getAxisMax(Math.max(0, ...bars.map((bar) => bar.total)));
  const ticks = buildAxisTicks(axisMax, intlLocale);

  return {
    totalRows: response.summary.total_value,
    totalRowsLabel: response.summary.total_value.toLocaleString(intlLocale),
    bars,
    dateLabels: formatDateLabels(days, intlLocale),
    axisMax,
    ticks,
  };
}
