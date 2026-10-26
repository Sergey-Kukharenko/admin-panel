import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useRecentOperations } from '@/entities/operation';
import { useProductDisplayNames } from '@/entities/product';
import { toIntlLocale } from '@/shared/i18n';

import { mapRecentOperationsToView } from '../lib/mapper';

export function useDashboardRecentOperations() {
  const { t, locale } = useI18n({ useScope: 'global' });
  const { serviceName } = useProductDisplayNames();
  const { data, isLoading, isError: isRequestError, refetch } = useRecentOperations();

  // Error state only when there is no data at all: a failed refetch keeps the table visible
  const isError = computed(() => isRequestError.value && data.value === undefined);

  const intlLocale = computed(() => toIntlLocale(locale.value));

  const view = computed(() =>
    data.value === undefined
      ? null
      : mapRecentOperationsToView(data.value, {
          intlLocale: intlLocale.value,
          translate: (key) => t(key),
          serviceName,
          rowsLabel: (count, formatted) =>
            t('dashboard.recentOperations.rows', { rows: formatted }, count),
        }),
  );

  const hasData = computed(() => (view.value?.rows.length ?? 0) > 0);

  // "1 234 записи": the number in the locale, the plural form by the number itself
  const countLabel = computed(() =>
    view.value
      ? t(
          'dashboard.recentOperations.count',
          { total: view.value.totalCount.toLocaleString(intlLocale.value) },
          view.value.totalCount,
        )
      : '',
  );

  return { view, hasData, countLabel, isLoading, isError, refetch };
}
