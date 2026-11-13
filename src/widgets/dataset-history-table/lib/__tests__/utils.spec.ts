import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DatasetFileListItem, DatasetHistoryDayGroup } from '@/entities/dataset';

import {
  formatDatasetGroupDate,
  formatUploadTime,
  getDatasetGroupDayKey,
  getDatasetGroupKey,
  getDatasetGroupSourceType,
  getPeriodDates,
} from '../utils';

function makeFile(sourceType: string): DatasetFileListItem {
  return {
    file_id: `file-${sourceType}`,
    file_name: 'users.parquet',
    file_name_csv: 'users.csv',
    source_type: sourceType,
    rows_count: 1,
    status: 'succeeded',
    uploaded_at: '2026-11-13T10:00:00Z',
  };
}

function makeDayGroup(uploadedAt: string, sourceTypes: string[][]): DatasetHistoryDayGroup {
  return {
    uploaded_at: uploadedAt,
    dataset_groups: sourceTypes.map((files) => ({
      dataset_type: 'users',
      files_count: files.length,
      files: files.map(makeFile),
    })),
  };
}

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

describe('formatUploadTime', () => {
  // Built from local time so the expectation holds in any test-runner timezone
  const AFTERNOON = new Date(2026, 6, 24, 21, 5).toISOString();
  const MORNING = new Date(2026, 6, 24, 9, 5).toISOString();

  it.each([
    ['ru-RU', AFTERNOON, '21:05'],
    ['en-US', AFTERNOON, '21:05'],
    ['en-US', MORNING, '09:05'],
  ])('shows hours and minutes on a 24-hour clock in %s (WT-570)', (intlLocale, iso, expected) => {
    expect(formatUploadTime(iso, intlLocale)).toBe(expected);
  });

  it('shows a dash without a value', () => {
    expect(formatUploadTime(null, 'ru-RU')).toBe('-');
  });
});

describe('getDatasetGroupDayKey', () => {
  it('keys the group by its calendar day', () => {
    expect(getDatasetGroupDayKey('2026-07-24T09:57:23Z')).toBe('2026-07-24');
  });
});

describe('getDatasetGroupSourceType', () => {
  it('takes the source of the first file, lower case', () => {
    expect(getDatasetGroupSourceType(makeDayGroup('2026-11-13T10:00:00Z', [['S3']]))).toBe('s3');
  });

  it('skips dataset groups without files', () => {
    const dayGroup = makeDayGroup('2026-11-13T10:00:00Z', [[], ['API']]);

    expect(getDatasetGroupSourceType(dayGroup)).toBe('api');
  });

  it('falls back to client_portal without files', () => {
    expect(getDatasetGroupSourceType(makeDayGroup('2026-11-13T10:00:00Z', []))).toBe(
      'client_portal',
    );
  });
});

// WT-590: the backend returns one group per «day + source»
describe('getDatasetGroupKey', () => {
  it.each([
    ['CLIENT_PORTAL', '2026-11-13:client_portal'],
    ['API', '2026-11-13:api'],
    ['S3', '2026-11-13:s3'],
  ])('keys a %s group by day and source', (sourceType, expected) => {
    expect(getDatasetGroupKey(makeDayGroup('2026-11-13T10:00:00Z', [[sourceType]]))).toBe(expected);
  });

  it('gives groups of one day with different sources different keys', () => {
    const keys = ['CLIENT_PORTAL', 'API', 'S3'].map((sourceType) =>
      getDatasetGroupKey(makeDayGroup('2026-11-13T10:00:00Z', [[sourceType]])),
    );

    expect(new Set(keys).size).toBe(3);
  });

  it('keeps the key when the time changes within the same day and source (WT-448)', () => {
    const before = getDatasetGroupKey(makeDayGroup('2026-11-13T10:00:00Z', [['S3']]));
    const after = getDatasetGroupKey(makeDayGroup('2026-11-13T15:30:00Z', [['S3']]));

    expect(after).toBe(before);
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
