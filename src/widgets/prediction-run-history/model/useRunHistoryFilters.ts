import { useQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { productApi } from '@/entities/product';

const PRODUCT_OPTIONS_QUERY_KEY = ['prediction-run-history-products'];
const PRODUCT_OPTIONS_STALE_TIME = 1000 * 60 * 15;

/**
 * Список продуктов для фильтра берём из /products, а не из уже загруженной истории
 * прогонов — так пункты фильтра не «сжимаются» до одного продукта после того,
 * как выбор применится к запросу истории.
 */
export function useRunHistoryFilters() {
  const selectedProductId = ref('');

  const { data: productsResponse } = useQuery({
    queryKey: PRODUCT_OPTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await productApi.getProducts();
      return response.data;
    },
    staleTime: PRODUCT_OPTIONS_STALE_TIME,
  });

  const productOptions = computed(() =>
    (productsResponse.value ?? [])
      .map((product) => ({ id: product.product_id, name: product.name }))
      .sort((first, second) => first.name.localeCompare(second.name, 'ru')),
  );

  const selectedProductName = computed(
    () =>
      productOptions.value.find((product) => product.id === selectedProductId.value)?.name ?? '',
  );

  return { selectedProductId, selectedProductName, productOptions };
}
