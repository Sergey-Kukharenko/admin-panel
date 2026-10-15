import { describe, expect, it } from 'vitest';

import { formatLastCalculation, formatNextCalculation } from '../utils';

describe('formatNextCalculation', () => {
  it('дата без точки после месяца, в UTC', () => {
    expect(formatNextCalculation('2026-09-30T00:00:00Z', 'ru-RU')).toBe('30 сент, 2026');
    expect(formatNextCalculation('2026-09-30', 'en-US')).toBe('30 Sep, 2026');
  });

  it('нет даты — прочерк', () => {
    expect(formatNextCalculation(null, 'ru-RU')).toBe('-');
  });
});

describe('formatLastCalculation', () => {
  it('только дата, без времени; null, если расчётов не было', () => {
    expect(formatLastCalculation('2026-07-19T23:59:00Z', 'ru-RU')).toBe('19 июл, 2026');
    expect(formatLastCalculation(null, 'ru-RU')).toBeNull();
  });
});
