import { computed, type Ref, ref } from 'vue';

import type { PredictionRunRecord } from './types';

export function useRunHistoryFilters(items: Ref<PredictionRunRecord[]>) {
  const selectedProduct = ref('');

  const productOptions = computed(() =>
    [...new Set(items.value.map((item) => item.product))].sort((first, second) =>
      first.localeCompare(second, 'ru'),
    ),
  );

  const filteredItems = computed(() => {
    if (!selectedProduct.value) return items.value;

    return items.value.filter((item) => item.product === selectedProduct.value);
  });

  return { selectedProduct, productOptions, filteredItems };
}
