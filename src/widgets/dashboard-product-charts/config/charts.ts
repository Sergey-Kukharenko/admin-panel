/**
 * Days the product charts look back: the API returns the last 30 days (RFC Ph-1 Dashboard, 4.3–4.4).
 * The period badge and the fallback period of a product that is not connected follow it
 */
export const PRODUCT_CHART_PERIOD_DAYS = 30;

// Product charts of the dashboard in the mockup order: Recommender System on the left, Player
// Intelligence on the right in every frame (Figma 1322:142194, 1418:191791).
// TODO: PRD AC 16 wants the chart list and titles from the API, but the RFC endpoints are one per
// product and carry no title (RFC Ph-1 Dashboard, 4.3–4.4): the list and the subtitles stay here
// until the backend adds them (asked in WT-326)
export const PRODUCT_CHARTS = [
  {
    productSlug: 'game-recommender',
    subtitleKey: 'dashboard.productCharts.subtitles.recommenderSystem',
  },
  {
    productSlug: 'player-intelligence',
    subtitleKey: 'dashboard.productCharts.subtitles.playerIntelligence',
  },
] as const;
