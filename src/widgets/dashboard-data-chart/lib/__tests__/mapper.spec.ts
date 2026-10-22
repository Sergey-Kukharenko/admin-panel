import { describe, expect, it } from 'vitest';

import type { DataVolumeChartResponse } from '@/entities/dataset';

import { mapDataVolumeToChart } from '../mapper';

function response(overrides: Partial<DataVolumeChartResponse> = {}): DataVolumeChartResponse {
  return {
    chart_name: 'data-volume',
    period: { start_date: '2026-05-13', end_date: '2026-05-15', granularity: 'day' },
    summary: { total_value: 70 },
    filters: { dataset_types: [] },
    series: [
      {
        series_key: 'bets',
        points: [
          { date: '2026-05-13', value: 30 },
          { date: '2026-05-14', value: 0 },
          { date: '2026-05-15', value: 10 },
        ],
      },
      {
        series_key: 'users',
        points: [
          { date: '2026-05-13', value: 20 },
          { date: '2026-05-14', value: 0 },
          { date: '2026-05-15', value: 10 },
        ],
      },
    ],
    has_data: true,
    ...overrides,
  };
}

describe('mapDataVolumeToChart', () => {
  it('builds one column per day with the data types in the API order', () => {
    const chart = mapDataVolumeToChart(response(), 'ru-RU');

    expect(chart.totalRows).toBe(70);
    expect(chart.bars.map((bar) => [bar.date, bar.total])).toEqual([
      ['2026-05-13', 50],
      ['2026-05-14', 0],
      ['2026-05-15', 20],
    ]);
    expect(chart.bars[0]?.segments).toEqual([
      { seriesKey: 'bets', value: 30 },
      { seriesKey: 'users', value: 20 },
    ]);
  });

  it('a day without uploads has no segments (drawn hatched)', () => {
    expect(mapDataVolumeToChart(response(), 'ru-RU').bars[1]?.segments).toEqual([]);
  });

  it('draws every day of the period even when a day is missing from the series', () => {
    const chart = mapDataVolumeToChart(
      response({
        period: { start_date: '2026-05-12', end_date: '2026-05-16', granularity: 'day' },
      }),
      'ru-RU',
    );

    expect(chart.bars.map((bar) => bar.date)).toEqual([
      '2026-05-12',
      '2026-05-13',
      '2026-05-14',
      '2026-05-15',
      '2026-05-16',
    ]);
    expect(chart.bars[0]?.total).toBe(0);
  });

  it('labels the first, the middle and the last day (as in mockup 1322:142113)', () => {
    const chart = mapDataVolumeToChart(
      response({
        period: { start_date: '2026-05-13', end_date: '2026-06-12', granularity: 'day' },
      }),
      'ru-RU',
    );

    expect(chart.bars).toHaveLength(31);
    expect(chart.dateLabels).toEqual(['13 мая', '28 мая', '12 июня']);
  });

  it('formats the dates in the interface language', () => {
    expect(mapDataVolumeToChart(response(), 'en-US').dateLabels).toEqual([
      'May 13',
      'May 14',
      'May 15',
    ]);
  });

  it('builds the value axis from the highest day down to 0', () => {
    const chart = mapDataVolumeToChart(response(), 'ru-RU');

    expect(chart.axisMax).toBe(80);
    expect(chart.ticks.map((tick) => tick.label)).toEqual(['80', '60', '40', '20', '0']);
  });

  it('no data at all: hatched days and the mockup axis', () => {
    const chart = mapDataVolumeToChart(
      response({ series: [], summary: { total_value: 0 }, has_data: false }),
      'ru-RU',
    );

    expect(chart.bars.every((bar) => bar.total === 0)).toBe(true);
    expect(chart.ticks.map((tick) => tick.label)).toEqual(['200k', '150k', '100k', '50k', '0']);
  });

  it.each([
    ['ru-RU', '148 000'],
    ['en-US', '148,000'],
  ])('formats the total for %s (mockup 1322:142113)', (intlLocale, label) => {
    const chart = mapDataVolumeToChart(response({ summary: { total_value: 148_000 } }), intlLocale);

    expect(chart.totalRowsLabel).toBe(label);
  });
});
