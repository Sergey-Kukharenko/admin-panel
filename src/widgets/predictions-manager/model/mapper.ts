import type { Product, ProductService } from '@/entities/product';

import type {
  PredictionIconName,
  PredictionIntegration,
  PredictionStatus,
  PredictionTooltipIconName,
} from './types';
import { formatLastCalculation, formatNextCalculation } from './utils';

// Статичная информационная подсказка про сам механизм расчета — в моке она была
// одинаковой для всех карточек независимо от статуса, поэтому не завязана на бэкенд
const TOOLTIP_TEXT =
  'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.';
const TOOLTIP_ICON: PredictionTooltipIconName = 'service-ready';

// Бэкенд отдает только название продукта, а не его "тип" — иконки же всего две
// (player-intelligence.png/recommender-system.png), поэтому категоризируем по названию.
// Если появится третий продукт с непредсказуемым названием, он попадет в дефолтную ветку
function resolveIconName(productName: string): PredictionIconName {
  const normalized = productName.toLowerCase();

  if (normalized.includes('recommend') || normalized.includes('game')) {
    return 'game-recommendations';
  }

  return 'player-intelligence';
}

// service_status/last_service_run_status не задокументированы как enum (в OpenAPI-схеме
// это произвольная строка), поэтому статус распознаем эвристикой: явный провал/выполнение
// по подстроке, а если сервис еще не считал прогнозы — "в ожидании"
function resolveStatus(service: ProductService): PredictionStatus {
  const normalized = (service.last_service_run_status ?? '').toLowerCase();

  if (/fail|error/.test(normalized)) return 'failed';
  if (/run|progress|generat|pending/.test(normalized)) return 'generating';
  if (!service.last_prediction_at) return 'awaiting';

  return 'ready';
}

export function mapProductToIntegrations(product: Product): PredictionIntegration[] {
  return product.services.map((service) => ({
    id: service.ml_service_id,
    category: product.name,
    name: service.name,
    status: resolveStatus(service),
    nextCalculation: formatNextCalculation(service.next_prediction_date),
    lastCalculation: formatLastCalculation(service.last_prediction_at),
    tooltipText: TOOLTIP_TEXT,
    iconName: resolveIconName(product.name),
    tooltipIcon: TOOLTIP_ICON,
  }));
}
