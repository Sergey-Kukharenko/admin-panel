import { describe, expect, it } from 'vitest';

import type { RecentOperationItem } from '@/entities/operation';

import { mapRecentOperationsToView, mapRecentOperationToRow } from '../mapper';

const OPTIONS = {
  intlLocale: 'ru-RU',
  translate: (key: string) => `t:${key}`,
  serviceName: (slug: string) => `name:${slug}`,
  rowsLabel: (count: number, formatted: string) => `${formatted} rows(${count})`,
};

function item(overrides: Partial<RecentOperationItem> = {}): RecentOperationItem {
  return {
    id: 'op-1',
    type: 'data_load',
    status: 'succeeded',
    created_at: '2026-07-01T11:10:00Z',
    dataset_type: 'bets',
    file_format: 'csv',
    service_slug: null,
    rows_count: 145_000,
    ...overrides,
  };
}

describe('mapRecentOperationToRow', () => {
  it('an upload: date, type, «type · FORMAT · rows» and the success badge (mockup 1574:181319)', () => {
    expect(mapRecentOperationToRow(item(), OPTIONS)).toEqual({
      id: 'op-1',
      dateLabel: '1 июл 2026, 11:10',
      typeLabel: 't:dashboard.recentOperations.types.dataLoad',
      details: 'bets · CSV · 145\u00a0000 rows(145000)',
      status: 'success',
    });
  });

  it('a run: the service name and the rows', () => {
    const row = mapRecentOperationToRow(
      item({
        type: 'ml_service_run',
        dataset_type: null,
        file_format: null,
        service_slug: 'vip-churn',
      }),
      OPTIONS,
    );

    expect(row.typeLabel).toBe('t:dashboard.recentOperations.types.mlServiceRun');
    expect(row.details).toBe('name:vip-churn · 145\u00a0000 rows(145000)');
  });

  it('a failed upload without rows: only the known parts', () => {
    expect(mapRecentOperationToRow(item({ rows_count: null }), OPTIONS).details).toBe('bets · CSV');
  });

  it('nothing to show in the details: a dash', () => {
    const row = mapRecentOperationToRow(
      item({ dataset_type: null, file_format: null, rows_count: null }),
      OPTIONS,
    );

    expect(row.details).toBe('-');
  });

  it.each([
    ['succeeded', 'success'],
    ['failed', 'error'],
    ['processing', 'loading'],
  ] as const)(
    'upload status %s → badge %s (WT-327: success / error / in progress)',
    (status, badge) => {
      expect(mapRecentOperationToRow(item({ status }), OPTIONS).status).toBe(badge);
    },
  );

  it('a model run in progress is «Обработка» (neutral), an upload in progress «Загрузка»', () => {
    const run = item({ type: 'ml_service_run', status: 'processing', service_slug: 'vip-churn' });

    expect(mapRecentOperationToRow(run, OPTIONS).status).toBe('neutral');
    expect(mapRecentOperationToRow(item({ status: 'processing' }), OPTIONS).status).toBe('loading');
  });

  it('an unknown status or type from the backend does not break the row', () => {
    const row = mapRecentOperationToRow(
      item({
        status: 'archived' as RecentOperationItem['status'],
        type: 'export' as RecentOperationItem['type'],
      }),
      OPTIONS,
    );

    expect(row.status).toBe('neutral');
    expect(row.typeLabel).toBe('t:dashboard.recentOperations.types.other');
  });

  it('numbers in the locale: 145,000 in en', () => {
    const row = mapRecentOperationToRow(item(), { ...OPTIONS, intlLocale: 'en-US' });

    expect(row.details).toBe('bets · CSV · 145,000 rows(145000)');
    expect(row.dateLabel).toBe('1 Jul 2026, 11:10');
  });
});

describe('mapRecentOperationsToView', () => {
  it('rows in the API order and the total counter of all operations', () => {
    const view = mapRecentOperationsToView(
      { items: [item({ id: 'a' }), item({ id: 'b' })], total_count: 12 },
      OPTIONS,
    );

    expect(view.rows.map((row) => row.id)).toEqual(['a', 'b']);
    expect(view.totalCount).toBe(12);
  });
});
