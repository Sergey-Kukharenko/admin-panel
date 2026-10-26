import type { RecentOperationType } from '@/entities/operation';

/** i18n key of every known operation type: a new type in the DTO fails the type check here */
export const OPERATION_TYPE_LABEL_KEYS: Record<RecentOperationType, string> = {
  data_load: 'dashboard.recentOperations.types.dataLoad',
  ml_service_run: 'dashboard.recentOperations.types.mlServiceRun',
};

/** An operation type the frontend does not know yet (the backend added one) */
export const OTHER_OPERATION_LABEL_KEY = 'dashboard.recentOperations.types.other';
