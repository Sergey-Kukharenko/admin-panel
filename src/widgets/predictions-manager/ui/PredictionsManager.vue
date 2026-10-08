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

        <!-- По макету (619:19130) карточки сервисов идут по две в ряд на всю ширину.
             Адаптивно: minmax(max(420px, половина ширины)) даёт не больше 2 колонок, а когда
             на карточку остаётся меньше 420px — одну, чтобы колонки внутри не сжимались (WT-538) -->
        <div
          class="grid w-full grid-cols-[repeat(auto-fill,minmax(max(420px,calc((100%-24px)/2)),1fr))] gap-x-6 gap-y-3"
        >
          <PredictionIntegrationCard v-for="item in items" :key="item.id" :integration="item" />
        </div>
      </section>
    </div>

    <PredictionsManagerEmptyState v-else />
  </TooltipProvider>
</template>
