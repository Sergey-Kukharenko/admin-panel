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
const TOOLTIP_TEXT = 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.';
const TOOLTIP_ICON: PredictionTooltipIconName = 'service-ready';

// При статусе failed бейдж и info-иконка переключаются в ERROR (WT-291) — красная
// иконка и текст тултипа "Error", вместо общего статичного описания механизма расчета
function resolveTooltip(status: PredictionStatus): {
  icon: PredictionTooltipIconName;
  text: string;
} {
  if (status === 'failed') {
    return { icon: 'error', text: 'Error' };
  }

  return { icon: TOOLTIP_ICON, text: TOOLTIP_TEXT };
}

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

// Статусы — строки без enum в OpenAPI; значения берем из RFC "Мониторинг готовности продукта/результата":
// service_status — статус обучения (AWAITING / TRAINING / ACTIVE / ERROR),
// last_service_run_status — статус инференса (PROCESSING / COMPLETED / ERROR).
// Сравниваем по подстроке без учета регистра, чтобы не зависеть от точного написания
const FAILED_PATTERN = /fail|error/;
const IN_PROGRESS_PATTERN = /process|progress|run|generat|pending/;

function resolveStatus(service: ProductService): { status: PredictionStatus; isTraining: boolean } {
  const training = service.service_status.toLowerCase();
  const inference = (service.last_service_run_status ?? '').toLowerCase();
  const hasPreviousResult = Boolean(service.last_prediction_at);

  // Пока нет ни одного результата, статус карточки определяется первичным обучением.
  // При переобучении с уже готовыми результатами они остаются доступны (PRD), поэтому
  // статус обучения не перекрывает статус инференса
  if (!hasPreviousResult) {
    if (FAILED_PATTERN.test(training)) return { status: 'failed', isTraining: false };
    if (/train/.test(training)) return { status: 'generating', isTraining: true };
    if (/await/.test(training)) return { status: 'awaiting', isTraining: false };
  }

  if (FAILED_PATTERN.test(inference)) return { status: 'failed', isTraining: false };
  if (IN_PROGRESS_PATTERN.test(inference)) return { status: 'generating', isTraining: false };
  if (!hasPreviousResult) return { status: 'awaiting', isTraining: false };

  return { status: 'ready', isTraining: false };
}

export function mapProductToIntegrations(product: Product): PredictionIntegration[] {
  return product.services.map((service) => {
    const { status, isTraining } = resolveStatus(service);
    const tooltip = resolveTooltip(status);

    return {
      id: service.ml_service_id,
      category: product.name,
      name: service.name,
      status,
      isTraining,
      nextCalculation: formatNextCalculation(service.next_prediction_date),
      lastCalculation: formatLastCalculation(service.last_prediction_at),
      tooltipText: tooltip.text,
      iconName: resolveIconName(product.name),
      tooltipIcon: tooltip.icon,
    };
  });
}
