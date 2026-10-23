// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed } from 'vue';

import { i18n } from '@/shared/i18n';

import type { ProductChartItem } from '../../model/types';
import DashboardProductCharts from '../DashboardProductCharts.vue';

const refetch = vi.fn();
const toggleSeries = vi.fn();

const ITEMS: ProductChartItem[] = [
  {
    productSlug: 'game-recommender',
    title: 'Recommender System',
    subtitle: 'subtitle',
    isLoading: false,
    isError: false,
    chart: {
      ticks: [200, 150, 100, 50, 0].map((value) => ({ value, label: String(value) })),
      dateLabels: ['first', 'middle', 'last'],
      lines: [],
      legend: [
        {
          seriesKey: 'main',
          label: 'Recommended for You',
          color: 'var(--stats-users)',
          hidden: false,
        },
      ],
    },
  },
  {
    productSlug: 'player-intelligence',
    title: 'Player Intelligence',
    subtitle: 'subtitle',
    isLoading: false,
    isError: true,
    chart: null,
  },
];

vi.mock('../../model/useDashboardProductCharts', () => ({
  useDashboardProductCharts: () => ({ charts: computed(() => ITEMS), refetch, toggleSeries }),
}));

describe('DashboardProductCharts', () => {
  it('the retry of a failed chart refetches that product only', async () => {
    const wrapper = mount(DashboardProductCharts, { global: { plugins: [i18n] } });

    await wrapper.findAll('article')[1]?.get('button').trigger('click');

    expect(refetch).toHaveBeenCalledExactlyOnceWith('player-intelligence');
  });

  it('a legend click toggles the service of that product', async () => {
    const wrapper = mount(DashboardProductCharts, { global: { plugins: [i18n] } });

    await wrapper.findAll('article')[0]?.get('button[role="checkbox"]').trigger('click');

    expect(toggleSeries).toHaveBeenCalledExactlyOnceWith('game-recommender', 'main');
  });

  it('the period badge takes the number of days of the charts', () => {
    const wrapper = mount(DashboardProductCharts, { global: { plugins: [i18n] } });

    expect(wrapper.text()).toContain(i18n.global.t('dashboard.productCharts.period', 30));
  });
});
