import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useDataVolumeChart } from '@/entities/dataset';
import { toIntlLocale } from '@/shared/i18n';
import { createQueryPatch } from '@/shared/lib/router';
import type { FilterOption } from '@/shared/ui/app-filter';

import { URL_PARAMS } from '../config/urlParams';
import { mapDataVolumeToChart } from '../lib/mapper';

/** Value of the "all data types" option: no type in the request and in the URL */
const ALL_TYPES = '';

export function useDashboardDataChart() {
  const { t, locale } = useI18n({ useScope: 'global' });
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  // Raw URL value: a repeated or comma-joined parameter keeps its first id only
  const requestedTypeId = computed(() => {
    const raw = route.query[URL_PARAMS.dataTypeId];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.split(',')[0]?.trim() ?? ALL_TYPES;
  });

  // The id from the URL goes to the request before it is checked: the list of known types comes in
  // the same response (filters.dataset_types), so the first request cannot wait for it. An unknown
  // id costs one extra request, then the watch below drops it (how the API answers an unknown id is
  // asked in the RFC, WT-322)
  const {
    data,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useDataVolumeChart(() => ({
    dataset_type_id__in: requestedTypeId.value ? [requestedTypeId.value] : [],
  }));

  const dataTypes = computed(() => data.value?.filters?.dataset_types ?? []);
  const isKnownType = computed(() =>
    dataTypes.value.some((type) => type.dataset_type_id === requestedTypeId.value),
  );

  // One data type at a time, as the UI kit Filter type=single in the mockup (Figma 1322:142184)
  const selectedTypeId = computed<string>({
    get: () => (isKnownType.value ? requestedTypeId.value : ALL_TYPES),
    set: (value) => replaceQuery({ [URL_PARAMS.dataTypeId]: value || undefined }),
  });

  // The type list has arrived: only then an unknown id can be told from a list still loading.
  const hasTypeList = computed(() => data.value?.filters != null);

  // An id the API does not know (old link, typo) falls back to all types and leaves the URL
  watch(
    [requestedTypeId, isKnownType, hasTypeList],
    ([id, known, listed]) => {
      if (id && listed && !known) replaceQuery({ [URL_PARAMS.dataTypeId]: undefined });
    },
    { immediate: true },
  );

  // Error state only when there is no data at all: a failed refetch keeps the chart visible
  const isError = computed(() => isRequestError.value && !data.value);

  const chart = computed(() =>
    data.value ? mapDataVolumeToChart(data.value, toIntlLocale(locale.value)) : null,
  );

  const typeOptions = computed<FilterOption[]>(() => [
    { value: ALL_TYPES, label: t('dashboard.dataChart.allTypes') },
    ...dataTypes.value.map((type) => ({ value: type.dataset_type_id, label: type.name })),
  ]);

  return { chart, typeOptions, selectedTypeId, isLoading, isError, refetch };
}
