import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import type { App } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

import { withSetup } from '@/shared/lib/test';

import { useDatasetHistoryPagination } from '../useDatasetHistoryPagination';

async function setup(initialUrl: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/datasets', component: { render: () => null } }],
  });
  await router.push(initialUrl);
  await router.isReady();

  const [result, app] = withSetup(() => useDatasetHistoryPagination(), [router]);
  return { ...result, router, app };
}

let app: App | undefined;

afterEach(() => {
  app?.unmount();
  app = undefined;
});

describe('useDatasetHistoryPagination', () => {
  it('reads the page from the URL', async () => {
    const ctx = await setup('/datasets?page=3');
    app = ctx.app;

    expect(ctx.page.value).toBe(3);
  });

  it('falls back to the first page for an invalid URL value', async () => {
    for (const url of [
      '/datasets',
      '/datasets?page=0',
      '/datasets?page=abc',
      '/datasets?page=1.5',
    ]) {
      const ctx = await setup(url);
      expect(ctx.page.value).toBe(1);
      ctx.app.unmount();
    }
  });

  it('writes the page to the URL and drops the parameter for the first page', async () => {
    const ctx = await setup('/datasets?status=ERROR');
    app = ctx.app;

    ctx.page.value = 4;
    await flushPromises();
    expect(ctx.router.currentRoute.value.query).toEqual({ status: 'ERROR', page: '4' });

    ctx.page.value = 1;
    await flushPromises();
    expect(ctx.router.currentRoute.value.query).toEqual({ status: 'ERROR' });
  });
});
