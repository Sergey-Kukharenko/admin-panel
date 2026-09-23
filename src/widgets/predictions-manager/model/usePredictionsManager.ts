import { computed } from 'vue';

import { useProducts, useProductsRequiredFilesStatus } from '@/entities/product';

import { mapProductToIntegrations } from './mapper';
import type { PredictionIntegration } from './types';

export function usePredictionsManager() {
  const { data: productsResponse, isLoading, isError: isRequestError, refetch } = useProducts();

  // Ошибка фонового поллинга не должна переключать уже отрисованные карточки в
  // error-state — показываем его, только если данных нет совсем (graceful degradation, WT-298)
  const isError = computed(() => isRequestError.value && !productsResponse.value);

  const productIds = computed(() =>
    (productsResponse.value ?? []).map((product) => product.product_id),
  );
  const { statusByProductId } = useProductsRequiredFilesStatus(productIds);

  const integrations = computed<PredictionIntegration[]>(() =>
    (productsResponse.value ?? []).flatMap((product) =>
      mapProductToIntegrations(product, statusByProductId.value.get(product.product_id)?.is_ready),
    ),
  );

  const groupedIntegrations = computed(() =>
    integrations.value.reduce<Record<string, PredictionIntegration[]>>((groups, integration) => {
      const group = (groups[integration.category] ??= []);
      group.push(integration);

      return groups;
    }, {}),
  );

  const hasData = computed(() => integrations.value.length > 0);

  return { groupedIntegrations, hasData, isLoading, isError, refetch };
}
