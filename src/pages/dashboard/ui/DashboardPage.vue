<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { FEATURE_RECENT_OPERATIONS } from '@/shared/config';
import { DashboardDataChart } from '@/widgets/dashboard-data-chart';
import { DashboardProductCharts } from '@/widgets/dashboard-product-charts';
import { DashboardProducts } from '@/widgets/dashboard-products';
import { DashboardRecentOperations } from '@/widgets/dashboard-recent-operations';
import { DashboardWelcomeBanner } from '@/widgets/dashboard-welcome-banner';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Figma «Title and description» (dashboard 1322:138648) -->
    <div class="flex flex-col gap-2">
      <h1 class="text-title-sm font-medium text-(--text-primary)">
        {{ t('dashboard.page.title') }}
      </h1>

      <p class="max-w-132 text-body-sm text-(--text-secondary)">
        {{ t('dashboard.page.description') }}
      </p>
    </div>

    <DashboardWelcomeBanner />
    <DashboardProducts />
    <DashboardDataChart />
    <DashboardProductCharts />
    <DashboardRecentOperations v-if="FEATURE_RECENT_OPERATIONS" />
  </div>
</template>
