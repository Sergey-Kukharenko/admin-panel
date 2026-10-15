<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { DASHBOARD_PRODUCTS } from '../config/mocks';
import ProductAvailabilityCard from './ProductAvailabilityCard.vue';

defineOptions({
  name: 'DashboardProducts',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="font-mono text-xs font-medium text-(--text-secondary) uppercase">
      {{ t('dashboard.products') }}
    </p>

    <div class="flex gap-3">
      <ProductAvailabilityCard
        v-for="product in DASHBOARD_PRODUCTS"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
