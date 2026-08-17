import type { TariffMonthlyUsagePoint, TariffUsageLimit } from './types';

export const TARIFF_PERIOD_LABEL = 'Период: 18 мая - 18 июн';

export const TARIFF_LIMIT_TOOLTIP =
  'Лимит считается по уникальным пользователям, обработанным моделью за расчётный период';

export const TARIFF_CHART_MAX_VALUE = 200_000;

export const TARIFF_USAGE_LIMITS: TariffUsageLimit[] = [
  {
    productId: 'vip-intelligence',
    productName: 'VIP Intelligence',
    usedMau: 20_200,
    limitMau: 200_000,
  },
  {
    productId: 'recommender-system',
    productName: 'Recommender System',
    usedMau: 12_805,
    limitMau: 200_000,
  },
];

const MONTH_LABELS = [
  'Май 2026',
  'Июнь 2026',
  'Июль 2026',
  'Август 2026',
  'Сентябрь 2026',
  'Октябрь 2026',
  'Ноябрь 2026',
  'Декабрь 2026',
  'Январь 2027',
  'Февраль 2027',
  'Март 2027',
  'Апрель 2027',
];

function buildMonthlyUsage(values: Array<number | null>): TariffMonthlyUsagePoint[] {
  return MONTH_LABELS.map((label, index) => ({
    month: `month-${index}`,
    label,
    value: values[index] ?? null,
  }));
}

export const TARIFF_MONTHLY_USAGE: Record<string, TariffMonthlyUsagePoint[]> = {
  'vip-intelligence': buildMonthlyUsage([45_320, 62_210]),
  'recommender-system': buildMonthlyUsage([68_000, 95_210]),
};
