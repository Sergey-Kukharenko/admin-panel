// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import type { AppChartTooltipRow } from '../AppChartTooltip.types';
import AppChartTooltip from '../AppChartTooltip.vue';

const ROWS: AppChartTooltipRow[] = [
  { key: 'bets', label: 'bets', value: '50 120', color: 'var(--stats-bets)' },
  { key: 'payments', label: 'payments', value: '82 021', color: 'var(--stats-payments)' },
  { key: 'vip-users', label: 'vip-users', value: '128 218', color: 'var(--stats-vip-users)' },
];

describe('AppChartTooltip', () => {
  it('the date, then a row per series with its square, label and value (Figma 55:2287)', () => {
    const wrapper = mount(AppChartTooltip, { props: { title: '12 мая 2026', rows: ROWS } });

    expect(wrapper.find('p').text()).toBe('12 мая 2026');
    expect(wrapper.findAll('[data-chart-tooltip-row]').map((row) => row.text())).toEqual([
      'bets50 120',
      'payments82 021',
      'vip-users128 218',
    ]);
  });

  it('picks the square by the color: the white underlay under a translucent one, the stroke around a dark one', () => {
    const wrapper = mount(AppChartTooltip, { props: { title: '', rows: ROWS } });
    const [bets, payments, vip] = wrapper.findAll('[data-chart-tooltip-swatch]');

    expect(bets?.find('span').attributes('style')).toContain('--series-color: var(--stats-bets)');
    expect(bets?.classes()).not.toContain('bg-(--bg-chart-tooltip-swatch)');
    expect(payments?.classes()).toContain('bg-(--bg-chart-tooltip-swatch)');
    expect(vip?.classes()).not.toContain('bg-(--bg-chart-tooltip-swatch)');
    expect(bets?.find('span').classes()).not.toContain('ring-1');
    expect(vip?.find('span').classes()).toEqual(
      expect.arrayContaining(['ring-1', 'ring-(--border-chart-tooltip-swatch)', 'ring-inset']),
    );
  });

  it('the date and the values at 70%, the labels at 100% (layer opacity of the mockup)', () => {
    const wrapper = mount(AppChartTooltip, { props: { title: 'date', rows: ROWS } });
    const row = wrapper.find('[data-chart-tooltip-row]');
    const [label, value] = row.findAll(':scope > span');

    expect(wrapper.find('p').classes()).toContain('opacity-70');
    expect(value?.classes()).toContain('opacity-70');
    expect(label?.classes()).not.toContain('opacity-70');
  });
});
