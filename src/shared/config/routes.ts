/** Имена маршрутов: навигация идёт по имени, а не по строке пути */
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
