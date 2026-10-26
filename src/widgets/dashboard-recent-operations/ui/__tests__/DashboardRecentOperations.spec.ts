// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';

import { i18n } from '@/shared/i18n';

import type { RecentOperationsView } from '../../model/types';
import DashboardRecentOperations from '../DashboardRecentOperations.vue';

const state = {
  view: ref<RecentOperationsView | null>(null),
  isLoading: ref(false),
  isError: ref(false),
  refetch: vi.fn(),
};

vi.mock('../../model/useDashboardRecentOperations', () => ({
  useDashboardRecentOperations: () => ({
    view: state.view,
    hasData: computed(() => (state.view.value?.rows.length ?? 0) > 0),
    countLabel: computed(() =>
      state.view.value ? `${state.view.value.totalCount} operations` : '',
    ),
    isLoading: state.isLoading,
    isError: state.isError,
    refetch: state.refetch,
  }),
}));

const VIEW: RecentOperationsView = {
  totalCount: 12,
  rows: [
    {
      id: 'op-1',
      dateLabel: '1 июл 2026, 11:10',
      typeLabel: 'Загрузка данных',
      details: 'bets · CSV · 145 000 строк',
      status: 'success',
    },
    {
      id: 'op-2',
      dateLabel: '1 июл 2026, 09:42',
      typeLabel: 'Прогон модели',
      details: 'VIP Churn · 145 000 строк',
      status: 'error',
    },
  ],
};

const render = () => mount(DashboardRecentOperations, { global: { plugins: [i18n] } });
const t = i18n.global.t;

describe('DashboardRecentOperations states', () => {
  beforeEach(() => {
    state.view.value = VIEW;
    state.isLoading.value = false;
    state.isError.value = false;
    state.refetch.mockClear();
  });

  it('data: the title, the counter of all operations and a table row per operation', () => {
    const wrapper = render();

    expect(wrapper.get('h2').text()).toBe(t('dashboard.recentOperations.title'));
    expect(wrapper.text()).toContain('12 operations');
    expect(wrapper.get('table').attributes('aria-labelledby')).toBe(
      wrapper.get('h2').attributes('id'),
    );
    expect(wrapper.findAll('th').map((th) => th.text())).toEqual([
      t('dashboard.recentOperations.columns.date'),
      t('dashboard.recentOperations.columns.type'),
      t('dashboard.recentOperations.columns.details'),
      t('dashboard.recentOperations.columns.status'),
    ]);
    const rows = wrapper.findAll('[data-operation-row]');
    expect(rows).toHaveLength(2);
    expect(rows[0]?.text()).toContain('bets · CSV · 145 000 строк');
    expect(rows[1]?.text()).toContain(t('common.statusBadge.error'));
  });

  it('loading: the title stays, a skeleton instead of the table, no counter', () => {
    state.view.value = null;
    state.isLoading.value = true;
    const wrapper = render();

    expect(wrapper.find('h2').exists()).toBe(true);
    // the loading table of the UI kit: the frame without operations, hidden from screen readers
    expect(wrapper.get('[data-operations-skeleton]').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('[data-operation-row]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('12 operations');
  });

  it('error without data: the error state, its button refetches', async () => {
    state.view.value = null;
    state.isError.value = true;
    const wrapper = render();

    expect(wrapper.find('[data-operations-error]').exists()).toBe(true);
    await wrapper.get('button').trigger('click');
    expect(state.refetch).toHaveBeenCalledOnce();
  });

  it('no operations: the empty state of the mockup (1574:181731), no table and no counter', () => {
    state.view.value = { rows: [], totalCount: 0 };
    const wrapper = render();

    expect(wrapper.find('[data-operations-empty]').text()).toContain(
      t('dashboard.recentOperations.empty.title'),
    );
    expect(wrapper.find('table').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('0 operations');
  });
});
