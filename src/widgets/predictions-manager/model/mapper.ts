import { type Product, type ProductService, resolveProductIconName } from '@/entities/product';

import type {
  PredictionIntegration,
  PredictionServiceState,
  PredictionStatus,
  PredictionTooltipIconName,
} from './types';
import { formatLastCalculation, formatNextCalculation } from './utils';

// Статусы — строки без enum в OpenAPI; значения берем из RFC "Мониторинг готовности продукта/результата":
// service_status — статус обучения (AWAITING / TRAINING / ACTIVE / ERROR),
// last_service_run_status — статус инференса (PROCESSING / COMPLETED / ERROR).
// Сравниваем по подстроке без учета регистра, чтобы не зависеть от точного написания
const FAILED_PATTERN = /fail|error/;
const IN_PROGRESS_PATTERN = /process|progress|run|generat|pending/;

// Info-иконка рядом с названием отражает подготовку/обучение сервиса, а не результат:
// в макете «Результат с ошибкой» бейдж FAILED, а иконка остается зеленой
const TOOLTIP_ICON_BY_SERVICE_STATE: Record<PredictionServiceState, PredictionTooltipIconName> = {
  awaitingData: 'not-yet-loaded',
  training: 'has-been-validated',
  ready: 'service-ready',
  trainingFailed: 'error',
};

function resolveServiceState(
  service: ProductService,
  isDataReady: boolean | undefined,
): PredictionServiceState {
  const training = service.service_status.toLowerCase();

  if (FAILED_PATTERN.test(training)) return 'trainingFailed';
  if (/train/.test(training)) return 'training';
  if (/active|ready/.test(training)) return 'ready';

  // AWAITING (или неизвестное значение): если сервис уже выдавал результаты — он рабочий;
  // иначе смотрим на Core Data Validator — данные провалидированы, значит подготовка стартует
  if (service.last_prediction_at) return 'ready';
  if (isDataReady === true) return 'training';

  return 'awaitingData';
}

function resolveStatus(
  service: ProductService,
  isAwaitingData: boolean,
): { status: PredictionStatus; isTraining: boolean } {
  const training = service.service_status.toLowerCase();
  const inference = (service.last_service_run_status ?? '').toLowerCase();
  const hasPreviousResult = Boolean(service.last_prediction_at);

  // Блокировка AWAITING до флага Core Data Validator (WT-297): пока полный пакет данных
  // не провалидирован, пайплайн не может стартовать, что бы ни пришло в статусах сервиса
  if (isAwaitingData) return { status: 'awaiting', isTraining: false };

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

export interface MapProductOptions {
  /** is_ready из /products/{id}/required-files/status; undefined, пока статус не загружен */
  isDataReady?: boolean;
  intlLocale: string;
  productName: (slug: string) => string;
  serviceName: (slug: string) => string;
}

/**
 * Блокировка AWAITING по валидатору действует только на первом запуске: при повторной
 * загрузке (новая группа файлов в обработке) уже готовые результаты остаются доступны и
 * карточка не должна откатываться в AWAITING (PRD, макеты «Повторная загрузка CSV»)
 */
export function mapProductToIntegrations(
  product: Product,
  { isDataReady, intlLocale, productName, serviceName }: MapProductOptions,
): PredictionIntegration[] {
  return product.services.map((service) => {
    const isAwaitingData = isDataReady === false && !service.last_prediction_at;
    const { status, isTraining } = resolveStatus(service, isAwaitingData);
    const serviceState = resolveServiceState(service, isDataReady);

    return {
      id: service.ml_service_id,
      category: productName(product.name),
      name: serviceName(service.name),
      status,
      isTraining,
      nextCalculation: formatNextCalculation(service.next_prediction_date, intlLocale),
      lastCalculation: formatLastCalculation(service.last_prediction_at, intlLocale),
      serviceState,
      iconName: resolveProductIconName(product.name),
      tooltipIcon: TOOLTIP_ICON_BY_SERVICE_STATE[serviceState],
    };
  });
}
