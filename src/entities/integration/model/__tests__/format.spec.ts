import { describe, expect, it } from 'vitest';

import { formatProductsWithAccess, formatSecretDate } from '../format';

describe('formatSecretDate', () => {
  it('formats like the mockup: two-digit day, no year suffix', () => {
    expect(formatSecretDate('2026-10-02', 'ru')).toBe('02 октября 2026');
    expect(formatSecretDate('2026-05-20', 'ru')).toBe('20 мая 2026');
    expect(formatSecretDate('2026-10-02', 'en')).toBe('02 October 2026');
  });
});

describe('formatProductsWithAccess', () => {
  it('lists products with any access', () => {
    expect(
      formatProductsWithAccess([
        { productId: 'a', productName: 'Player Intelligence', writeData: true, readResults: false },
        { productId: 'b', productName: 'Recommender System', writeData: false, readResults: false },
      ]),
    ).toBe('Player Intelligence');
  });

  it('shows a dash when there is no access', () => {
    expect(formatProductsWithAccess([])).toBe('—');
  });
});
