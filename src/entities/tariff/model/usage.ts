import type { TariffUsageVariant } from './types';

const WARNING_THRESHOLD_PERCENT = 70;
const DANGER_THRESHOLD_PERCENT = 90;

export const TARIFF_LIMIT_WARNING_CAPTION = 'Лимит почти исчерпан';

export function getTariffUsageVariant(percent: number): TariffUsageVariant {
  if (percent >= DANGER_THRESHOLD_PERCENT) {
    return 'danger';
  }

  if (percent >= WARNING_THRESHOLD_PERCENT) {
    return 'warning';
  }

  return 'default';
}
