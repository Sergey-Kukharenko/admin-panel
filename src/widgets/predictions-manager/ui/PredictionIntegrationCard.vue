<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';

import { predictionIntegrationIconByName, predictionTooltipIconByName } from '../model/constants';
import type { PredictionIntegration } from '../model/types';
import PredictionIntegrationMetrics from './PredictionIntegrationMetrics.vue';

defineOptions({
  name: 'PredictionIntegrationCard',
});

defineProps<{
  integration: PredictionIntegration;
}>();
</script>

<template>
  <article
    class="w-95.5 max-w-95.5 min-h-32 shrink-0 px-2 pb-2 bg-(--bg-surface-neutral) rounded-md flex flex-col justify-start items-start transition-all duration-200"
  >
    <div class="self-stretch p-3 inline-flex justify-start items-center gap-4">
      <div class="flex-1 flex justify-start items-center gap-3 min-w-0">
        <div
          :data-name="integration.name"
          class="size-7 shrink-0 relative rounded-full flex items-center justify-center overflow-hidden"
        >
          <img
            :src="predictionIntegrationIconByName[integration.iconName]"
            :alt="integration.name"
            class="object-contain"
          />
        </div>

        <TooltipRoot>
          <TooltipTrigger as-child>
            <button
              type="button"
              :aria-label="`Информация о статусе ${integration.name}`"
              class="size-3.5 shrink-0 relative flex items-center justify-center cursor-help focus:outline-none group"
            >
              <img
                :src="predictionTooltipIconByName[integration.tooltipIcon]"
                alt=""
                class="opacity-80 group-hover:opacity-100 transition-opacity object-contain"
              />
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            :side-offset="6"
            class="w-56 z-50 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
          >
            <div
              class="px-2 py-1.5 bg-(--bg-foreground-overlay) rounded-sm shadow-(--shadow-panel) backdrop-blur-[20px] flex flex-col justify-center items-center"
            >
              <p class="text-(--text-overlay) text-xs font-normal font-['Geist'] leading-4">
                {{ integration.tooltipText }}
              </p>
            </div>

            <TooltipArrow class="fill-(--bg-foreground-overlay)" :width="8" :height="4" />
          </TooltipContent>
        </TooltipRoot>

        <h3
          class="justify-start text-(--text-primary) text-sm font-medium font-['Geist'] leading-6 truncate"
        >
          {{ integration.name }}
        </h3>
      </div>
    </div>

    <PredictionIntegrationMetrics :integration="integration" />
  </article>
</template>
