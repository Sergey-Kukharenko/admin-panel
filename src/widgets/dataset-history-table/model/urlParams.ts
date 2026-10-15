// Имена параметров строки запроса URL (фильтры, сортировка, пагинация), не ключи TanStack Query
export const URL_PARAMS = {
  types: 'types',
  status: 'status',
  period: 'period',
  sort: 'sort',
  order: 'order',
  page: 'page',
} as const;
