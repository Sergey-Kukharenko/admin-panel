import dayjs from 'dayjs';

import type { DatasetPeriod } from './types';

export function getPeriodDates(period: DatasetPeriod | '') {
  if (!period) return { gte: undefined, lte: undefined };

  const now = dayjs();
  let gte = dayjs();

  switch (period) {
    case 'today':
      gte = now.startOf('day');
      break;
    case 'week':
      gte = now.subtract(7, 'day').startOf('day');
      break;
    case 'month':
      gte = now.subtract(1, 'month').startOf('day');
      break;
    default:
      return { gte: undefined, lte: undefined };
  }

  return {
    gte: gte.toISOString(),
    lte: now.endOf('day').toISOString(),
  };
}
