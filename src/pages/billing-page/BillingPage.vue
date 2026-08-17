<script setup lang="ts">
import { TariffLimitsSection } from '@/widgets/tariff-limits';
import { TariffUsageChart } from '@/widgets/tariff-usage-chart';

defineOptions({
  name: 'BillingPage',
});
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <TariffLimitsSection />
    <TariffUsageChart />
  </div>
</template>
