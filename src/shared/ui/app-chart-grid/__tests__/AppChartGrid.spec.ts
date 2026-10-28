// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppChartGrid from '../AppChartGrid.vue';

const TICKS = [200, 150, 100, 50, 0].map((value) => ({ value, label: String(value) }));

describe('AppChartGrid', () => {
  it('a row per tick from the top down, the dates in order, the plot from the slot', () => {
    const wrapper = mount(AppChartGrid, {
      props: { ticks: TICKS, dateLabels: ['first', 'middle', 'last'] },
      slots: { default: '<i class="plot" />' },
    });

    expect(wrapper.findAll('[data-chart-tick]').map((row) => row.text())).toEqual([
      '200',
      '150',
      '100',
      '50',
      '0',
    ]);
    expect(wrapper.findAll('[data-chart-date]').map((label) => label.text())).toEqual([
      'first',
      'middle',
      'last',
    ]);
    expect(wrapper.find('i.plot').exists()).toBe(true);
  });

  it('equal date labels all render (a one-day period)', () => {
    const wrapper = mount(AppChartGrid, {
      props: { ticks: TICKS, dateLabels: ['July 1', 'July 1', 'July 1'] },
    });

    expect(wrapper.findAll('[data-chart-date]')).toHaveLength(3);
  });

  it('hides the axis and the dates from screen readers, not the slot (the tooltip layer, WT-328)', () => {
    const wrapper = mount(AppChartGrid, {
      props: { ticks: TICKS, dateLabels: ['July 1'] },
      slots: { default: '<div data-plot />' },
    });

    expect(wrapper.attributes('aria-hidden')).toBeUndefined();
    expect(
      wrapper.find('[data-chart-tick]').element.closest('[aria-hidden="true"]'),
    ).not.toBeNull();
    expect(
      wrapper.find('[data-chart-date]').element.closest('[aria-hidden="true"]'),
    ).not.toBeNull();
    expect(wrapper.find('[data-plot]').element.closest('[aria-hidden="true"]')).toBeNull();
  });
});
