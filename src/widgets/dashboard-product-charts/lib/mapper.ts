import type { ProductChartResponse } from '@/entities/product';
import type { ChartTooltip } from '@/shared/lib/chart';
import {
  buildAxisTicks,
  buildChartTooltip,
  formatDateLabels,
  getAxisMax,
  listDays,
} from '@/shared/lib/chart';

import { EMPTY_LINE_COLOR, SERIES_COLORS } from '../config/seriesColors';
import type { ProductChartLine, ProductChartPlotPoint, ProductChartView } from '../model/types';

interface MapOptions {
  intlLocale: string;
  /** Display name of an ML service by its slug (`useProductDisplayNames().serviceName`) */
  serviceName: (slug: string) => string;
  /** Services hidden in the legend: they leave the lines and the axis */
  hiddenSeries?: ReadonlySet<string>;
  /**
   * Period to draw when the product has no chart (`null`, the API answers 404): the period of the
   * other product's chart, or the last 30 days
   */
  fallbackPeriod: ProductChartResponse['period'];
}

/** x of a day in percent of the plot: the first day on the left edge, the last one on the right */
function dayX(index: number, count: number): number {
  return count === 1 ? 50 : (index / (count - 1)) * 100;
}

function toPoints(
  days: string[],
  valueOf: (date: string) => number,
  axisMax: number,
): ProductChartPlotPoint[] {
  return days.map((date, index) => ({
    date,
    x: dayX(index, days.length),
    y: (1 - valueOf(date) / axisMax) * 100,
  }));
}

/**
 * GET /dashboard/charts/{product} → chart view: one line per ML service over every day of the period.
 * Without data (`has_data: false`) and for a product that is not connected (`null`, the API answers
 * 404) the chart is drawn as the frames «Нет данных» 1302:140879 and «Один из продуктов не доступен»
 * 1418:192043: the 0–200k axis and one light grey zero line with points. Services hidden in the legend
 * leave the lines and the axis (the axis fits the shown ones); with all of them hidden the axis is
 * the empty one and there are no lines.
 */
export function mapProductChartToView(
  response: ProductChartResponse | null,
  { intlLocale, serviceName, hiddenSeries = new Set(), fallbackPeriod }: MapOptions,
): ProductChartView {
  const period = response?.period ?? fallbackPeriod;
  const days = listDays(period.start_date, period.end_date);
  const series = response?.has_data ? response.series : [];
  // the color follows the position in the response, so hiding a service keeps the others' colors
  const colored = series.map((item, index) => ({
    item,
    // the index is always inside the palette; the fallback only satisfies noUncheckedIndexedAccess
    color: SERIES_COLORS[index % SERIES_COLORS.length] ?? EMPTY_LINE_COLOR,
  }));
  const shown = colored.filter(({ item }) => !hiddenSeries.has(item.series_key));

  const maxValue = Math.max(
    0,
    ...shown.flatMap(({ item }) => item.points.map((point) => point.value)),
  );
  const axisMax = getAxisMax(maxValue);
  const ticks = buildAxisTicks(axisMax, intlLocale);

  const shownSeries = shown.map(({ item, color }) => ({
    seriesKey: item.series_key,
    label: serviceName(item.series_key),
    color,
    values: new Map(item.points.map((point) => [point.date, point.value])),
  }));

  const lines: ProductChartLine[] =
    series.length > 0
      ? shownSeries.map(({ seriesKey, color, values }) => ({
          seriesKey,
          color,
          points: toPoints(days, (date) => values.get(date) ?? 0, axisMax),
        }))
      : [
          {
            seriesKey: 'empty',
            color: EMPTY_LINE_COLOR,
            points: toPoints(days, () => 0, axisMax),
          },
        ];

  // the tooltip of a day lists the shown lines with the names of the legend (Figma 1323:162588)
  const tooltips: ChartTooltip[] =
    shownSeries.length > 0
      ? days.map((date) =>
          buildChartTooltip(
            date,
            shownSeries.map(({ seriesKey, label, color, values }) => ({
              key: seriesKey,
              label,
              value: values.get(date) ?? 0,
              color,
            })),
            intlLocale,
          ),
        )
      : [];

  return {
    ticks,
    dateLabels: formatDateLabels(days, intlLocale),
    lines,
    legend: colored.map(({ item, color }) => ({
      seriesKey: item.series_key,
      label: serviceName(item.series_key),
      color,
      hidden: hiddenSeries.has(item.series_key),
    })),
    positions: days.map((_, index) => dayX(index, days.length)),
    tooltips,
  };
}
