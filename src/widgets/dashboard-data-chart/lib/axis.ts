/** Lines of the value axis above 0, as in the mockup: 0 / 50k / 100k / 150k / 200k */
export const AXIS_INTERVALS = 4;

/** Axis top without data, as in the mockup "Нет данных" (Figma 1300:139202) */
export const EMPTY_AXIS_MAX = 200_000;

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/** Smallest round axis top that fits `maxValue` in {@link AXIS_INTERVALS} equal steps */
export function getAxisMax(maxValue: number): number {
  if (maxValue <= 0) return EMPTY_AXIS_MAX;

  const rawStep = maxValue / AXIS_INTERVALS;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = (NICE_STEPS.find((nice) => nice * magnitude >= rawStep) ?? 10) * magnitude;

  // rows are whole numbers: no 0.5-row axis steps on tiny data
  return Math.max(step, 1) * AXIS_INTERVALS;
}

/**
 * Short axis label in the locale: 50000 → "50k", 12500 → "12,5k" (ru) / "12.5k" (en), 2500000 →
 * "2,5M". The mockup uses "k" in both languages, so the suffix is not translated.
 */
export function formatAxisValue(value: number, intlLocale: string): string {
  const format = (number: number) =>
    new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 2 }).format(number);

  if (value >= 1_000_000) return `${format(value / 1_000_000)}M`;
  if (value >= 1000) return `${format(value / 1000)}k`;
  return format(value);
}
