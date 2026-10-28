import { describe, expect, it } from 'vitest';

import { tooltipSwatch } from '../swatch';

describe('tooltipSwatch', () => {
  it.each([
    ['var(--stats-balance-daily)', true, false],
    ['var(--stats-payments)', true, false],
    ['var(--stats-vip-users)', false, true],
    ['var(--stats-users)', false, false],
    ['var(--stats-neutral)', false, false],
  ] as const)(
    '%s: underlay %s, outlined %s (as in chart tooltip 55:2287)',
    (color, underlay, outlined) => {
      expect(tooltipSwatch(color)).toEqual({ underlay, outlined });
    },
  );
});
