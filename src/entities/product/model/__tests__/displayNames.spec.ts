import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';

import { i18n, setAppLocale } from '@/shared/i18n';

import { useProductDisplayNames } from '../displayNames';

function withSetup<T>(composable: () => T): T {
  let result!: T;
  const app = createApp({
    setup() {
      result = composable();
      return () => null;
    },
  });
  app.use(i18n);
  app.mount(document.createElement('div'));
  return result;
}

describe('useProductDisplayNames', () => {
  setAppLocale('ru');
  const { productName, serviceName } = withSetup(useProductDisplayNames);

  it('переводит известные slug продуктов в названия из макета', () => {
    expect(productName('player-intelligence')).toBe('Player Intelligence');
    expect(productName('game-recommender')).toBe('Recommender System');
  });

  it('переводит сервисы и дописывает вариант модели в скобках', () => {
    expect(serviceName('similar')).toBe('Similar Games');
    expect(serviceName('main')).toBe('Game Recommendations');
    expect(serviceName('previp-detection_micoformer')).toBe(
      'Early VIP Identification (micoformer)',
    );
  });

  it('неизвестный slug показывает очеловеченным, а не падает', () => {
    expect(productName('new-product')).toBe('New Product');
    expect(serviceName('churn_v2')).toBe('Churn V2');
  });
});
