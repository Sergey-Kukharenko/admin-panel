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

  it('is hidden from screen readers: the chart is described by its title', () => {
    const wrapper = mount(AppChartGrid, { props: { ticks: TICKS, dateLabels: [] } });

    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });
});
