import { describe, expect, it } from 'vitest';

import type { ProductChartResponse } from '@/entities/product';

import { mapProductChartToView } from '../mapper';

const PERIOD: ProductChartResponse['period'] = {
  start_date: '2026-05-13',
  end_date: '2026-05-15',
  granularity: 'day',
};

function response(overrides: Partial<ProductChartResponse> = {}): ProductChartResponse {
  return {
    chart_name: 'game-recommender',
    period: PERIOD,
    summary: { total_value: 600 },
    filters: null,
    series: [
      {
        series_key: 'main',
        points: [
          { date: '2026-05-13', value: 100 },
          { date: '2026-05-14', value: 200 },
          { date: '2026-05-15', value: 0 },
        ],
      },
      {
        series_key: 'similar',
        points: [
          { date: '2026-05-13', value: 300 },
          { date: '2026-05-15', value: 0 },
        ],
      },
    ],
    has_data: true,
    ...overrides,
  };
}

const OPTIONS = {
  intlLocale: 'ru-RU',
  serviceName: (slug: string) => `name:${slug}`,
  fallbackPeriod: { start_date: '2026-07-01', end_date: '2026-07-31', granularity: 'day' as const },
};

const map = (chart: ProductChartResponse | null, hiddenSeries?: ReadonlySet<string>) =>
  mapProductChartToView(chart, { ...OPTIONS, hiddenSeries });

