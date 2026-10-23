// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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
};

const render = () => mount(DashboardProductChartPlot, { props: { chart: CHART } });

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
});
