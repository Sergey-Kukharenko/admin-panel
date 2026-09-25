import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  useProductDisplayNames,
  useProducts,
  useProductsRequiredFilesStatus,
} from '@/entities/product';
import { toIntlLocale } from '@/shared/i18n';

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

  const { locale } = useI18n({ useScope: 'global' });
  const { productName, serviceName } = useProductDisplayNames();

  // Зависит от locale — названия и даты перестраиваются при переключении языка
  const integrations = computed<PredictionIntegration[]>(() => {
    const intlLocale = toIntlLocale(locale.value);

    return (productsResponse.value ?? []).flatMap((product) =>
      mapProductToIntegrations(product, {
        isDataReady: statusByProductId.value.get(product.product_id)?.is_ready,
        intlLocale,
        productName,
        serviceName,
      }),
    );
  });

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
