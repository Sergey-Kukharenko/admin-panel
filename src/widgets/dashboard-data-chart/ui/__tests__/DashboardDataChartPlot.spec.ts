// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { DataVolumeChartView } from '../../model/types';
import DashboardDataChartPlot from '../DashboardDataChartPlot.vue';

const CHART: DataVolumeChartView = {
  totalRows: 150_000,
  totalRowsLabel: '150 000',
  axisMax: 200_000,
  ticks: [
    { value: 200_000, label: '200k' },
    { value: 150_000, label: '150k' },
    { value: 100_000, label: '100k' },
    { value: 50_000, label: '50k' },
    { value: 0, label: '0' },
  ],
  dateLabels: ['13 мая', '14 мая', '15 мая'],
  bars: [
    {
      date: '2026-05-13',
      total: 150_000,
      segments: [
        { seriesKey: 'bets', value: 100_000 },
        { seriesKey: 'users', value: 50_000 },
      ],
    },
    { date: '2026-05-14', total: 0, segments: [] },
    {
      date: '2026-05-15',
      total: 200_000,
      segments: [{ seriesKey: 'bets', value: 200_000 }],
    },
  ],
};

const render = () => mount(DashboardDataChartPlot, { props: { chart: CHART } });
const columnsOf = (wrapper: ReturnType<typeof render>) => wrapper.findAll('[data-chart-bar]');

describe('DashboardDataChartPlot', () => {
  it('draws the value axis and the three dates (mockup 1322:142113)', () => {
    const text = render().text();

    for (const label of ['200k', '150k', '100k', '50k', '0', '13 мая', '14 мая', '15 мая']) {
      expect(text).toContain(label);
    }
  });

  it('one column per day; the column height is the share of the axis top, at least 1px', () => {
    const columns = columnsOf(render());
    const [first, , third] = columns;

    expect(columns).toHaveLength(3);
    expect(first?.attributes('style')).toContain('height: 75%');
    expect(third?.attributes('style')).toContain('height: 100%');
    expect(first?.classes()).toContain('min-h-px');
  });

  it('a column is one color whatever its data types (frames 1322:142113 / 1361:147668)', () => {
    const [first, , third] = columnsOf(render());

    expect(first?.classes()).toContain('bg-(--stats-bets-daily)');
    expect(third?.classes()).toContain('bg-(--stats-bets-daily)');
  });

  it('a day without uploads is a hatched column of the mockup height (Bar item type=empty)', () => {
    const empty = columnsOf(render())[1];

    expect(empty?.attributes('data-chart-bar')).toBe('empty');
    expect(empty?.classes()).toEqual(
      expect.arrayContaining(['h-37', 'bg-(image:--bg-chart-empty-bar-hatch)']),
    );
  });
});
