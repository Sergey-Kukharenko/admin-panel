<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';

import {
  predictionStatusColorClassByStatus,
  predictionStatusIconByStatus,
} from '../config/constants';
import type { PredictionIntegration, PredictionStatus } from '../model/types';

defineOptions({
  name: 'PredictionIntegrationMetrics',
});

const props = defineProps<{
  integration: PredictionIntegration;
}>();

const { t } = useI18n({ useScope: 'global' });

// Statuses with an explanation in the tooltip: run statuses of the scheduled run (WT-555)
const TOOLTIP_KEY_BY_STATUS: Partial<Record<PredictionStatus, string>> = {
  failed: 'predictions.manager.badgeTooltip.failed',
  outdated: 'predictions.manager.badgeTooltip.outdated',
  invalidData: 'predictions.manager.badgeTooltip.invalidData',
  delayed: 'predictions.manager.badgeTooltip.delayed',
};

// Тултип над бейджем: для generating — текст статуса вычисления (Training/Generating,
// по макетам; Training — по service_status из бэкенда), для failed — текст из макета
// «Ошибка при генерации предикта»
const badgeTooltipText = computed(() => {
  const { status, isTraining, isAwaitingSchedule } = props.integration;

  if (status === 'generating') {
    return t(
      isTraining
        ? 'predictions.manager.badgeTooltip.training'
        : 'predictions.manager.badgeTooltip.generating',
    );
  }

  if (status === 'awaiting' && isAwaitingSchedule) {
    return t('predictions.manager.badgeTooltip.awaitingSchedule');
  }

  const tooltipKey = TOOLTIP_KEY_BY_STATUS[status];

  return tooltipKey ? t(tooltipKey) : null;
});

const statusLabel = computed(() =>
  t(`predictions.manager.statusLabel.${props.integration.status}`),
);
const statusColorClass = computed(
  () => predictionStatusColorClassByStatus[props.integration.status],
);
</script>

<template>
  <div
    class="self-stretch p-3 bg-[var(--background)] rounded-(--radius-lg) flex items-center gap-4"
  >
    <!-- Колонка 1: Статус -->
    <div class="flex-1 min-w-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-element-small-caption font-normal uppercase text-[var(--text-secondary)] truncate"
      >
        {{ t('predictions.manager.resultStatus') }}
      </div>

      <TooltipRoot v-if="badgeTooltipText">
        <TooltipTrigger as-child>
          <div
            :data-status="integration.status"
            data-type="results"
            class="max-w-full rounded-(--radius-sm) inline-flex justify-end items-center gap-1 cursor-help"
            :class="statusColorClass"
          >
            <div class="size-3.5 shrink-0 flex items-center justify-center">
              <AppIcon
                :name="predictionStatusIconByStatus[integration.status]"
                class="size-3.5"
                :class="{ 'animate-spin': integration.status === 'generating' }"
              />
            </div>

            <div
              class="min-w-0 justify-start font-mono text-element-tag font-medium uppercase truncate"
            >
              {{ statusLabel }}
            </div>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          :side-offset="6"
          class="max-w-56 z-50 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
        >
          <div
            class="px-2 py-1.5 bg-(--bg-foreground-overlay) rounded-(--radius-sm) shadow-(--shadow-panel) backdrop-blur-[20px] flex flex-col justify-center items-center"
          >
            <p class="text-(--text-overlay) text-xs font-normal leading-4 whitespace-pre-line">
              {{ badgeTooltipText }}
            </p>
          </div>

          <TooltipArrow class="fill-(--bg-foreground-overlay)" :width="8" :height="4" />
        </TooltipContent>
      </TooltipRoot>

      <div
        v-else
        :data-status="integration.status"
        data-type="results"
        class="max-w-full rounded-(--radius-sm) inline-flex justify-end items-center gap-1"
        :class="statusColorClass"
      >
        <div class="size-3.5 shrink-0 flex items-center justify-center">
          <AppIcon :name="predictionStatusIconByStatus[integration.status]" class="size-3.5" />
        </div>

        <div
          class="min-w-0 justify-start font-mono text-element-tag font-medium uppercase truncate"
        >
          {{ statusLabel }}
        </div>
      </div>
    </div>

    <!-- Колонка 2: Следующий расчет -->
    <div class="flex-1 min-w-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-element-small-caption font-normal uppercase text-[var(--text-secondary)] truncate"
      >
        {{ t('predictions.manager.nextRun') }}
      </div>

      <div class="flex max-w-full min-w-0 justify-start items-center gap-1.5">
        <div
          class="justify-start font-mono text-element-tag font-medium uppercase text-[var(--text-primary)] truncate"
        >
          {{ integration.nextCalculation }}
        </div>
      </div>
    </div>

    <!-- Колонка 3: Последний расчет -->
    <div class="flex-1 min-w-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-element-small-caption font-normal uppercase text-[var(--text-secondary)] truncate"
      >
        {{ t('predictions.manager.lastRun') }}
      </div>

      <div
        class="max-w-full justify-start font-mono text-element-tag font-medium uppercase text-[var(--text-primary)] truncate"
      >
        {{ integration.lastCalculation ?? '-' }}
      </div>
    </div>
  </div>
</template>
