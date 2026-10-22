import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type { DataVolumeChartResponse } from '@/entities/dataset';

import type { DataVolumeBar, DataVolumeChartView } from '../model/types';
import { AXIS_INTERVALS, formatAxisValue, getAxisMax } from './axis';

dayjs.extend(utc);

/** Every UTC day from `start` to `end` inclusive, `YYYY-MM-DD` */
function listDays(start: string, end: string): string[] {
  const days: string[] = [];
  const last = dayjs.utc(end);
  for (let day = dayjs.utc(start); !day.isAfter(last); day = day.add(1, 'day')) {
    days.push(day.format('YYYY-MM-DD'));
  }
  return days;
}

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
  const ticks = Array.from({ length: AXIS_INTERVALS + 1 }, (_, index) => {
    const value = (axisMax / AXIS_INTERVALS) * (AXIS_INTERVALS - index);
    return { value, label: formatAxisValue(value, intlLocale) };
  });

  // "12 мая" / "May 12": the period is in UTC days, so the label is formatted in UTC too
  const dateFormat = new Intl.DateTimeFormat(intlLocale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
  const labelDays = [days[0], days[Math.floor((days.length - 1) / 2)], days[days.length - 1]];

  return {
    totalRows: response.summary.total_value,
    totalRowsLabel: response.summary.total_value.toLocaleString(intlLocale),
    bars,
    dateLabels: labelDays
      .filter((day): day is string => Boolean(day))
      .map((day) => dateFormat.format(new Date(`${day}T00:00:00Z`))),
    axisMax,
    ticks,
  };
}
