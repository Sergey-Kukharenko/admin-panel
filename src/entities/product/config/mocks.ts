import type { ProductStatusSummary } from '../model/types';

// Mock of the main dashboard mockup state (Figma «Много данных» 1361:147608) until the API exists:
// the Ph-1 dashboard RFC does not cover product statuses yet (WT-322). Order and slugs as in /products
export const MOCK_PRODUCT_STATUS_SUMMARIES: ProductStatusSummary[] = [
  {
    productSlug: 'game-recommender',
    isAvailable: true,
    productStatus: 'active',
    dataStatus: 'validated',
    resultStatus: 'ready',
  },
  {
    productSlug: 'player-intelligence',
    isAvailable: true,
    productStatus: 'active',
    dataStatus: 'validated',
    resultStatus: 'ready',
  },
];
