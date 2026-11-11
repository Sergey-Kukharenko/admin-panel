import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useDataVolumeChart } from '@/entities/dataset';
import { toIntlLocale } from '@/shared/i18n';
import { createQueryPatch } from '@/shared/lib/router';
import type { FilterOption } from '@/shared/ui/app-filter';

import { URL_PARAMS } from '../config/urlParams';
import { mapDataVolumeToChart, toDataVolumeFilters } from '../lib';

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
    return value?.split(',')[0]?.trim().toLowerCase() ?? ALL_TYPES;
  });

  // The id from the URL goes to the request before it is checked: the list of known types comes in
  // the same response (filters.dataset_types), so the first request cannot wait for it. For an id
  // outside the list the API still returns the full list, then the watch below drops the id: one
  // extra request
  const {
    data,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useDataVolumeChart(() => toDataVolumeFilters(requestedTypeId.value));

  const dataTypes = computed(() => data.value?.filters.dataset_types ?? []);
  const isKnownType = computed(() =>
    dataTypes.value.some((type) => type.dataset_type_id === requestedTypeId.value),
  );

  // One data type at a time, as the UI kit Filter type=single in the mockup (Figma 1322:142184)
  const selectedTypeId = computed<string>({
    get: () => (isKnownType.value ? requestedTypeId.value : ALL_TYPES),
    set: (value) => replaceQuery({ [URL_PARAMS.dataTypeId]: value || undefined }),
  });

  // Every response brings the type list: only then an unknown id can be told from a list still
  // loading
  const hasTypeList = computed(() => data.value !== undefined);

  // An id the API does not know (old link, typo) falls back to all types and leaves the URL
  watch(
    [requestedTypeId, isKnownType, hasTypeList],
    ([id, known, listed]) => {
      if (id && listed && !known) replaceQuery({ [URL_PARAMS.dataTypeId]: undefined });
    },
    { immediate: true },
  );

  // A failed refetch of the same key keeps cached data visible. After a key change, a failed
  // request clears keepPreviousData's placeholder and shows the error state instead.
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
