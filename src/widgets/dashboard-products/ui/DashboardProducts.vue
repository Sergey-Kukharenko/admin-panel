<script setup lang="ts">
import { DASHBOARD_PRODUCTS } from '../model/data';
import ProductAvailabilityCard from './ProductAvailabilityCard.vue';

defineOptions({
  name: 'DashboardProducts',
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="font-mono text-xs font-medium text-(--text-secondary) uppercase">Продукты</p>

    <div class="flex gap-3">
      <ProductAvailabilityCard
        v-for="product in DASHBOARD_PRODUCTS"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
