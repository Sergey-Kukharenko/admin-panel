import { afterEach, describe, expect, it } from 'vitest';

import { formatDateLabels } from '../dateLabels';

describe('formatDateLabels', () => {
  const days = ['2026-05-13', '2026-05-14', '2026-05-15', '2026-05-16', '2026-05-17'];

  it.each([
    ['ru-RU', ['13 мая', '15 мая', '17 мая']],
    ['en-US', ['May 13', 'May 15', 'May 17']],
  ])('%s: the first, the middle and the last day', (intlLocale, labels) => {
    expect(formatDateLabels(days, intlLocale)).toEqual(labels);
  });

  it('an even number of days takes the lower middle', () => {
    expect(formatDateLabels(days.slice(0, 4), 'ru-RU')).toEqual(['13 мая', '14 мая', '16 мая']);
  });

  it.each([
    [['2026-05-13'], ['13 мая', '13 мая', '13 мая']],
    [
      ['2026-05-13', '2026-05-14'],
      ['13 мая', '13 мая', '14 мая'],
    ],
  ])('a period of one or two days repeats a label: %j', (period, labels) => {
    expect(formatDateLabels(period, 'ru-RU')).toEqual(labels);
  });

  it('across a month and a year end', () => {
    expect(formatDateLabels(['2026-12-31', '2027-01-01', '2027-01-02'], 'ru-RU')).toEqual([
      '31 декабря',
      '1 января',
      '2 января',
    ]);
  });

  describe('in a timezone west of UTC', () => {
    const tz = process.env.TZ;

    afterEach(() => {
      process.env.TZ = tz;
    });

    it('formats in UTC: the day does not shift back', () => {
      process.env.TZ = 'America/New_York';

      expect(formatDateLabels(['2026-06-01'], 'en-US')[0]).toBe('June 1');
    });
  });

  it('no days: no labels', () => {
    expect(formatDateLabels([], 'ru-RU')).toEqual([]);
  });
});
