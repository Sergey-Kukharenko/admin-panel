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
    expect(serviceName('main')).toBe('Recommended for You');
    expect(serviceName('new_for_user')).toBe('New for You');
    expect(serviceName('similar_to_user_top_games')).toBe('Similar to Your Top');
    expect(serviceName('similar')).toBe('Similar Games');
    expect(serviceName('personal')).toBe('Recommended for You');
  });

  it('названия Player Intelligence согласованы с PM', () => {
    expect(serviceName('previp-detection_micoformer')).toBe('Early VIP Detection');
    expect(serviceName('vip-churn')).toBe('VIP Churn');
    expect(serviceName('stable-vip-prediction')).toBe('Non-Promising VIP Filtering');
    expect(serviceName('vip-segment-prediction')).toBe('VIP Segment Prediction');
    // горизонты 3/5/7 дней — пока базовое имя с суффиксом, названия обсуждаются
    expect(serviceName('previp-detection_3')).toBe('Early VIP Detection (3)');
  });

  it('неизвестный slug показывает очеловеченным, а не падает', () => {
    expect(productName('new-product')).toBe('New Product');
    expect(serviceName('churn_v2')).toBe('Churn V2');
  });
});
