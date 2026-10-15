import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatDatasetGroupDate, getDatasetGroupDayKey, getPeriodDates } from '../utils';

afterEach(() => {
  vi.useRealTimers();
});

describe('formatDatasetGroupDate', () => {
  it('форматирует ISO-дату для заголовка группы', () => {
    expect(formatDatasetGroupDate('2026-07-24T09:57:23.585609Z')).toBe('24 июл. 2026 г.');
  });

  it('пустая строка — пустой результат', () => {
    expect(formatDatasetGroupDate('')).toBe('');
  });
});

describe('getDatasetGroupDayKey', () => {
  it('ключ зависит только от календарного дня', () => {
    expect(getDatasetGroupDayKey('2026-07-24T09:00:00')).toBe('2026-07-24');
    expect(getDatasetGroupDayKey('2026-07-24T23:30:00')).toBe('2026-07-24');
  });
});

describe('getPeriodDates', () => {
  it('без периода — без границ', () => {
    expect(getPeriodDates('')).toEqual({ gte: undefined, lte: undefined });
  });

  it('неделя и месяц считаются от начала дня до конца сегодняшнего дня', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0));

    const week = getPeriodDates('week');
    expect(new Date(week.gte!).getTime()).toBe(new Date(2026, 9, 8, 0, 0, 0, 0).getTime());
    expect(new Date(week.lte!).getTime()).toBe(new Date(2026, 9, 15, 23, 59, 59, 999).getTime());

    const month = getPeriodDates('month');
    expect(new Date(month.gte!).getTime()).toBe(new Date(2026, 8, 15, 0, 0, 0, 0).getTime());
  });
});
