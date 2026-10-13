export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

/**
 * Экраны управления подключённой интеграцией: API secrets / Key secrets (WT-345–353).
 * В Ph-1 вырезаны (решение PM 2026-09-24, макеты — раздел H2), работают на моках, поэтому
 * по умолчанию выключены. Включить локально: VITE_FEATURE_INTEGRATION_SECRETS=true в .env.local
 */
export const FEATURE_INTEGRATION_SECRETS =
  import.meta.env.VITE_FEATURE_INTEGRATION_SECRETS === 'true';
