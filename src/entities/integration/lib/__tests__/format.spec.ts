import { describe, expect, it } from 'vitest';

import { formatSecretDate } from '../format';

describe('formatSecretDate', () => {
  it('formats like the mockup: two-digit day, no year suffix', () => {
    expect(formatSecretDate('2026-10-02', 'ru')).toBe('02 октября 2026');
    expect(formatSecretDate('2026-05-20', 'ru')).toBe('20 мая 2026');
    expect(formatSecretDate('2026-10-02', 'en')).toBe('02 October 2026');
  });
});
