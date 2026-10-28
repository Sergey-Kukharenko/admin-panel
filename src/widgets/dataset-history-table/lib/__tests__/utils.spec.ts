import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatDatasetGroupDate, getDatasetGroupDayKey, getPeriodDates } from '../utils';

afterEach(() => {
  vi.useRealTimers();
});

describe('formatDatasetGroupDate', () => {
  it.each([
    ['ru-RU', '24 июл. 2026 г.'],
    ['en-US', 'Jul 24, 2026'],
  ])('formats the group date in %s', (intlLocale, expected) => {
    expect(formatDatasetGroupDate('2026-07-24T09:57:23.585609Z', intlLocale)).toBe(expected);
  });

  it('returns an empty string without a date', () => {
    expect(formatDatasetGroupDate('', 'ru-RU')).toBe('');
  });
});

describe('getDatasetGroupDayKey', () => {
  it('keys the group by its calendar day', () => {
    expect(getDatasetGroupDayKey('2026-07-24T09:57:23Z')).toBe('2026-07-24');
  });
});

describe('getPeriodDates', () => {
  it('has no bounds without a period', () => {
    expect(getPeriodDates('')).toEqual({ gte: undefined, lte: undefined });
  });

  it('counts a week and a month from the start of the day to the end of today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0));

    const week = getPeriodDates('week');
    expect(new Date(week.gte ?? '').getTime()).toBe(new Date(2026, 9, 8, 0, 0, 0, 0).getTime());
    expect(new Date(week.lte ?? '').getTime()).toBe(
      new Date(2026, 9, 15, 23, 59, 59, 999).getTime(),
    );

    const month = getPeriodDates('month');
    expect(new Date(month.gte ?? '').getTime()).toBe(new Date(2026, 8, 15, 0, 0, 0, 0).getTime());
  });
});
