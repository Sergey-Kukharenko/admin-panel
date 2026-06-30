import type { FilterOption } from '@/shared/ui/app-filter';

export const DATASET_TYPE_OPTIONS = [
  {
    label: 'Users',
    value: 'users',
  },
  {
    label: 'Vip-users',
    value: 'vip-users',
  },
  {
    label: 'Bets',
    value: 'bets',
  },
  {
    label: 'Payments',
    value: 'payments',
  },
] satisfies readonly FilterOption[];

export const DATASET_STATUS_OPTIONS = [
  {
    label: 'Загрузка',
    value: 'LOADING',
  },
  {
    label: 'Успешно',
    value: 'SUCCESS',
  },
  {
    label: 'Ошибка',
    value: 'ERROR',
  },
] satisfies readonly FilterOption[];

export const DATASET_PERIOD_OPTIONS = [
  {
    label: 'Сегодня',
    value: 'today',
  },
  {
    label: 'Неделя',
    value: 'week',
  },
  {
    label: 'Месяц',
    value: 'month',
  },
] satisfies readonly FilterOption[];
