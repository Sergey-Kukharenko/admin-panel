import type { Product, ProductChartResponse } from '../api/types';

/**
 * Сервисы, которые временно не показываем клиенту (решение PM, 30.09.2026): из моделей PreVIP
 * используем только previp-detection_micoformer (Early VIP Detection), а горизонты 3/5/7 дней
 * скрыты, пока продуктово не определено их позиционирование. Вернуть сервис — убрать его отсюда.
 */
export const HIDDEN_SERVICE_NAMES: readonly string[] = [
  'previp-detection_3',
  'previp-detection_5',
  'previp-detection_7',
];

export function isServiceHidden(serviceName: string): boolean {
  return HIDDEN_SERVICE_NAMES.includes(serviceName.toLowerCase());
}

/** Продукты без скрытых сервисов — для карточек, фильтров и истории прогонов */
export function withoutHiddenServices(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    services: product.services.filter((service) => !isServiceHidden(service.name)),
  }));
}

/**
 * Apply the same service visibility policy to charts (PM decision reconfirmed on 2026-11-11).
 * Used as query select: the cache keeps the server response, while totals and the empty state
 * describe only the visible series. Removing a name from HIDDEN_SERVICE_NAMES restores it everywhere.
 */
export function withoutHiddenChartSeries(
  response: ProductChartResponse | null,
): ProductChartResponse | null {
  if (!response) return response;

  const series = response.series.filter((item) => !isServiceHidden(item.series_key));
  if (series.length === response.series.length) return response;

  const total = series.reduce(
    (sum, item) => sum + item.points.reduce((acc, point) => acc + point.value, 0),
    0,
  );

  return {
    ...response,
    series,
    summary: { ...response.summary, total_value: total },
    has_data: total > 0,
  };
}
