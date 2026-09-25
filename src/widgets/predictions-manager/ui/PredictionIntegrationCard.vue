<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { predictionIntegrationIconByName, predictionTooltipIconByName } from '../model/constants';
import type { PredictionIntegration } from '../model/types';
import PredictionIntegrationMetrics from './PredictionIntegrationMetrics.vue';

defineOptions({
  name: 'PredictionIntegrationCard',
});

const props = defineProps<{
  integration: PredictionIntegration;
}>();

const { t } = useI18n({ useScope: 'global' });

// Полная блокировка карточки: сервис в ERROR и ни разу не было успешного расчета (фаза POC, WT-291)
const isBlocked = computed(
  () => props.integration.tooltipIcon === 'error' && props.integration.lastCalculation === null,
);
</script>

<template>
  <article
    class="min-h-32 shrink-0 px-2 pb-2 bg-(--bg-surface-neutral) rounded-(--radius-md) flex flex-col justify-start items-start"
    :class="{ 'opacity-60': isBlocked }"
    :data-blocked="isBlocked || undefined"
  >
    <div class="self-stretch p-3 inline-flex justify-start items-center gap-4">
      <div class="flex-1 flex justify-start items-center gap-3 min-w-0">
        <div
          :data-name="integration.name"
          class="size-7 shrink-0 relative rounded-(--radius-full) flex items-center justify-center overflow-hidden"
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
              :aria-label="
                t('predictions.manager.serviceInfoAriaLabel', { name: integration.name })
              "
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
              class="px-2 py-1.5 bg-(--bg-foreground-overlay) rounded-(--radius-sm) shadow-(--shadow-panel) backdrop-blur-[20px] flex flex-col justify-center items-center"
            >
              <p
                class="text-(--text-overlay) text-xs font-normal font-['Geist'] leading-4 whitespace-pre-line"
              >
                {{ t(`predictions.manager.serviceTooltip.${integration.serviceState}`) }}
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
