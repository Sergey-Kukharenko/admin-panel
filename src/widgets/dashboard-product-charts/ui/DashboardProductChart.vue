<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { FEATURE_PRODUCT_ANALYTICS_LINKS } from '@/shared/config';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppSkeleton } from '@/shared/ui/app-skeleton';

import type { ProductChartItem } from '../model/types';
import DashboardProductChartErrorState from './DashboardProductChartErrorState.vue';
import DashboardProductChartLegend from './DashboardProductChartLegend.vue';
import DashboardProductChartPlot from './DashboardProductChartPlot.vue';

defineProps<{
  item: ProductChartItem;
}>();

const emit = defineEmits<{
  retry: [];
  /** A legend click: show or hide the service */
  toggle: [seriesKey: string];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <article class="flex min-w-0 flex-col gap-4 pt-4">
    <!-- Figma Linechart 1323:161272: product name and subtitle, 16px to the chart, 16px to the button -->
    <div class="flex flex-col gap-1">
      <h3 class="font-mono text-element-tag font-medium text-(--text-secondary) uppercase">
        {{ item.title }}
      </h3>
      <p class="text-body-sm text-(--text-secondary)">{{ item.subtitle }}</p>
    </div>

    <!-- the skeleton and the error state take the 236px of the plot: no frames for them in the mockup -->
    <AppSkeleton
      v-if="item.isLoading"
      data-chart-skeleton
      class="h-59 w-full rounded-(--radius-lg)"
    />
    <DashboardProductChartErrorState v-else-if="item.isError" @retry="emit('retry')" />
    <template v-else-if="item.chart">
      <DashboardProductChartPlot :chart="item.chart" :product-name="item.title" />
      <DashboardProductChartLegend
        v-if="item.chart.legend.length > 0"
        :items="item.chart.legend"
        :product-name="item.title"
        @toggle="(seriesKey) => emit('toggle', seriesKey)"
      />
    </template>

    <!-- TODO: the button has no target yet: the Superset links are out of the Ph-1 dashboard RFC
         (PRD AC 19, asked in WT-326). It stays behind FEATURE_PRODUCT_ANALYTICS_LINKS as the help
         buttons behind FEATURE_HELP_LINKS (HelpMenu); with the link it becomes an external link,
         AppButton as-child around <a target="_blank" rel="noopener noreferrer"> -->
    <AppButton
      v-if="FEATURE_PRODUCT_ANALYTICS_LINKS"
      variant="secondary"
      size="small"
      class="self-start"
    >
      {{ t('dashboard.productCharts.analyticsLink') }}
      <AppIcon name="arrow-right" />
    </AppButton>
  </article>
</template>
