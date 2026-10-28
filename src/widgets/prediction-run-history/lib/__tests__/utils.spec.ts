import { describe, expect, it } from 'vitest';

import { formatRunRecordsCount, formatRunTimestamp } from '../utils';

describe('formatRunTimestamp', () => {
  it('formats date and time in UTC without «г.» and a dot after the month', () => {
    expect(formatRunTimestamp('2026-07-10T14:23:00Z', 'ru-RU')).toBe('10 июл 2026, 14:23');
    expect(formatRunTimestamp('2026-07-10T14:23:00Z', 'en-US')).toBe('10 Jul 2026, 14:23');
  });

  it('shows a dash without a date', () => {
    expect(formatRunTimestamp(null, 'ru-RU')).toBe('-');
  });
});

describe('formatRunRecordsCount', () => {
  it('formats a number in the locale, a dash for null', () => {
    expect(formatRunRecordsCount(12345, 'en-US')).toBe('12,345');
    expect(formatRunRecordsCount(0, 'ru-RU')).toBe('0');
    expect(formatRunRecordsCount(null, 'ru-RU')).toBe('-');
  });
});
