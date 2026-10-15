import { describe, expect, it, vi } from 'vitest';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

import { createQueryPatch } from '../createQueryPatch';

function setup(query: Record<string, string>) {
  const replace = vi.fn();
  const replaceQuery = createQueryPatch(
    { query } as unknown as RouteLocationNormalizedLoaded,
    { replace } as unknown as Router,
  );
  return { replace, replaceQuery };
}

describe('createQueryPatch', () => {
  it('добавляет и перезаписывает параметры, сохраняя остальные', () => {
    const { replace, replaceQuery } = setup({ status: 'ERROR', page: '2' });

    replaceQuery({ page: '3', period: 'week' });

    expect(replace).toHaveBeenCalledWith({ query: { status: 'ERROR', page: '3', period: 'week' } });
  });

  it('пустые значения и пустые массивы удаляют параметр', () => {
    const { replace, replaceQuery } = setup({ status: 'ERROR', types: 'a,b', page: '2' });

    replaceQuery({ status: '', types: [], page: undefined });

    expect(replace).toHaveBeenCalledWith({ query: {} });
  });

  it('массив склеивается в строку через запятую', () => {
    const { replace, replaceQuery } = setup({});

    replaceQuery({ types: ['players', 'bets'] });

    expect(replace).toHaveBeenCalledWith({ query: { types: 'players,bets' } });
  });
});
