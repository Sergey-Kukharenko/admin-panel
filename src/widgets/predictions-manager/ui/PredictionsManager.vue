<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';
import { computed } from 'vue';

import { predictionIntegrations } from '../model/constants';
import type { PredictionIntegration } from '../model/types';
import PredictionIntegrationCard from './PredictionIntegrationCard.vue';

defineOptions({
  name: 'PredictionsManager',
});

const groupedIntegrations = computed(() => {
  return predictionIntegrations.reduce<Record<string, PredictionIntegration[]>>(
    (groups, integration) => {
      const group = (groups[integration.category] ??= []);
      group.push(integration);

      return groups;
    },
    {},
  );
});
</script>

<template>
  <TooltipProvider :delay-duration="100">
    <div class="flex w-full flex-col items-start gap-16">
      <section
        v-for="(items, categoryName) in groupedIntegrations"
        :key="categoryName"
        class="flex w-full flex-col items-start gap-3"
      >
        <header class="w-full inline-flex justify-start items-center gap-1">
          <h2
            class="justify-start text-[var(--text-secondary)] text-xs font-medium uppercase leading-5 tracking-wider"
          >
            {{ categoryName }}
          </h2>
        </header>

        <div class="flex w-full flex-wrap gap-4">
          <PredictionIntegrationCard
            v-for="item in items"
            :key="item.id"
            :integration="item"
            class="w-full xl:w-[382px]"
          />
        </div>
      </section>
    </div>
  </TooltipProvider>
</template>
