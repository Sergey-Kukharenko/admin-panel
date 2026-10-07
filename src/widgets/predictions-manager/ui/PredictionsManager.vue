<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';

import { usePredictionsManager } from '../model/usePredictionsManager';
import PredictionIntegrationCard from './PredictionIntegrationCard.vue';
import PredictionsManagerEmptyState from './PredictionsManagerEmptyState.vue';
import PredictionsManagerErrorState from './PredictionsManagerErrorState.vue';
import PredictionsManagerSkeleton from './PredictionsManagerSkeleton.vue';

defineOptions({
  name: 'PredictionsManager',
});

const { groupedIntegrations, hasData, isLoading, isError, refetch } = usePredictionsManager();
</script>

<template>
  <TooltipProvider :delay-duration="100">
    <PredictionsManagerSkeleton v-if="isLoading" />
    <PredictionsManagerErrorState v-else-if="isError" @retry="refetch" />

    <div v-else-if="hasData" class="flex w-full flex-col items-start gap-16">
      <section
        v-for="(items, categoryName) in groupedIntegrations"
        :key="categoryName"
        class="flex w-full flex-col items-start gap-3"
      >
        <header class="w-full inline-flex justify-start items-center gap-1">
          <h2
            class="justify-start font-mono text-element-tag font-medium uppercase text-[var(--text-secondary)]"
          >
            {{ categoryName }}
          </h2>
        </header>

        <!-- По макету (431:30974, 544:30337) карточки сервисов идут по одной в ряд
             на всю ширину страницы, без пустого места справа (WT-538) -->
        <div class="flex w-full flex-col gap-4">
          <PredictionIntegrationCard v-for="item in items" :key="item.id" :integration="item" />
        </div>
      </section>
    </div>

    <PredictionsManagerEmptyState v-else />
  </TooltipProvider>
</template>
