// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import type { ProductChartView } from '../../model/types';
import DashboardProductChartPlot from '../DashboardProductChartPlot.vue';

const CHART: ProductChartView = {
  ticks: [400, 300, 200, 100, 0].map((value) => ({ value, label: String(value) })),
  dateLabels: ['first', 'last'],
  legend: [],
  lines: [
    {
      seriesKey: 'main',
      color: 'var(--stats-users)',
      points: [
        { date: '2026-05-13', x: 0, y: 75 },
        { date: '2026-05-14', x: 100, y: 50 },
      ],
    },
  ],
  positions: [0, 100],
  tooltips: [
    {
      title: '13 мая 2026',
      rows: [
        { key: 'main', label: 'Recommended for You', value: '100', color: 'var(--stats-users)' },
      ],
      description: '13 мая 2026, Recommended for You 100',
    },
    {
      title: '14 мая 2026',
      rows: [
        { key: 'main', label: 'Recommended for You', value: '200', color: 'var(--stats-users)' },
      ],
      description: '14 мая 2026, Recommended for You 200',
    },
  ],
};

const render = (chart: ProductChartView = CHART) =>
  mount(DashboardProductChartPlot, {
    props: { chart, productName: 'Recommender System' },
    global: { plugins: [i18n] },
  });

describe('DashboardProductChartPlot', () => {
  it('draws the value axis and the date labels on the shared chart grid', () => {
    const text = render().text();

    for (const label of ['400', '300', '200', '100', '0', 'first', 'last']) {
      expect(text).toContain(label);
    }
  });

  it('one polyline per line through its points, in the line color', () => {
    const wrapper = render();
    const polyline = wrapper.get('polyline');

    expect(wrapper.findAll('polyline')).toHaveLength(1);
    expect(polyline.attributes('points')).toBe('0,75 100,50');
    expect(polyline.classes()).toContain('stroke-(--series-color)');
    expect(polyline.attributes('style')).toContain('--series-color: var(--stats-users)');
  });

  it('a marker on every point in the line color, placed by percent of the plot', () => {
    const markers = render().findAll('[data-marker]');

    expect(markers).toHaveLength(2);
    expect(markers[1]?.classes()).toContain('border-(--series-color)');
    expect(markers[1]?.element.parentElement?.getAttribute('style')).toContain(
      '--series-color: var(--stats-users)',
    );
    expect(markers[1]?.attributes('style')).toContain('left: 100%; top: 50%;');
  });

  it('the lines and the markers are hidden from screen readers; the tooltip layer is the chart', () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');

    expect(wrapper.find('svg').element.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(layer.attributes('aria-label')).toBe(
      i18n.global.t('dashboard.productCharts.plotLabel', { product: 'Recommender System' }),
    );
  });

  it('the tooltip of a day: the date and the shown lines, with the cursor on the point (1323:162588)', async () => {
    const wrapper = render();
    await wrapper.find('[data-chart-tooltip-layer]').trigger('keydown', { key: 'End' });

    expect(wrapper.find('[data-chart-tooltip]').text()).toBe('14 мая 2026Recommended for You200');
    expect(wrapper.find('[data-chart-cursor]').attributes('style')).toContain('left: 100%');
  });

  it('no tooltip layer on a chart without data: the zero line has nothing to tell', () => {
    expect(
      render({ ...CHART, tooltips: [] })
        .find('[data-chart-tooltip-layer]')
        .exists(),
    ).toBe(false);
  });
});
