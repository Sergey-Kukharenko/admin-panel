import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/**
 * Сервис продукта. Статусы в OpenAPI — строки без enum; на стенде:
 * - service_status — статус обучения: awaiting / training / active / error;
 * - last_service_run_status — последний инференс: processing / completed / error, null — запусков не было.
 * next_prediction_date — date-time (раньше приходила дата без времени, форматтер понимает оба)
 */
export type ProductService = Schemas['ProjectProductServiceItemSchema'];

/**
 * Продукт проекта. product_status — агрегированный статус обучения (awaiting / training / active /
 * error), бэк считает его с учётом каскада ошибок сервисов (WT-299); в UI пока не выводится.
 * last_product_run_status — агрегированный статус последнего прогона: processing / completed / error
 */
export type Product = Schemas['ProjectProductListItemSchema'];

export type ProductRequiredFileTypeStatus = Schemas['ProductRequiredFileTypeStatusSchema'];

export type ProductRequiredFilesStatus = Schemas['ProductRequiredFilesStatusSchema'];

export type MLServiceRunStatus = Schemas['MLServiceRunStatusResponseSchema'];

export type ProductRun = Schemas['ProductRunResponseSchema'];

/** Прогон сервиса; status — строка без enum в OpenAPI, на стенде processing / completed / error */
export type MLServiceRun = Schemas['MLServiceRunResponseSchema'];

/**
 * Элемент списка прогонов. product_run_id общий для всех сервисов одного прогона продукта
 * (единый run_id пайплайна, WT-300); prediction_result_id — id для /predictions/{id}/download,
 * null, пока прогон не дал результат
 */
export type MLServiceRunListItem = Schemas['MLServiceRunListItemSchema'];

export type MLServiceRunListResponse = Schemas['MLServiceRunListResponseSchema'];

/** *__in — списки через запятую; order_by — поля через запятую, "-" — по убыванию */
export type MLServiceRunFilters = NonNullable<
  operations['list_ml_service_runs']['parameters']['query']
>;
