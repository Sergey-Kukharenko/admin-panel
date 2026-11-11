import { describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import { PRODUCT_CHARTS } from '../charts';

describe('PRODUCT_CHARTS', () => {
  it.each(PRODUCT_CHARTS.map((chart) => chart.subtitleKey))(
    'subtitle key %s exists in ru and en',
    (key) => {
      expect(i18n.global.te(key, 'ru')).toBe(true);
      expect(i18n.global.te(key, 'en')).toBe(true);
    },
  );
});
