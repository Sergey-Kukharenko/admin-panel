import type { DatasetTemplate } from '@/entities/dataset/model/types';

export const datasetTemplates: DatasetTemplate[] = [
  {
    id: 'users',
    title: 'Users',
    description: 'Профили и регистрационные данные пользователей',
    count: 0,
    icon: 'users',
  },
  {
    id: 'vip-users',
    title: 'Vip-users',
    description: 'Данные VIP-сегментации с уровнями и идентификаторами',
    count: 0,
    icon: 'vip',
  },
  {
    id: 'bets',
    title: 'Bets',
    description: 'Ставки и результаты',
    count: 0,
    icon: 'bets',
  },
  {
    id: 'balance-daily',
    title: 'Balance-daily',
    description: 'Дневной финансовый срез и изменения баланса',
    count: 0,
    icon: 'balance',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Платежи и транзакции с деталями операций',
    count: 0,
    icon: 'payments',
  },
];
