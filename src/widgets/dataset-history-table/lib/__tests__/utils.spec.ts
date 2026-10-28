import { describe, expect, it } from 'vitest';

import { formatDatasetGroupDate, getDatasetGroupDayKey } from '../utils';

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
