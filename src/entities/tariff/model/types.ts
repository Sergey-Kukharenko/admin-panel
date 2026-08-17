export interface TariffUsageLimit {
  productId: string;
  productName: string;
  usedMau: number;
  limitMau: number;
}

export interface TariffMonthlyUsagePoint {
  month: string;
  label: string;
  value: number | null;
}

export type TariffUsageVariant = 'default' | 'warning' | 'danger';
