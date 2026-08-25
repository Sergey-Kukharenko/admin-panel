import { i18n } from '@/shared/i18n';

import type { DatasetIcon, DatasetTemplate } from './types';

interface TemplateStaticContent {
  title: string;
  descriptionKey: string;
  icon: DatasetIcon;
}

// Названия типов данных не переводятся (технические имена, совпадают с Swagger),
// перевод есть только у description — ключи см. shared/i18n/locales
const TEMPLATE_CONTENT_MAP: Record<string, TemplateStaticContent> = {
  users: {
    title: 'Users',
    descriptionKey: 'datasets.templates.users.description',
    icon: 'users',
  },
  vip_users: {
    title: 'Vip-users',
    descriptionKey: 'datasets.templates.vip_users.description',
    icon: 'vip',
  },
  bets: {
    title: 'Bets',
    descriptionKey: 'datasets.templates.bets.description',
    icon: 'bets',
  },
  bets_daily: {
    title: 'Bets-daily',
    descriptionKey: 'datasets.templates.bets_daily.description',
    icon: 'bets',
  },
  cumulative_bets: {
    title: 'Cumulative-bets',
    descriptionKey: 'datasets.templates.cumulative_bets.description',
    icon: 'bets',
  },
  cumulative_sports_bets: {
    title: 'Cumulative-sports-bets',
    descriptionKey: 'datasets.templates.cumulative_sports_bets.description',
    icon: 'bets',
  },
  sports_bets: {
    title: 'Sports-bets',
    descriptionKey: 'datasets.templates.sports_bets.description',
    icon: 'bets',
  },
  balances_daily: {
    title: 'Balance-daily',
    descriptionKey: 'datasets.templates.balances_daily.description',
    icon: 'balance',
  },
  payments: {
    title: 'Payments',
    descriptionKey: 'datasets.templates.payments.description',
    icon: 'payments',
  },
  cumulative_payments: {
    title: 'Cumulative-payments',
    descriptionKey: 'datasets.templates.cumulative_payments.description',
    icon: 'payments',
  },
  providers_fees: {
    title: 'Providers-fees',
    descriptionKey: 'datasets.templates.providers_fees.description',
    icon: 'payments',
  },
  web_analytics: {
    title: 'Web-analytics',
    descriptionKey: 'datasets.templates.web_analytics.description',
    icon: 'balance', // Подставьте вашу иконку аналитики, если есть
  },
  wins: {
    title: 'Wins',
    descriptionKey: 'datasets.templates.wins.description',
    icon: 'vip', // Подставьте вашу иконку выигрышей, если есть
  },
};

const DEFAULT_CONTENT: TemplateStaticContent = {
  title: 'Unknown Dataset',
  descriptionKey: 'datasets.templates.default.description',
  icon: 'users',
};

/**
 * Единая точка правды для title/description/icon датасета по его системному имени.
 * Если бэк пришлет что-то совсем новое, выведется его системное имя без перевода.
 */
export function getDatasetTypeContent(
  name: string,
): { title: string; description: string; icon: DatasetIcon } {
  const content = TEMPLATE_CONTENT_MAP[name] ?? { ...DEFAULT_CONTENT, title: name };

  return {
    title: content.title,
    description: i18n.global.t(content.descriptionKey),
    icon: content.icon,
  };
}

/**
 * Преобразует сырой элемент с бэкенда в полную структуру DatasetTemplate для UI
 */
export function mapServerTemplate(serverItem: {
  dataset_type_id: string;
  name: string;
}): DatasetTemplate {
  const { title, description, icon } = getDatasetTypeContent(serverItem.name);

  return {
    id: serverItem.dataset_type_id,
    title,
    description,
    icon,
    count: 0,
  };
}
