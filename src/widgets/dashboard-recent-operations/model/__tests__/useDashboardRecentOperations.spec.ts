// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computed, createApp, ref } from 'vue';

import type { RecentOperationListResponse } from '@/entities/operation';
import { i18n } from '@/shared/i18n';

import { useDashboardRecentOperations } from '../useDashboardRecentOperations';

const response = ref<RecentOperationListResponse | undefined>();
const isRequestError = ref(false);

vi.mock('@/entities/operation', () => ({
  useRecentOperations: () => ({
    data: computed(() => response.value),
    isLoading: computed(() => false),
    isError: computed(() => isRequestError.value),
    refetch: async () => {},
  }),
}));

function withTotal(totalCount: number): RecentOperationListResponse {
  return {
    total_count: totalCount,
    items: [
      {
        id: 'op-1',
        type: 'data_load',
        status: 'succeeded',
        created_at: '2026-07-01T11:10:00Z',
        dataset_type: 'bets',
        file_format: 'csv',
        service_slug: null,
        rows_count: 1,
      },
    ],
  };
}

function run() {
  let result: ReturnType<typeof useDashboardRecentOperations> | undefined;
  createApp({
    setup() {
      result = useDashboardRecentOperations();
      return () => null;
    },
  })
    .use(i18n)
    .mount(document.createElement('div'));
  return result!;
}

afterEach(() => {
  // the i18n instance is a shared singleton: the next test starts from the default locale
  i18n.global.locale.value = 'ru';
  response.value = undefined;
  isRequestError.value = false;
});

describe('useDashboardRecentOperations counter', () => {
  it.each([
    [12, 'ru', '12 записей'], // as in mockup 1574:181319
    [1, 'ru', '1 запись'],
    [3, 'ru', '3 записи'],
    [5, 'ru', '5 записей'],
    [21, 'ru', '21 запись'],
    [1234, 'ru', '1\u00a0234 записи'],
    [1234, 'en', '1,234 records'],
    [1, 'en', '1 record'],
  ] as const)(
    '%i in %s → %s: the number in the locale, the plural form by the number',
    (total, locale, label) => {
      response.value = withTotal(total);
      i18n.global.locale.value = locale;

      expect(run().countLabel.value).toBe(label);
    },
  );
});

describe('useDashboardRecentOperations error state', () => {
  it('a failed request without data shows the error state', () => {
    isRequestError.value = true;

    const { isError, hasData } = run();

    expect(isError.value).toBe(true);
    expect(hasData.value).toBe(false);
  });

  it('a failed refetch keeps the rows already shown', () => {
    response.value = withTotal(12);
    isRequestError.value = true;

    const { isError, hasData } = run();

    expect(isError.value).toBe(false);
    expect(hasData.value).toBe(true);
  });
});
