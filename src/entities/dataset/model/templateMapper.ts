import { i18n } from '@/shared/i18n';

import type { DatasetIcon } from './types';

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

// Типы датасетов, от которых отказался бэкенд — на случай, если /data-load/templates
// всё ещё их отдаёт, убираем их из выбора при загрузке и из фильтра в истории вручную
const HIDDEN_DATASET_TEMPLATE_TYPES = new Set(['bets_daily']);

/** Убирает отключённые типы датасетов из списка шаблонов, пришедшего с бэкенда */
export function filterVisibleDatasetTemplates<T extends { name: string }>(templates: T[]): T[] {
  return templates.filter((template) => !HIDDEN_DATASET_TEMPLATE_TYPES.has(template.name));
}

/**
 * Единая точка правды для title/description/icon датасета по его системному имени.
 * Если бэк пришлет что-то совсем новое, выведется его системное имя без перевода.
 */
export function getDatasetTypeContent(name: string): {
  title: string;
  description: string;
  icon: DatasetIcon;
} {
  const content = TEMPLATE_CONTENT_MAP[name] ?? { ...DEFAULT_CONTENT, title: name };

  return {
    title: content.title,
    description: i18n.global.t(content.descriptionKey),
    icon: content.icon,
  };
}
