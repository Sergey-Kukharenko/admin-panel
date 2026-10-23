import type { DataVolumeChartResponse } from '@/entities/dataset';
import { buildAxisTicks, formatDateLabels, getAxisMax, listDays } from '@/shared/lib/chart';

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
    const segments = valuesBySeries
      .map(({ seriesKey, values }) => ({
        seriesKey,
        value: values.get(date) ?? 0,
      }))
      .filter((segment) => segment.value > 0);

    return { date, total: segments.reduce((sum, segment) => sum + segment.value, 0), segments };
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
