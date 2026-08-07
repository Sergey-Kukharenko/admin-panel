import { computed, ref } from 'vue';

import { useProducts } from '@/entities/product';

/**
 * Список продуктов для фильтра берём из /products (общий кэш entities/product),
 * а не из уже загруженной истории прогонов — так пункты фильтра не «сжимаются»
 * до одного продукта после того, как выбор применится к запросу истории.
 */
export function useRunHistoryFilters() {
  const selectedProductId = ref('');

  const { data: productsResponse } = useProducts();

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
