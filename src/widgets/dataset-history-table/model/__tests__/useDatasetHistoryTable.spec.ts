import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type App, computed, type Plugin } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import type { FetchFilesBackendResponse } from '@/entities/dataset';
import { withSetup } from '@/shared/lib/test';

import { useDatasetHistoryTable } from '../useDatasetHistoryTable';

function makeDayGroup(sourceType: string, fileName: string) {
  return {
    uploaded_at: '2026-11-13T10:00:00Z',
    dataset_groups: [
      {
        dataset_type: 'users',
        files_count: 1,
        files: [
          {
            file_id: fileName,
            file_name: fileName,
            file_name_csv: fileName,
            source_type: sourceType,
            rows_count: 1,
            status: 'succeeded',
            uploaded_at: '2026-11-13T10:00:00Z',
          },
        ],
      },
    ],
  };
}

// WT-590, example 1: one day, three sources — the backend returns three groups
const RESPONSE: FetchFilesBackendResponse = {
  total_count: 3,
  next_page_offset: null,
  items: [
    makeDayGroup('CLIENT_PORTAL', 'users_valid.csv'),
    makeDayGroup('API', '619c22a5.parquet'),
    makeDayGroup('S3', 'users_valid__41b62658.parquet'),
  ],
};

vi.mock('@/entities/dataset', () => ({
  datasetApi: { getFiles: async () => ({ data: RESPONSE }) },
  datasetKeys: { history: (params: unknown) => ['dataset-history', params] },
  useDatasetTemplates: () => ({
    data: computed(() => []),
    isSuccess: computed(() => true),
    isLoading: computed(() => false),
  }),
}));

let app: App | undefined;

afterEach(() => {
  app?.unmount();
  app = undefined;
});

async function setup() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/datasets', component: { render: () => null } }],
  });
  await router.push('/datasets');
  await router.isReady();

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const vueQuery: Plugin = { install: (vueApp) => vueApp.use(VueQueryPlugin, { queryClient }) };
  const [result, setupApp] = withSetup(() => useDatasetHistoryTable(), [router, vueQuery]);
  app = setupApp;
  await flushPromises();

  return result;
}

describe('useDatasetHistoryTable', () => {
  it('renders a card per «day + source» group (WT-590)', async () => {
    const { renderedGroups } = await setup();

    expect(renderedGroups.value.map(({ id, source }) => [id, source])).toEqual([
      ['2026-11-13:client_portal', 'CSV'],
      ['2026-11-13:api', 'API'],
      ['2026-11-13:s3', 'S3'],
    ]);
  });

  it('auto-expands only the top card, not the whole day (WT-448, WT-590)', async () => {
    const { expandedGroups } = await setup();

    expect(expandedGroups.value).toEqual(['2026-11-13:client_portal']);
  });

  it('expands one card without expanding other sources of the same day', async () => {
    const { expandedGroups, toggleGroup } = await setup();

    toggleGroup('2026-11-13:client_portal');
    toggleGroup('2026-11-13:s3');

    expect(expandedGroups.value).toEqual(['2026-11-13:s3']);
  });
});
