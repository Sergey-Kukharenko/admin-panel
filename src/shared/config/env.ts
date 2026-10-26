export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

/**
 * Экраны управления подключённой интеграцией: API secrets / Key secrets (WT-345–353).
 * В Ph-1 вырезаны (решение PM 2026-09-24, макеты — раздел H2), работают на моках, поэтому
 * по умолчанию выключены. Включить локально: VITE_FEATURE_INTEGRATION_SECRETS=true в .env.local
 */
export const FEATURE_INTEGRATION_SECRETS =
  import.meta.env.VITE_FEATURE_INTEGRATION_SECRETS === 'true';

/**
 * Notifications bell and panel in the header (WT-323). Hidden for the release: there is no backend
 * for notifications yet, the panel works on mocks (N. Ivanova in Slack, 2026-10-15).
 * Enable locally: VITE_FEATURE_NOTIFICATIONS=true in .env.local
 */
export const FEATURE_NOTIFICATIONS = import.meta.env.VITE_FEATURE_NOTIFICATIONS === 'true';

/**
 * "Documentation" and "Contact the manager" buttons of the help menu (WT-323). Hidden: their targets
 * (docs link, manager contact) are not defined yet, and a button without an action must not ship.
 * Enable locally: VITE_FEATURE_HELP_LINKS=true in .env.local
 */
export const FEATURE_HELP_LINKS = import.meta.env.VITE_FEATURE_HELP_LINKS === 'true';

/**
 * "Go to detailed analytics" buttons under the dashboard product charts (WT-326, PRD AC 19). Hidden:
 * the Superset links are out of the Ph-1 dashboard RFC and their targets are not defined yet.
 * Enable locally: VITE_FEATURE_PRODUCT_ANALYTICS_LINKS=true in .env.local
 */
export const FEATURE_PRODUCT_ANALYTICS_LINKS =
  import.meta.env.VITE_FEATURE_PRODUCT_ANALYTICS_LINKS === 'true';

/**
 * «Последние операции» table on the dashboard (WT-327). Hidden: it is not in the MVP dashboard
 * frames, the PRD or the RFC, and there is no endpoint for it (WT-334); it runs on a mock until the
 * PM decides on Ph-1 or WT-416 (asked in WT-327).
 * Enable locally: VITE_FEATURE_RECENT_OPERATIONS=true in .env.local
 */
export const FEATURE_RECENT_OPERATIONS = import.meta.env.VITE_FEATURE_RECENT_OPERATIONS === 'true';
