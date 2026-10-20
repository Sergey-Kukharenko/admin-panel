import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import { PRODUCT_CARD_CONTENT } from '../products';
import { DATA_STATUS_BADGES, PRODUCT_STATUS_TAGS, RESULT_STATUS_BADGES } from '../statuses';

describe('dashboard product statuses', () => {
  it('only the training tag has the highlight over its text (UI kit Tag status=training)', () => {
    const highlighted = Object.entries(PRODUCT_STATUS_TAGS)
      .filter(([, tag]) => tag.highlighted)
      .map(([status]) => status);

    expect(highlighted).toEqual(['training']);
  });

  const statusKeys = Object.entries({
    productStatus: PRODUCT_STATUS_TAGS,
    dataStatus: DATA_STATUS_BADGES,
    resultStatus: RESULT_STATUS_BADGES,
  }).flatMap(([group, table]) =>
    Object.keys(table).map((status) => `dashboard.products.${group}.${status}`),
  );

  it.each(statusKeys)('%s has a label in both locales', (key) => {
    expect(i18n.global.te(key, 'ru')).toBe(true);
    expect(i18n.global.te(key, 'en')).toBe(true);
  });

  // The products of the dashboard mockup: the card takes their content by slug
  it.each(['game-recommender', 'player-intelligence'])(
    '%s has a description in both locales and an illustration',
    (slug) => {
      const content = PRODUCT_CARD_CONTENT[slug];
      expect(content?.image).toBeTruthy();
      expect(i18n.global.te(content?.descriptionKey ?? '', 'ru')).toBe(true);
      expect(i18n.global.te(content?.descriptionKey ?? '', 'en')).toBe(true);
    },
  );
});
