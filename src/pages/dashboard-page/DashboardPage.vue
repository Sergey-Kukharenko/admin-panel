<script setup lang="ts">
import { DashboardDataChart } from '@/widgets/dashboard-data-chart';
import { DashboardProductCharts } from '@/widgets/dashboard-product-charts';
import { DashboardProducts } from '@/widgets/dashboard-products';
import { DashboardRecentOperations } from '@/widgets/dashboard-recent-operations';
</script>

<template>
  <div class="flex flex-col gap-8">
    <DashboardProducts />
    <DashboardDataChart />
    <DashboardProductCharts />
    <DashboardRecentOperations />
  </div>
</template>
