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
  });

  it('the column tooltip: the day and every data type in the API order (mockup 1323:162549)', () => {
    const tooltip = mapDataVolumeToChart(response(), 'ru-RU').bars[0]?.tooltip;

    expect(tooltip?.title).toBe('13 мая 2026');
    expect(tooltip?.rows).toEqual([
      {
        key: 'bets',
        label: 'bets',
        value: '30',
        color: 'var(--stats-bets)',
      },
      {
        key: 'users',
        label: 'users',
        value: '20',
        color: 'var(--stats-users)',
      },
    ]);
    expect(tooltip?.description).toBe('13 мая 2026, bets 30, users 20');
  });

  it('a type without uploads that day stays in the tooltip with 0', () => {
    const chart = mapDataVolumeToChart(
      response({
        series: [
          { series_key: 'bets', points: [{ date: '2026-05-13', value: 5 }] },
          { series_key: 'users', points: [] },
        ],
      }),
      'ru-RU',
    );

    expect(chart.bars[0]?.tooltip?.rows.map((row) => [row.label, row.value])).toEqual([
      ['bets', '5'],
      ['users', '0'],
    ]);
  });

  it('a day without uploads has no tooltip: the hatching says «no data» (WT-328)', () => {
    expect(mapDataVolumeToChart(response(), 'ru-RU').bars[1]?.tooltip).toBeNull();
  });

  it.each([
    ['vip-users', 'var(--stats-vip-users)'],
    ['balance-daily', 'var(--stats-balance-daily)'],
    ['payments', 'var(--stats-payments)'],
    ['new-type', 'var(--stats-neutral)'],
  ])('%s: square %s (mockup 55:2287; unknown type grey)', (key, color) => {
    const chart = mapDataVolumeToChart(
      response({ series: [{ series_key: key, points: [{ date: '2026-05-13', value: 1 }] }] }),
      'ru-RU',
    );

    expect(chart.bars[0]?.tooltip?.rows[0]?.color).toBe(color);
  });

  it('values in the locale: 148\u00a0000 in ru, 148,000 in en', () => {
    const big = response({
      series: [{ series_key: 'users', points: [{ date: '2026-05-13', value: 148_000 }] }],
    });

    expect(mapDataVolumeToChart(big, 'ru-RU').bars[0]?.tooltip?.rows[0]?.value).toBe(
      '148\u00a0000',
    );
    expect(mapDataVolumeToChart(big, 'en-US').bars[0]?.tooltip?.rows[0]?.value).toBe('148,000');
    expect(mapDataVolumeToChart(big, 'en-US').bars[0]?.tooltip?.title).toBe('May 13, 2026');
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
    ['ru-RU', '148\u00a0000'],
    ['en-US', '148,000'],
  ])('formats the total for %s (mockup 1322:142113)', (intlLocale, label) => {
    const chart = mapDataVolumeToChart(response({ summary: { total_value: 148_000 } }), intlLocale);

    expect(chart.totalRowsLabel).toBe(label);
  });

  it('the axis keeps the short labels after the data type filter (Jira WT-328: «200k»)', () => {
    const all = response({
      series: [
        { series_key: 'bets', points: [{ date: '2026-05-13', value: 150_000 }] },
        { series_key: 'users', points: [{ date: '2026-05-13', value: 30_000 }] },
      ],
    });
    // the filter asks the API for one type: the response has only its series
    const filtered = response({
      series: [{ series_key: 'users', points: [{ date: '2026-05-13', value: 30_000 }] }],
    });

    expect(mapDataVolumeToChart(all, 'ru-RU').ticks.map((tick) => tick.label)).toEqual([
      '200k',
      '150k',
      '100k',
      '50k',
      '0',
    ]);
    expect(mapDataVolumeToChart(filtered, 'ru-RU').ticks.map((tick) => tick.label)).toEqual([
      '40k',
      '30k',
      '20k',
      '10k',
      '0',
    ]);
  });

  it('an invalid period from the API: no columns, the chart does not hang', () => {
    const chart = mapDataVolumeToChart(
      response({ period: { start_date: 'garbage', end_date: '2026-05-15', granularity: 'day' } }),
      'ru-RU',
    );

    expect(chart.bars).toEqual([]);
    expect(chart.dateLabels).toEqual([]);
  });
});
