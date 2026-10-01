import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useProductDisplayNames, useProducts } from '@/entities/product';
import { createQueryPatch } from '@/shared/lib/router/createQueryPatch';

import type { PredictionRunSortField, PredictionRunSortOrder } from './types';

// Размер страницы фиксированный: выбора «Строк на стр.» в UI-ките нет (решение PM)
export const RUN_HISTORY_PAGE_SIZE = 20;

const QUERY_KEYS = {
  product: 'product',
  page: 'page',
  sort: 'sort',
  order: 'order',
} as const;

// Колонка таблицы -> поле order_by в GET /ml-service-runs (оно же пишется в URL).
// Продукт и сервис бэк сортирует по системному имени (product_name / ml_service_name),
// поэтому порядок может не совпадать с алфавитом переведенных названий в таблице
export const RUN_HISTORY_SORT_API_FIELD: Record<PredictionRunSortField, string> = {
  runId: 'product_run_id',
  product: 'product_name',
  service: 'ml_service_name',
  startedAt: 'started_at',
  finishedAt: 'finished_at',
  recordsCount: 'total_predictions',
  status: 'status',
};

const SORT_FIELD_BY_API_FIELD = Object.fromEntries(
  Object.entries(RUN_HISTORY_SORT_API_FIELD).map(([field, apiField]) => [apiField, field]),
) as Record<string, PredictionRunSortField>;

/**
 * Фильтр, сортировка и пагинация истории прогонов живут в URL (как на «Загрузке данных»):
 * переживают перезагрузку и открываются по ссылке. Смена фильтра возвращает
 * на первую страницу.
 *
 * Список продуктов для фильтра берём из /products (общий кэш entities/product), а не из
 * загруженной истории — так пункты фильтра не «сжимаются» до одного продукта.
 */
export function useRunHistoryFilters() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  const selectedProductId = computed<string>({
    get: () => route.query[QUERY_KEYS.product]?.toString() ?? '',
    set: (value) =>
      replaceQuery({ [QUERY_KEYS.product]: value || undefined, [QUERY_KEYS.page]: undefined }),
  });

  const page = computed<number>({
    get() {
      const value = Number(route.query[QUERY_KEYS.page]);
      return Number.isInteger(value) && value > 0 ? value : 1;
    },
    set: (value) => replaceQuery({ [QUERY_KEYS.page]: value > 1 ? String(value) : undefined }),
  });

  const sortField = computed<PredictionRunSortField | null>(
    () => SORT_FIELD_BY_API_FIELD[route.query[QUERY_KEYS.sort]?.toString() ?? ''] ?? null,
  );

  const sortOrder = computed<PredictionRunSortOrder>(() =>
    route.query[QUERY_KEYS.order] === 'desc' ? 'desc' : 'asc',
  );

  // Первый клик по колонке — по возрастанию, повторный — по убыванию
  function toggleSort(field: PredictionRunSortField) {
    const order: PredictionRunSortOrder =
      sortField.value === field && sortOrder.value === 'asc' ? 'desc' : 'asc';

    // Страницу не сбрасываем: число записей от сортировки не меняется, пользователь остается
    // на той же странице, просто с другим порядком строк
    replaceQuery({
      [QUERY_KEYS.sort]: RUN_HISTORY_SORT_API_FIELD[field],
      [QUERY_KEYS.order]: order,
    });
  }

  // order_by для бэка; без выбранной колонки — дефолт бэка (-created_at, новые сверху)
  const orderBy = computed(() => {
    if (!sortField.value) return undefined;

    const apiField = RUN_HISTORY_SORT_API_FIELD[sortField.value];
    return sortOrder.value === 'desc' ? `-${apiField}` : apiField;
  });

  const { data: productsResponse } = useProducts();
  const { productName } = useProductDisplayNames();

  const productOptions = computed(() =>
    (productsResponse.value ?? [])
      .map((product) => ({ id: product.product_id, name: productName(product.name) }))
      .sort((first, second) => first.name.localeCompare(second.name, 'ru')),
  );

  const selectedProductName = computed(
    () =>
      productOptions.value.find((product) => product.id === selectedProductId.value)?.name ?? '',
  );

  return {
    selectedProductId,
    selectedProductName,
    productOptions,
    page,
    sortField,
    sortOrder,
    toggleSort,
    orderBy,
  };
}
