import type { DatasetIcon, DatasetTemplate } from './types';

interface TemplateStaticContent {
  title: string;
  description: string;
  icon: DatasetIcon;
}

// Словарь строго синхронизирован со всеми key-именами из Swagger
const TEMPLATE_CONTENT_MAP: Record<string, TemplateStaticContent> = {
  users: {
    title: 'Users',
    description: 'Профили и регистрационные данные пользователей',
    icon: 'users',
  },
  vip_users: {
    title: 'Vip-users',
    description: 'Данные VIP-сегментации с уровнями и идентификаторами',
    icon: 'vip',
  },
  bets: {
    title: 'Bets',
    description: 'Ставки и результаты игровых сессий',
    icon: 'bets',
  },
  bets_daily: {
    title: 'Bets-daily',
    description: 'Дневной срез по ставкам и активности пользователей',
    icon: 'bets',
  },
  cumulative_bets: {
    title: 'Cumulative-bets',
    description: 'Кумулятивные (накопительные) показатели по ставкам',
    icon: 'bets',
  },
  cumulative_sports_bets: {
    title: 'Cumulative-sports-bets',
    description: 'Накопительные показатели по ставкам на спорт',
    icon: 'bets',
  },
  sports_bets: {
    title: 'Sports-bets',
    description: 'Детальные данные по ставкам на спортивные события',
    icon: 'bets',
  },
  balances_daily: {
    title: 'Balance-daily',
    description: 'Дневной финансовый срез и изменения баланса',
    icon: 'balance',
  },
  payments: {
    title: 'Payments',
    description: 'Платежи и транзакции с деталями операций',
    icon: 'payments',
  },
  cumulative_payments: {
    title: 'Cumulative-payments',
    description: 'Кумулятивные финансовые показатели и объемы платежей',
    icon: 'payments',
  },
  providers_fees: {
    title: 'Providers-fees',
    description: 'Комиссии провайдеров и операционные расходы',
    icon: 'payments',
  },
  web_analytics: {
    title: 'Web-analytics',
    description: 'Метрики веб-аналитики, трафик и поведение на платформе',
    icon: 'balance', // Подставьте вашу иконку аналитики, если есть
  },
  wins: {
    title: 'Wins',
    description: 'Данные по выигрышам и выплатам пользователям',
    icon: 'vip', // Подставьте вашу иконку выигрышей, если есть
  },
};

const DEFAULT_CONTENT: TemplateStaticContent = {
  title: 'Unknown Dataset',
  description: 'Описание данного типа датасета подгружается...',
  icon: 'users',
};

/**
 * Преобразует сырой элемент с бэкенда в полную структуру DatasetTemplate для UI
 */
export function mapServerTemplate(serverItem: {
  dataset_type_id: string;
  name: string;
}): DatasetTemplate {
  // Ищем совпадение в словаре по полю name от бэкенда
  const staticContent = TEMPLATE_CONTENT_MAP[serverItem.name] || {
    ...DEFAULT_CONTENT,
    title: serverItem.name, // если бэк пришлет что-то совсем новое, выведется его системное имя
  };

  return {
    id: serverItem.dataset_type_id,
    title: staticContent.title,
    description: staticContent.description,
    icon: staticContent.icon,
    count: 0,
  };
}
