/**
 * Ссылки на документацию API продуктов и сервисов (docs.mico.team) — кнопка «API» в
 * «Истории результатов» ведет на описание конкретного сервиса (решение PM, WT-301).
 * Сопоставление — по системным именам из бэкенда, как и в словаре названий (displayNames.ts).
 */
const DOCS_BASE_URL = 'https://docs.mico.team/H1FgizQT2HW0P42HdSVk';

const PRODUCT_DOCS_PATHS: Record<string, string> = {
  'player-intelligence': '/vip-intelligence/overview',
  'game-recommender': '/game-recommender',
};

// Сервисы сопоставляем по базовой части до `_`, как в словаре названий: варианты модели
// (previp-detection_3, previp-detection_micoformer) ведут на одну страницу. Точное имя
// проверяется первым — у рекомендаций `_` входит в само имя (new_for_user)
const SERVICE_DOCS_PATHS: Record<string, string> = {
  // Якоря GitBook: у main есть свой (по эндпоинту), у остальных — общий раздел рекомендаций
  main: '/game-recommender#post-v1-recommendations-main',
  new_for_user: '/game-recommender#get-recommendations',
  similar_to_user_top_games: '/game-recommender#get-recommendations',
  similar: '/game-recommender/similar-games',
  'previp-detection': '/vip-intelligence/early-vip-detection',
  'vip-churn': '/vip-intelligence/vip-churn',
  'vip-segment-prediction': '/vip-intelligence/vip-segment-prediction',
};

/** Страница сервиса; нет своей — обзор продукта; неизвестный продукт — главная документации */
export function resolveServiceDocsUrl(productSlug: string, serviceSlug: string): string {
  const service = serviceSlug.toLowerCase();
  const path =
    SERVICE_DOCS_PATHS[service] ??
    SERVICE_DOCS_PATHS[service.split('_')[0] ?? ''] ??
    PRODUCT_DOCS_PATHS[productSlug.toLowerCase()] ??
    '';

  return `${DOCS_BASE_URL}${path}`;
}
