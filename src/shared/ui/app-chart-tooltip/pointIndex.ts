/** Index of the position nearest to `x` (both in percent of the layer width); null without points */
export function nearestIndex(positions: readonly number[], x: number): number | null {
  let nearest: number | null = null;
  let distance = Infinity;
  positions.forEach((position, index) => {
    const current = Math.abs(position - x);
    if (current < distance) {
      nearest = index;
      distance = current;
    }
  });
  return nearest;
}

/**
 * The next point with a tooltip from `current` in the direction of `step`, skipping disabled ones;
 * the current point when there is none further. Without a current point: the first enabled one going
 * forward, the last one going back.
 */
export function stepIndex(
  count: number,
  disabled: readonly boolean[],
  current: number | null,
  step: 1 | -1,
): number | null {
  let index = current === null ? (step === 1 ? -1 : count) : current;
  for (index += step; index >= 0 && index < count; index += step) {
    if (!disabled[index]) return index;
  }
  return current;
}
