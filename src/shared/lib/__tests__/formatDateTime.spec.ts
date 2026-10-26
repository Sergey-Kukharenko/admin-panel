import { afterEach, describe, expect, it } from 'vitest';

import { formatDateTime } from '../formatDateTime';

describe('formatDateTime', () => {
  it.each([
    ['2026-07-01T11:10:00Z', 'ru-RU', '1 июл 2026, 11:10'], // as in mockup 1574:181319
    ['2026-07-01T11:10:00Z', 'en-US', '1 Jul 2026, 11:10'],
    ['2026-06-28T09:05:00Z', 'ru-RU', '28 июн 2026, 09:05'],
    ['2026-12-31T23:59:00Z', 'ru-RU', '31 дек 2026, 23:59'],
  ])('%s in %s → %s', (value, intlLocale, label) => {
    expect(formatDateTime(value, intlLocale)).toBe(label);
  });

  it('a 24-hour clock in en too: the afternoon keeps its hour (no AM/PM shown)', () => {
    expect(formatDateTime('2026-07-01T14:23:00Z', 'en-US')).toBe('1 Jul 2026, 14:23');
  });

  it('a 24-hour clock: midnight is 00, not 24', () => {
    expect(formatDateTime('2026-07-01T00:30:00Z', 'en-US')).toBe('1 Jul 2026, 00:30');
  });

  it.each(['', 'not a date', '2026-13-45T00:00:00Z'])(
    'an invalid date %j → "-" instead of a RangeError',
    (value) => {
      expect(formatDateTime(value, 'ru-RU')).toBe('-');
    },
  );

  // a regression check of timeZone: 'UTC': without it the day and the hour follow the local zone
  describe('in a timezone west of UTC', () => {
    const tz = process.env.TZ;

    afterEach(() => {
      // assigning undefined would store the string "undefined"
      if (tz === undefined) delete process.env.TZ;
      else process.env.TZ = tz;
    });

    it('shows the UTC day and time of the backend', () => {
      process.env.TZ = 'America/New_York';

      expect(formatDateTime('2026-07-01T01:00:00Z', 'ru-RU')).toBe('1 июл 2026, 01:00');
    });
  });
});
