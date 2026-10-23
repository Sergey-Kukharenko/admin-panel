<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import { PRODUCT_CHART_PERIOD_DAYS } from '../config/charts';
import { useDashboardProductCharts } from '../model/useDashboardProductCharts';
import DashboardProductChart from './DashboardProductChart.vue';

const { charts, refetch, toggleSeries } = useDashboardProductCharts();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <section class="flex flex-col gap-8">
    <!-- Figma 1322:142185 + 1322:142194: section title with the period badge, two 545px charts 48px
         apart; each chart loads and fails on its own -->
    <div class="flex items-center gap-2">
      <h2 class="font-mono text-element-tag font-medium text-(--text-secondary) uppercase">
        {{ t('dashboard.productCharts.title') }}
      </h2>
      <AppStatusBadge
        status="neutral"
        :icon="null"
        :label="t('dashboard.productCharts.period', PRODUCT_CHART_PERIOD_DAYS)"
      />
    </div>

    <div class="grid grid-cols-2 gap-12">
      <DashboardProductChart
        v-for="item in charts"
        :key="item.productSlug"
        :item="item"
        @retry="refetch(item.productSlug)"
        @toggle="(seriesKey) => toggleSeries(item.productSlug, seriesKey)"
      />
    </div>
  </section>
</template>
