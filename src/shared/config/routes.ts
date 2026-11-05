/** Route names: navigation goes by name, not by path string */
export const ROUTE_NAMES = {
  dashboard: 'dashboard',
  integrations: 'integrations',
  integrationDetail: 'integration-detail',
  datasets: 'datasets',
  predictions: 'predictions',
  billing: 'billing',
  profile: 'profile',
  notFound: 'not-found',
} as const;

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

/** Query params that one page passes to another in a link */
export const ROUTE_QUERY = {
  /** `/datasets?upload=1` opens the upload drawer (the dashboard welcome banner, WT-564) */
  openUpload: 'upload',
} as const;
