import { computed } from 'vue';

import { useProducts } from '@/entities/product';

import { mapProductToIntegrations } from './mapper';
import type { PredictionIntegration } from './types';

export function usePredictionsManager() {
  const { data: productsResponse, isLoading, isError, refetch } = useProducts();

  const integrations = computed<PredictionIntegration[]>(() =>
    (productsResponse.value ?? []).flatMap(mapProductToIntegrations),
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
