import type { Product } from './api';

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
