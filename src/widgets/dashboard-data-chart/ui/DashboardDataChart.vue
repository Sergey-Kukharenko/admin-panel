<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppFilter } from '@/shared/ui/app-filter';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import { useDashboardDataChart } from '../model/useDashboardDataChart';
import DashboardDataChartErrorState from './DashboardDataChartErrorState.vue';
import DashboardDataChartPlot from './DashboardDataChartPlot.vue';
import DashboardDataChartSkeleton from './DashboardDataChartSkeleton.vue';

const { chart, typeOptions, selectedTypeId, isLoading, isError, refetch } = useDashboardDataChart();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <section class="flex flex-col gap-1 pt-4">
    <!-- Figma BarChart 1322:142113: header, the total 4px under it, 16px to the 236px chart, the
         filter under the chart. The header stays while the data loads or fails -->
    <div class="flex items-center gap-2">
      <h2 class="font-mono text-element-tag font-medium text-(--text-secondary) uppercase">
        {{ t('dashboard.dataChart.title') }}
      </h2>
      <AppStatusBadge status="neutral" :icon="null" :label="t('dashboard.dataChart.period')" />
    </div>

    <DashboardDataChartSkeleton v-if="isLoading" />
    <DashboardDataChartErrorState v-else-if="isError" @retry="refetch()" />
    <div v-else-if="chart" class="flex flex-col gap-4">
      <p class="flex items-end gap-1">
        <span class="text-element-accent text-(--text-primary)">
          {{ chart.totalRowsLabel }}
        </span>
        <!-- a real space keeps "148 000 Строк" one phrase for copy and screen readers (flex hides it) -->
        {{ ' ' }}
        <span class="text-body-sm text-(--text-secondary)">
          {{ t('dashboard.dataChart.rows', chart.totalRows) }}
        </span>
      </p>

      <DashboardDataChartPlot :chart="chart" />

      <!-- the wrapper sizes the filter: AppFilter renders the dropdown root, not an element -->
      <div class="self-start">
        <AppFilter
          v-model="selectedTypeId"
          :title="t('dashboard.dataChart.allTypes')"
          :options="typeOptions"
          :clearable="false"
        />
      </div>
    </div>
  </section>
</template>