describe('mapProductChartToView', () => {
  it('one line per ML service in the API order', () => {
    const chart = map(response());

    expect(chart.lines.map((line) => line.seriesKey)).toEqual(['main', 'similar']);
  });

  it('every day of the period is a point; a day missing from a series is 0 (dense, RFC §3)', () => {
    const [main, similar] = map(response()).lines;

    expect(main?.points.map((point) => point.x)).toEqual([0, 50, 100]);
    expect(similar?.points.map((point) => point.y)).toEqual([25, 100, 100]);
  });

  it('the axis fits the largest value; y is the share from the axis top', () => {
    const chart = map(response());

    expect(chart.ticks.map((tick) => tick.label)).toEqual(['400', '300', '200', '100', '0']);
    expect(chart.lines[0]?.points.map((point) => point.y)).toEqual([75, 50, 100]);
  });

  it('colors follow the series order: stats/users first, as in the tooltip 1323:162588', () => {
    expect(map(response()).lines.map((line) => line.color)).toEqual([
      'var(--stats-users)',
      'var(--stats-bets-daily)',
    ]);
  });

  it('labels the first, the middle and the last day as the data chart (WT-326)', () => {
    const period = {
      start_date: '2026-05-13',
      end_date: '2026-06-12',
      granularity: 'day' as const,
    };

    expect(map(response({ period })).dateLabels).toEqual(['13 мая', '28 мая', '12 июня']);
  });

  it('no data: 0–200k axis and one light grey zero line over the period (mockup 1302:140879)', () => {
    const chart = map(response({ has_data: false }));

    expect(chart.ticks.map((tick) => tick.label)).toEqual(['200k', '150k', '100k', '50k', '0']);
    expect(chart.lines).toHaveLength(1);
    expect(chart.lines[0]).toMatchObject({
      seriesKey: 'empty',
      color: 'var(--stats-empty-line)',
    });
    expect(chart.lines[0]?.points.map((point) => point.y)).toEqual([100, 100, 100]);
  });

  it('a product that is not connected (404): the zero line over the fallback period (1418:192043)', () => {
    const chart = map(null);

    expect(chart.ticks[0]?.label).toBe('200k');
    expect(chart.lines.map((line) => [line.seriesKey, line.points.length])).toEqual([
      ['empty', 31],
    ]);
    expect(chart.dateLabels).toEqual(['1 июля', '16 июля', '31 июля']);
  });

  describe('legend', () => {
    it('lists every service with its name and line color, none hidden by default', () => {
      expect(map(response()).legend).toEqual([
        { seriesKey: 'main', label: 'name:main', color: 'var(--stats-users)', hidden: false },
        {
          seriesKey: 'similar',
          label: 'name:similar',
          color: 'var(--stats-bets-daily)',
          hidden: false,
        },
      ]);
    });

    it('a hidden service leaves the lines and the axis, the others keep their colors', () => {
      const chart = map(response(), new Set(['similar']));

      expect(chart.legend.map((item) => item.hidden)).toEqual([false, true]);
      expect(chart.lines.map((line) => [line.seriesKey, line.color])).toEqual([
        ['main', 'var(--stats-users)'],
      ]);
      // without «similar» (300) the largest value is 200: the axis tops at 200
      expect(chart.ticks[0]?.label).toBe('200');
    });

    it('all services hidden: no lines and the empty axis, the legend stays to bring them back', () => {
      const chart = map(response(), new Set(['main', 'similar']));

      expect(chart.lines).toEqual([]);
      expect(chart.ticks[0]?.label).toBe('200k');
      expect(chart.legend).toHaveLength(2);
    });

    it('no legend without data', () => {
      expect(map(response({ has_data: false })).legend).toEqual([]);
      expect(map(null).legend).toEqual([]);
    });
  });

  describe('tooltips (WT-328)', () => {
    it('one per day: the date and every shown line with its legend name and color (1323:162588)', () => {
      const { tooltips } = map(response());

      expect(tooltips).toHaveLength(3);
      expect(tooltips[1]).toEqual({
        title: '14 мая 2026',
        rows: [
          {
            key: 'main',
            label: 'name:main',
            value: '200',
            color: 'var(--stats-users)',
          },
          {
            key: 'similar',
            label: 'name:similar',
            value: '0',
            color: 'var(--stats-bets-daily)',
          },
        ],
        description: '14 мая 2026, name:main 200, name:similar 0',
      });
    });

    it('a line hidden in the legend leaves the tooltip too', () => {
      const { tooltips } = map(response(), new Set(['main']));

      expect(tooltips[0]?.rows.map((row) => row.key)).toEqual(['similar']);
    });

    it('no tooltips without data, for a product that is not connected, with every line hidden', () => {
      expect(map(response({ has_data: false })).tooltips).toEqual([]);
      expect(map(null).tooltips).toEqual([]);
      expect(map(response(), new Set(['main', 'similar'])).tooltips).toEqual([]);
    });

    it('the squares take the line colors: the 4th line is vip-users', () => {
      const four = response({
        series: ['a', 'b', 'c', 'd'].map((key) => ({
          series_key: key,
          points: [{ date: '2026-05-13', value: 1 }],
        })),
      });

      expect(map(four).tooltips[0]?.rows.map((row) => row.color)).toEqual([
        'var(--stats-users)',
        'var(--stats-bets-daily)',
        'var(--stats-neutral)',
        'var(--stats-vip-users)',
      ]);
    });

    it('positions: x of every day, the same as the points of the lines (one tooltip per day)', () => {
      const chart = map(response());

      expect(chart.positions).toEqual([0, 50, 100]);
      expect(chart.positions).toEqual(chart.lines[0]?.points.map((point) => point.x));
      expect(chart.tooltips).toHaveLength(chart.positions.length);
    });

    it('positions of a one-day period: the middle', () => {
      const one = response({
        period: { start_date: '2026-05-13', end_date: '2026-05-13', granularity: 'day' },
      });

      expect(map(one).positions).toEqual([50]);
    });

    it('values and the date in the interface language', () => {
      const big = response({
        series: [{ series_key: 'main', points: [{ date: '2026-05-13', value: 108_217 }] }],
      });
      const en = mapProductChartToView(big, { ...OPTIONS, intlLocale: 'en-US' });

      expect(map(big).tooltips[0]?.rows[0]?.value).toBe('108\u00a0217');
      expect(en.tooltips[0]?.rows[0]?.value).toBe('108,217');
      expect(en.tooltips[0]?.title).toBe('May 13, 2026');
    });
  });

  it('the axis keeps the short labels after a legend toggle (Jira WT-328: «200k», not «200000»)', () => {
    const big = response({
      series: [
        { series_key: 'main', points: [{ date: '2026-05-13', value: 380_000 }] },
        { series_key: 'similar', points: [{ date: '2026-05-13', value: 90_000 }] },
      ],
    });

    expect(map(big).ticks.map((tick) => tick.label)).toEqual(['400k', '300k', '200k', '100k', '0']);
    expect(map(big, new Set(['main'])).ticks.map((tick) => tick.label)).toEqual([
      '100k',
      '75k',
      '50k',
      '25k',
      '0',
    ]);
  });

  it('an invalid period from the API: no points and no tooltips, the chart does not hang', () => {
    const chart = map(response({ period: { ...PERIOD, start_date: 'garbage' } }));

    expect(chart.lines.every((line) => line.points.length === 0)).toBe(true);
    expect(chart.tooltips).toEqual([]);
  });
});
