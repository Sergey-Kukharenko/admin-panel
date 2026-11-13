import { computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  type ProductChartSlug,
  useProductCharts,
  useProductDisplayNames,
} from '@/entities/product';
import { toIntlLocale } from '@/shared/i18n';
import { lastDaysPeriod } from '@/shared/lib/chart';

import { PRODUCT_CHART_PERIOD_DAYS, PRODUCT_CHARTS } from '../config/charts';
import { mapProductChartToView } from '../lib/mapper';
import type { ProductChartItem } from './types';

export function useDashboardProductCharts() {
  const { t, locale } = useI18n({ useScope: 'global' });
  const { productName, serviceName } = useProductDisplayNames();

  // One query per product of the fixed list (config/charts.ts), the results in the list order
  const queries = useProductCharts(PRODUCT_CHARTS.map((chart) => chart.productSlug));
  const sources = computed(() =>
    PRODUCT_CHARTS.map((chart, index) => ({ ...chart, query: queries.value[index] })),
  );

  // A product that is not connected has no period: it borrows the one of a connected product, so
  // both charts show the same days
  const fallbackPeriod = computed(() => {
    const loaded = sources.value.find(({ query }) => query?.data)?.query?.data?.period;
    if (loaded) return loaded;
    const { start, end } = lastDaysPeriod(PRODUCT_CHART_PERIOD_DAYS);
    return { start_date: start, end_date: end, granularity: 'day' as const };
  });

  // Services hidden by a click in the legend, per product. A view setting of the chart, not a request
  // filter: it is not sent to the API and not kept in the URL
  const hiddenSeries = shallowRef<Record<string, ReadonlySet<string>>>({});

  function toggleSeries(productSlug: string, seriesKey: string) {
    const next = new Set(hiddenSeries.value[productSlug]);
    if (next.has(seriesKey)) {
      next.delete(seriesKey);
    } else {
      next.add(seriesKey);
    }
    hiddenSeries.value = { ...hiddenSeries.value, [productSlug]: next };
  }

  /** Reloads one product chart (the retry button of its error state) */
  function refetch(productSlug: ProductChartSlug) {
    return sources.value.find((source) => source.productSlug === productSlug)?.query?.refetch();
  }

  const charts = computed<ProductChartItem[]>(() =>
    sources.value.map(({ productSlug, subtitleKey, query }) => ({
      productSlug,
      title: productName(productSlug),
      subtitle: t(subtitleKey),
      isLoading: query?.isLoading ?? true,
      // error state only when there is no data at all: a failed refetch keeps the chart visible
      isError: (query?.isError ?? false) && query?.data === undefined,
      chart:
        query?.data === undefined
          ? null
          : mapProductChartToView(query.data, {
              intlLocale: toIntlLocale(locale.value),
              serviceName,
              hiddenSeries: hiddenSeries.value[productSlug],
              fallbackPeriod: fallbackPeriod.value,
            }),
    })),
  );

  return { charts, refetch, toggleSeries };
}
