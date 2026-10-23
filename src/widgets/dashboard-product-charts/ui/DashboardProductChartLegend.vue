<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppCheckbox } from '@/shared/ui/app-checkbox';

import type { ProductChartLegendItem } from '../model/types';

defineProps<{
  items: ProductChartLegendItem[];
  /** Product name for the accessible name of the group */
  productName: string;
}>();

const emit = defineEmits<{
  toggle: [seriesKey: string];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Legend of the UI kit line chart (52:3437): a checkbox per service in its line color, 20px apart;
       a click hides or shows the line. Not in the dashboard frames: added because 4–7 colored lines
       cannot be told apart without it (WT-326) -->
  <div
    role="group"
    :aria-label="t('dashboard.productCharts.legend', { product: productName })"
    class="flex flex-wrap items-center gap-x-5 gap-y-2"
  >
    <AppCheckbox
      v-for="item in items"
      :key="item.seriesKey"
      :model-value="!item.hidden"
      :color="item.color"
      @update:model-value="emit('toggle', item.seriesKey)"
    >
      {{ item.label }}
    </AppCheckbox>
  </div>
</template>
