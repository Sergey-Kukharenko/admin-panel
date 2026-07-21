import type { DatasetTemplate } from '@/entities/dataset';

export const datasetTemplates: DatasetTemplate[] = [
  {
    // ИСПРАВЛЕНО: Настоящий UUID для users из вашего Swagger ответа
    id: '4ae243b0-b30b-4b55-9961-689e6fbfad80',
    title: 'Users',
    description: 'Профили и регистрационные данные пользователей',
    count: 0,
    icon: 'users',
  },
  {
    // ИСПРАВЛЕНО: Настоящий UUID для vip_users
    id: '0212a3c1-3d99-465d-bd5e-a93d972aba96',
    title: 'Vip-users',
    description: 'Данные VIP-сегментации с уровнями и идентификаторами',
    count: 0,
    icon: 'vip',
  },
  {
    // ИСПРАВЛЕНО: Настоящий UUID для bets
    id: '6d8decc0-86db-446b-bc7a-b5444793cf0e',
    title: 'Bets',
    description: 'Ставки и результаты',
    count: 0,
    icon: 'bets',
  },
  {
    // ИСПРАВЛЕНО: Настоящий UUID для balances_daily
    id: '096b373f-c74e-4a89-a913-081c797f6800',
    title: 'Balance-daily',
    description: 'Дневной финансовый срез и изменения баланса',
    count: 0,
    icon: 'balance',
  },
  {
    // ИСПРАВЛЕНО: Настоящий UUID для payments
    id: 'b00b982a-d84c-49e4-a0bd-d7925f132061',
    title: 'Payments',
    description: 'Платежи и транзакции с деталями операций',
    count: 0,
    icon: 'payments',
  },
];
