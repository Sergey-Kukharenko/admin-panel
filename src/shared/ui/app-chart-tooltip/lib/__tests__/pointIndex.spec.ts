import { describe, expect, it } from 'vitest';

import { nearestIndex, stepIndex } from '../pointIndex';

describe('nearestIndex', () => {
  const positions = [0, 25, 50, 75, 100];

  it.each([
    [0, 0],
    [12, 0],
    [13, 1],
    [99, 4],
    [-10, 0],
    [130, 4],
  ])('x=%d → point %d', (x, index) => {
    expect(nearestIndex(positions, x)).toBe(index);
  });

  it('no points: null', () => {
    expect(nearestIndex([], 50)).toBeNull();
  });
});

describe('stepIndex', () => {
  // the second and the last points have no tooltip (days without data)
  const disabled = [false, true, false, true];

  it.each([
    [null, 1, 0],
    [null, -1, 2],
    [0, 1, 2],
    [2, -1, 0],
  ] as const)('from %s by %d → %d, skipping the disabled points', (current, step, next) => {
    expect(stepIndex(4, disabled, current, step)).toBe(next);
  });

  it('at the last enabled point it stays there', () => {
    expect(stepIndex(4, disabled, 2, 1)).toBe(2);
    expect(stepIndex(4, disabled, 0, -1)).toBe(0);
  });

  it('every point disabled: nothing to show', () => {
    expect(stepIndex(2, [true, true], null, 1)).toBeNull();
  });
});
