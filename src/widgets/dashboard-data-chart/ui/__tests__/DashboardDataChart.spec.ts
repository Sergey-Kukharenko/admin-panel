// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';

import { i18n } from '@/shared/i18n';

import type { DataVolumeChartView } from '../../model/types';
import DashboardDataChart from '../DashboardDataChart.vue';

const state = {
  isLoading: ref(false),
  isError: ref(false),
  chart: ref<DataVolumeChartView | null>(null),
  refetch: vi.fn(),
};

// The states cannot be reached on the synchronous mock: the widget composable is replaced
vi.mock('../../model/useDashboardDataChart', () => ({
  useDashboardDataChart: () => ({
    ...state,
    typeOptions: computed(() => []),
    selectedTypeId: ref(''),
  }),
}));

const CHART: DataVolumeChartView = {
  totalRows: 0,
  totalRowsLabel: '0',
  axisMax: 200_000,
  ticks: [200_000, 150_000, 100_000, 50_000, 0].map((value) => ({ value, label: String(value) })),
  dateLabels: [],
  bars: [],
};

const render = () => mount(DashboardDataChart, { global: { plugins: [i18n] } });

describe('DashboardDataChart states', () => {
  beforeEach(() => {
    state.isLoading.value = false;
    state.isError.value = false;
    state.chart.value = null;
    state.refetch.mockClear();
  });

  it('loading: the header stays, the skeleton replaces the total, the plot and the filter', () => {
    state.isLoading.value = true;
    const wrapper = render();

    expect(wrapper.get('h2').text()).toBe(i18n.global.t('dashboard.dataChart.title'));
    expect(wrapper.find('[data-chart-bar]').exists()).toBe(false);
    expect(wrapper.find('[data-chart-skeleton]').exists()).toBe(true);
  });

  it('error without data: the error state, its button refetches', async () => {
    state.isError.value = true;
    const wrapper = render();

    expect(wrapper.text()).toContain(i18n.global.t('dashboard.dataChart.error.title'));
    await wrapper.get('button').trigger('click');
    expect(state.refetch).toHaveBeenCalledOnce();
  });

  it('data: the total and the plot, no skeleton or error', () => {
    state.chart.value = CHART;
    const wrapper = render();

    expect(wrapper.text()).toContain(i18n.global.t('dashboard.dataChart.rows', 0));
    expect(wrapper.text()).not.toContain(i18n.global.t('dashboard.dataChart.error.title'));
  });
});
