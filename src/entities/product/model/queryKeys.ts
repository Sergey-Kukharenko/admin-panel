import type { ProductChartSlug } from '../api/types';

export const productKeys = {
  all: ['products'] as const,
  /** GET /products */
  list: () => [...productKeys.all, 'list'] as const,
  /** GET /dashboard/charts/{productSlug} */
  chart: (productSlug: ProductChartSlug) => [...productKeys.all, 'chart', productSlug] as const,
};
