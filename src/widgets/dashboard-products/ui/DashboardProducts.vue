<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useDashboardProducts } from '../model/useDashboardProducts';
import DashboardProductsCard from './DashboardProductsCard.vue';

const { products } = useDashboardProducts();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Figma block «ML-Продукты» (dashboard frame 1361:147608): title, 12px gaps -->
  <section class="flex flex-col gap-3">
    <h2 class="font-mono text-element-tag font-medium text-(--text-secondary) uppercase">
      {{ t('dashboard.products.title') }}
    </h2>

    <div class="flex gap-3">
      <DashboardProductsCard v-for="card in products" :key="card.slug" :card="card" />
    </div>
  </section>
</template>
