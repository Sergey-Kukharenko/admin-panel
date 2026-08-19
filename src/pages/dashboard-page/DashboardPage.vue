<script setup lang="ts">
import { DashboardDataChart } from '@/widgets/dashboard-data-chart';
import { DashboardPredictionsChart } from '@/widgets/dashboard-predictions-chart';
import { DashboardProducts } from '@/widgets/dashboard-products';
import { DashboardRecentOperations } from '@/widgets/dashboard-recent-operations';

defineOptions({
  name: 'DashboardPage',
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <DashboardProducts />
    <DashboardDataChart />
    <DashboardPredictionsChart />
    <DashboardRecentOperations />
  </div>
</template>
