import { describe, expect, it } from 'vitest';

import { buildChartTooltip, describeTooltip } from '../tooltip';

describe('describeTooltip', () => {
  it('the title, then «label value» of every row, comma separated', () => {
    expect(
      describeTooltip('12 мая 2026', [
        { label: 'bets', value: '50 120' },
        { label: 'users', value: '148 000' },
      ]),
    ).toBe('12 мая 2026, bets 50 120, users 148 000');
  });

  it('no rows: the title alone', () => {
    expect(describeTooltip('12 мая 2026', [])).toBe('12 мая 2026');
  });
});

describe('buildChartTooltip', () => {
  const series = [
    { key: 'bets', label: 'bets', value: 50120, color: 'var(--stats-bets)' },
    { key: 'users', label: 'users', value: 0, color: 'var(--stats-users)' },
  ] as const;

  it('the date, the values in the locale (zeros too) and the screen reader text', () => {
    const tooltip = buildChartTooltip('2026-05-12', series, 'ru-RU');

    expect(tooltip.title).toBe('12 мая 2026');
    expect(tooltip.rows).toEqual([
      { key: 'bets', label: 'bets', value: '50\u00a0120', color: 'var(--stats-bets)' },
      { key: 'users', label: 'users', value: '0', color: 'var(--stats-users)' },
    ]);
    expect(tooltip.description).toBe('12 мая 2026, bets 50\u00a0120, users 0');
  });

  it('en: «May 12, 2026» and 50,120', () => {
    const tooltip = buildChartTooltip('2026-05-12', series, 'en-US');

    expect(tooltip.title).toBe('May 12, 2026');
    expect(tooltip.rows[0]?.value).toBe('50,120');
  });
});
