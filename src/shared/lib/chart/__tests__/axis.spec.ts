import { describe, expect, it } from 'vitest';

import { buildAxisTicks, EMPTY_AXIS_MAX, formatAxisValue, getAxisMax } from '../axis';

describe('getAxisMax', () => {
  it.each([
    [148_000, 200_000], // as in mockup 1322:142113: 50k steps up to 200k
    [160_000, 200_000],
    [200_000, 200_000],
    [200_001, 400_000],
    [90_000, 100_000],
    [1_500_000, 2_000_000],
    [37, 40],
    [2, 4], // whole rows: no 0.5 steps
    [1, 4],
  ])('fits %i into a round axis top %i', (max, axisMax) => {
    expect(getAxisMax(max)).toBe(axisMax);
  });

  it('keeps the mockup scale when there is no data (1300:139202)', () => {
    expect(getAxisMax(0)).toBe(EMPTY_AXIS_MAX);
  });
});

describe('formatAxisValue', () => {
  it.each([
    [0, 'ru-RU', '0'],
    [500, 'ru-RU', '500'],
    [50_000, 'ru-RU', '50k'],
    [12_500, 'ru-RU', '12,5k'], // a 50k axis has 12.5k and 37.5k ticks: the decimal comma in ru
    [12_500, 'en-US', '12.5k'],
    [200_000, 'ru-RU', '200k'],
    [1_000_000, 'ru-RU', '1M'],
    [2_500_000, 'ru-RU', '2,5M'],
    [2_500_000, 'en-US', '2.5M'],
  ])('%i in %s → %s', (value, intlLocale, label) => {
    expect(formatAxisValue(value, intlLocale)).toBe(label);
  });
});

describe('buildAxisTicks', () => {
  it('five ticks from the top down to 0, labelled in the locale', () => {
    expect(buildAxisTicks(200_000, 'ru-RU')).toEqual([
      { value: 200_000, label: '200k' },
      { value: 150_000, label: '150k' },
      { value: 100_000, label: '100k' },
      { value: 50_000, label: '50k' },
      { value: 0, label: '0' },
    ]);
  });

  it('a 50k top has fractional ticks: 12,5k in ru, 12.5k in en', () => {
    expect(buildAxisTicks(50_000, 'ru-RU').map((tick) => tick.label)).toEqual([
      '50k',
      '37,5k',
      '25k',
      '12,5k',
      '0',
    ]);
    expect(buildAxisTicks(50_000, 'en-US')[3]?.label).toBe('12.5k');
  });
});
