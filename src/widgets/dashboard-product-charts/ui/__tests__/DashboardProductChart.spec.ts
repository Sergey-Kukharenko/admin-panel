// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import type { ProductChartItem, ProductChartView } from '../../model/types';
import DashboardProductChart from '../DashboardProductChart.vue';

const CHART: ProductChartView = {
  ticks: [200, 150, 100, 50, 0].map((value) => ({ value, label: String(value) })),
  dateLabels: ['first', 'last'],
  lines: [],
  legend: [
    { seriesKey: 'main', label: 'Recommended for You', color: 'var(--stats-users)', hidden: false },
    {
      seriesKey: 'similar',
      label: 'Similar Games',
      color: 'var(--stats-bets-daily)',
      hidden: true,
    },
  ],
};

function render(overrides: Partial<ProductChartItem> = {}) {
  const item: ProductChartItem = {
    productSlug: 'game-recommender',
    title: 'Recommender System',
    subtitle: 'subtitle',
    isLoading: false,
    isError: false,
    chart: CHART,
    ...overrides,
  };
  return {
    item,
    wrapper: mount(DashboardProductChart, { props: { item }, global: { plugins: [i18n] } }),
  };
}

describe('DashboardProductChart states', () => {
  it('data: the header and the plot', () => {
    const { wrapper } = render();

    expect(wrapper.get('h3').text()).toBe('Recommender System');
    expect(wrapper.text()).toContain('first');
    expect(wrapper.find('[data-chart-skeleton]').exists()).toBe(false);
  });

  it('loading: the header stays, a skeleton takes the place of the plot', () => {
    const { wrapper } = render({ isLoading: true, chart: null });

    expect(wrapper.get('h3').text()).toBe('Recommender System');
    expect(wrapper.find('[data-chart-skeleton]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('first');
  });

  it('error without data: the error state, its button asks to retry this chart', async () => {
    const { wrapper } = render({ isError: true, chart: null });

    expect(wrapper.text()).toContain(i18n.global.t('dashboard.productCharts.error.title'));
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('retry')).toHaveLength(1);
  });

  it('legend: a checkbox per service, checked when shown; a click toggles that service', async () => {
    const { wrapper } = render();
    const group = wrapper.get('[role="group"]');
    const boxes = group.findAll('button[role="checkbox"]');

    expect(group.attributes('aria-label')).toBe(
      i18n.global.t('dashboard.productCharts.legend', { product: 'Recommender System' }),
    );
    expect(group.text()).toContain('Recommended for You');
    expect(boxes.map((box) => box.attributes('aria-checked'))).toEqual(['true', 'false']);

    await boxes[1]?.trigger('click');
    expect(wrapper.emitted('toggle')).toEqual([['similar']]);
  });

  it('no legend without services (no data, product not connected)', () => {
    const { wrapper } = render({ chart: { ...CHART, legend: [] } });

    expect(wrapper.find('[role="group"]').exists()).toBe(false);
  });
});
