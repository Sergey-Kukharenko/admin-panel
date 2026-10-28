import { describe, expect, it } from 'vitest';

import { lastDaysPeriod, listDays } from '../days';

describe('listDays', () => {
  it.each([
    ['not a date', '2026-06-02'],
    ['2026-05-30', ''],
    ['', ''],
  ])('an invalid period %j – %j gives no days instead of an endless loop', (start, end) => {
    expect(listDays(start, end)).toEqual([]);
  });

  it('lists every UTC day of the period inclusive, across a month end', () => {
    expect(listDays('2026-05-30', '2026-06-02')).toEqual([
      '2026-05-30',
      '2026-05-31',
      '2026-06-01',
      '2026-06-02',
    ]);
  });

  it('a one-day period is that day; an inverted period is empty', () => {
    expect(listDays('2026-05-13', '2026-05-13')).toEqual(['2026-05-13']);
    expect(listDays('2026-05-14', '2026-05-13')).toEqual([]);
  });
});

describe('lastDaysPeriod', () => {
  it('30 days back from 12 June is 13 May … 12 June, 31 days as the API counts them', () => {
    const period = lastDaysPeriod(30, '2026-06-12');

    expect(period).toEqual({ start: '2026-05-13', end: '2026-06-12' });
    expect(listDays(period.start, period.end)).toHaveLength(31);
  });

  it('crosses a year boundary in UTC', () => {
    expect(lastDaysPeriod(30, '2027-01-10').start).toBe('2026-12-11');
  });
});
