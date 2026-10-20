import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useProductDisplayNames, useProductStatusSummaries } from '@/entities/product';

import { mapProductStatusToCard } from '../lib/mapper';

/** Cards of the "ML products" block: the client's product statuses with names and texts */
export function useDashboardProducts() {
  const { summaries } = useProductStatusSummaries();
  const { productName } = useProductDisplayNames();
  const { t } = useI18n({ useScope: 'global' });

  // t() reads the locale, so the cards are rebuilt when the language changes
  const products = computed(() =>
    summaries.value.map((summary) => mapProductStatusToCard(summary, { productName, t })),
  );

  return { products };
}
