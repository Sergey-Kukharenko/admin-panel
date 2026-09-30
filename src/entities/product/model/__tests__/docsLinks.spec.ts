import { describe, expect, it } from 'vitest';

import { resolveServiceDocsUrl } from '../docsLinks';

const BASE = 'https://docs.mico.team/H1FgizQT2HW0P42HdSVk';

describe('resolveServiceDocsUrl', () => {
  it('ведет на раздел конкретного сервиса рекомендаций', () => {
    expect(resolveServiceDocsUrl('game-recommender', 'new_for_user')).toBe(
      `${BASE}/game-recommender#get-recommendations`,
    );
    expect(resolveServiceDocsUrl('game-recommender', 'similar')).toBe(
      `${BASE}/game-recommender/similar-games`,
    );
  });

  it('варианты модели ведут на страницу базового сервиса', () => {
    expect(resolveServiceDocsUrl('player-intelligence', 'previp-detection_micoformer')).toBe(
      `${BASE}/vip-intelligence/early-vip-detection`,
    );
    expect(resolveServiceDocsUrl('player-intelligence', 'vip-churn')).toBe(
      `${BASE}/vip-intelligence/vip-churn`,
    );
  });

  it('без страницы сервиса — обзор продукта, без продукта — главная документации', () => {
    expect(resolveServiceDocsUrl('player-intelligence', 'unknown-service')).toBe(
      `${BASE}/vip-intelligence/overview`,
    );
    expect(resolveServiceDocsUrl('new-product', 'unknown')).toBe(BASE);
  });
});
