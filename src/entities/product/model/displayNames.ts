import { useI18n } from 'vue-i18n';

/**
 * Бэкенд отдает в `name` системные slug'и продуктов и сервисов (`player-intelligence`,
 * `previp-detection_3`, `similar`), а в макетах — человекочитаемые названия (WT-296).
 * Словарь: slug -> id сообщения в `predictions.names.*` локалей.
 *
 * Сервисы сопоставляем по базовой части slug'а до `_`: суффикс после него — вариант модели
 * (`previp-detection_3`, `previp-detection_micoformer`), и его дописываем в скобках, чтобы
 * две карточки одного сервиса не выглядели одинаково.
 * Неизвестный slug не ломает UI — показываем его «очеловеченным» (`foo-bar` -> `Foo Bar`).
 */
const PRODUCT_NAME_IDS: Record<string, string> = {
  'player-intelligence': 'playerIntelligence',
  'game-recommender': 'recommenderSystem',
};

const SERVICE_NAME_IDS: Record<string, string> = {
  'previp-detection': 'earlyVip',
  main: 'gameRecommendations',
  similar: 'similarGames',
};

const VARIANT_SEPARATOR = '_';

function humanizeSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function splitVariant(slug: string): { base: string; variant: string | null } {
  const separatorIndex = slug.indexOf(VARIANT_SEPARATOR);

  if (separatorIndex === -1) return { base: slug, variant: null };

  return {
    base: slug.slice(0, separatorIndex),
    variant: slug.slice(separatorIndex + 1) || null,
  };
}

export function useProductDisplayNames() {
  const { t } = useI18n({ useScope: 'global' });

  function productName(slug: string): string {
    const id = PRODUCT_NAME_IDS[slug.toLowerCase()];
    return id ? t(`predictions.names.products.${id}`) : humanizeSlug(slug);
  }

  function serviceName(slug: string): string {
    const normalized = slug.toLowerCase();
    const exactId = SERVICE_NAME_IDS[normalized];

    if (exactId) return t(`predictions.names.services.${exactId}`);

    const { base, variant } = splitVariant(normalized);
    const baseId = SERVICE_NAME_IDS[base];

    if (!baseId) return humanizeSlug(slug);

    const name = t(`predictions.names.services.${baseId}`);
    return variant ? `${name} (${variant})` : name;
  }

  return { productName, serviceName };
}

// Иконок продуктов в дизайне две; тип определяем по slug'у, неизвестный продукт — дефолтная
export type ProductIconName = 'player-intelligence' | 'game-recommendations';

export function resolveProductIconName(slug: string): ProductIconName {
  return /recommend|game/.test(slug.toLowerCase()) ? 'game-recommendations' : 'player-intelligence';
}
