import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Every UTC day from `start` to `end` inclusive, `YYYY-MM-DD` (the period of a chart in UTC days).
 * An unparsable date gives no days: a comparison with an invalid date is always false, so the loop
 * would never end and freeze the tab
 */
export function listDays(start: string, end: string): string[] {
  const days: string[] = [];
  const first = dayjs.utc(start);
  const last = dayjs.utc(end);
  if (!first.isValid() || !last.isValid()) return days;
  for (let day = first; !day.isAfter(last); day = day.add(1, 'day')) {
    days.push(day.format('YYYY-MM-DD'));
  }
  return days;
}

/**
 * The period of the last `daysBack` calendar UTC days up to `today` inclusive: `daysBack + 1` days,
 * the way the API counts «the last N days»
 */
export function lastDaysPeriod(daysBack: number, today: string = dayjs.utc().format('YYYY-MM-DD')) {
  return {
    start: dayjs.utc(today).subtract(daysBack, 'day').format('YYYY-MM-DD'),
    end: today,
  };
}
