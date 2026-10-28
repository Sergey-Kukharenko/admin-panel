// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

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
      tooltip: {
        title: '13 мая 2026',
        rows: [
          {
            key: 'bets',
            label: 'bets',
            value: '100 000',
            color: 'var(--stats-bets)',
          },
          {
            key: 'users',
            label: 'users',
            value: '50 000',
            color: 'var(--stats-users)',
          },
        ],
        description: '13 мая 2026, bets 100 000, users 50 000',
      },
    },
    { date: '2026-05-14', total: 0, tooltip: null },
    {
      date: '2026-05-15',
      total: 200_000,
      tooltip: {
        title: '15 мая 2026',
        rows: [{ key: 'bets', label: 'bets', value: '200 000', color: 'var(--stats-bets)' }],
        description: '15 мая 2026, bets 200 000',
      },
    },
  ],
};

const render = () =>
  mount(DashboardDataChartPlot, { props: { chart: CHART }, global: { plugins: [i18n] } });
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

  it('the columns are hidden from screen readers; the tooltip layer is the focusable chart', () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');

    expect(columnsOf(wrapper)[0]?.element.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(layer.attributes('tabindex')).toBe('0');
    expect(layer.attributes('aria-label')).toBe(i18n.global.t('dashboard.dataChart.plotLabel'));
  });

  it('the layer cells are centered on the columns: (index + 0.5) / days', async () => {
    const wrapper = render();
    await wrapper.find('[data-chart-tooltip-layer]').trigger('keydown', { key: 'ArrowRight' });

    const tooltip = wrapper.find('[data-chart-tooltip]');
    expect(tooltip.text()).toContain('13 мая 2026');
    expect(tooltip.findAll('[data-chart-tooltip-row]').map((row) => row.text())).toEqual([
      'bets100 000',
      'users50 000',
    ]);
    expect(tooltip.element.parentElement?.getAttribute('style')).toContain(
      `left: ${(0.5 / 3) * 100}%`,
    );
  });

  it('the arrows skip a hatched day: it has no tooltip (WT-328)', async () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    await layer.trigger('keydown', { key: 'ArrowRight' });
    await layer.trigger('keydown', { key: 'ArrowRight' });

    expect(wrapper.find('[data-chart-tooltip]').text()).toContain('15 мая 2026');
    expect(wrapper.find('[data-chart-tooltip-layer]').attributes('aria-valuetext')).toBe(
      '15 мая 2026, bets 200 000',
    );
  });

  it('a period without uploads: no tooltip layer, nothing focusable that would stay silent', () => {
    const empty = {
      ...CHART,
      bars: CHART.bars.map((bar) => ({ ...bar, total: 0, tooltip: null })),
    };
    const wrapper = mount(DashboardDataChartPlot, {
      props: { chart: empty },
      global: { plugins: [i18n] },
    });

    expect(wrapper.find('[data-chart-tooltip-layer]').exists()).toBe(false);
  });
});
