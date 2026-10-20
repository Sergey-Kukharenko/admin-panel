/** Product status: training state of the ML model, Figma Tag type=model (PRD Ph-1 Dashboard, AC 6) */
export type ProductModelStatus = 'awaiting' | 'training' | 'active' | 'error';

/** Consolidated data quality status (PRD Ph-1 Dashboard, AC 7; values as in the mockup) */
export type ProductDataStatus =
  | 'awaiting'
  | 'processing'
  | 'validated'
  | 'issue'
  | 'invalidUpdate'
  | 'outdated';

/** Consolidated results status (PRD Ph-1 Dashboard, AC 8; values as in the mockup) */
export type ProductResultStatus = 'awaiting' | 'generating' | 'failed' | 'ready';

/** Product / Data / Result statuses of one product for the dashboard cards */
export interface ProductStatusSummary {
  /** Product slug from the backend (`name` in /products), e.g. `game-recommender` */
  productSlug: string;
  /**
   * false — the product is not connected under the client's contract (PM decision, 2026-10-16):
   * the card shows a lock instead of the statuses
   */
  isAvailable: boolean;
  productStatus: ProductModelStatus;
  dataStatus: ProductDataStatus;
  resultStatus: ProductResultStatus;
}
