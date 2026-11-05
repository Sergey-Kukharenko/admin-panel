import { describe, expect, it } from 'vitest';

import type { ProductStatusSummary } from '@/entities/product';

import { getQuickStartProgress } from '../progress';

function summary(overrides: Partial<ProductStatusSummary> = {}): ProductStatusSummary {
  return {
    productSlug: 'game-recommender',
    isAvailable: true,
    productStatus: 'awaiting',
    dataStatus: 'awaiting',
    resultStatus: 'awaiting',
    ...overrides,
  };
}

function doneSteps(summaries: ProductStatusSummary[]) {
  return getQuickStartProgress(summaries)
    .steps.filter((step) => step.isDone)
    .map((step) => step.id);
}

describe('getQuickStartProgress', () => {
  // The dashboard frames of the mockup (Figma page «02 Dashboard (MVP)», WT-565)
  it.each([
    ['«Нет данных»', summary(), 0],
    ['«Ошибка валидации»', summary({ dataStatus: 'issue' }), 0],
    ['«Идет обучение модели»', summary({ productStatus: 'active', dataStatus: 'validated' }), 50],
    [
      '«Идет генерация результата»',
      summary({ productStatus: 'active', dataStatus: 'validated', resultStatus: 'generating' }),
      75,
    ],
    [
      '«Ошибка генерации результата»',
      summary({ productStatus: 'active', dataStatus: 'validated', resultStatus: 'failed' }),
      75,
    ],
    [
      '«Генерация результата завершена»',
      summary({ productStatus: 'active', dataStatus: 'validated', resultStatus: 'ready' }),
      100,
    ],
  ])('matches the frame %s', (_frame, product, percent) => {
    expect(getQuickStartProgress([product]).percent).toBe(percent);
  });

  it('returns the four steps in display order', () => {
    expect(getQuickStartProgress([summary()]).steps.map((step) => step.id)).toEqual([
      'uploadData',
      'setupProduct',
      'generatePredictions',
      'resultReady',
    ]);
  });

  it.each(['validated', 'invalidUpdate', 'outdated'] as const)(
    'counts the data as uploaded when it is %s',
    (dataStatus) => {
      expect(doneSteps([summary({ dataStatus })])).toEqual(['uploadData']);
    },
  );

  it.each(['awaiting', 'processing', 'issue'] as const)(
    'does not count the data as uploaded when it is %s',
    (dataStatus) => {
      expect(doneSteps([summary({ dataStatus })])).toEqual([]);
    },
  );

  it('follows the product that has gone furthest', () => {
    const progress = getQuickStartProgress([
      summary({ productSlug: 'player-intelligence', dataStatus: 'validated' }),
      summary({ productStatus: 'active', dataStatus: 'validated', resultStatus: 'generating' }),
    ]);

    expect(progress.doneCount).toBe(3);
  });

  it('ignores products that are not available under the contract', () => {
    const progress = getQuickStartProgress([
      summary({
        isAvailable: false,
        productStatus: 'active',
        dataStatus: 'validated',
        resultStatus: 'ready',
      }),
      summary({ productSlug: 'player-intelligence' }),
    ]);

    expect(progress.percent).toBe(0);
  });

  it('shows no progress without products', () => {
    expect(getQuickStartProgress([])).toMatchObject({ doneCount: 0, percent: 0 });
  });
});
