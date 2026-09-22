<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';
import { computed } from 'vue';

import { predictionStatusIconByStatus } from '../model/constants';
import type { PredictionIntegration } from '../model/types';

defineOptions({
  name: 'PredictionIntegrationMetrics',
});

const props = defineProps<{
  integration: PredictionIntegration;
}>();

const hasPreviousResult = computed(() => props.integration.lastCalculation !== null);

// Тултип над бейджем: для generating — текст статуса вычисления (Training/Generating,
// по макетам), для failed — сообщение об ошибке обновления с датой последнего успешного
// расчета, если он был (PRD: "Мониторинг готовности результата по продуктам/Сервисам")
const badgeTooltipText = computed(() => {
  if (props.integration.status === 'generating') {
    return hasPreviousResult.value ? 'Generating' : 'Training';
  }

  if (props.integration.status === 'failed') {
    const base = 'Последняя попытка обновления завершилась ошибкой';
    return hasPreviousResult.value
      ? `${base}. Последний доступный результат: ${props.integration.lastCalculation}`
      : base;
  }

  return null;
});
</script>

<template>
  <div
    class="self-stretch pl-3 pr-[7px] py-3 bg-[var(--background)] rounded-[var(--radius-sm)] flex items-center gap-[9px]"
  >
    <!-- Колонка 1: Статус -->
    <div class="flex-1 min-w-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-[8.11px] font-normal uppercase leading-4 text-[var(--text-secondary)] truncate"
      >
        Статус результата
      </div>

      <TooltipRoot v-if="badgeTooltipText">
        <TooltipTrigger as-child>
          <div
            :data-status="integration.status"
            data-type="results"
            class="max-h-5 rounded-sm inline-flex justify-end items-center gap-[3.25px] cursor-help"
          >
            <div class="size-3 relative overflow-hidden flex items-center justify-center">
              <img
                :src="predictionStatusIconByStatus[integration.status]"
                alt=""
                class="size-2.5 object-contain"
                :class="{ 'animate-spin': integration.status === 'generating' }"
              />
            </div>

            <div
              class="justify-start font-mono text-[9.74px] font-medium uppercase leading-4 truncate"
              :class="{
                'text-[var(--danger-failed)]': integration.status === 'failed',
                'text-[var(--text-primary)]': integration.status !== 'failed',
              }"
            >
              {{ integration.status }}
            </div>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          :side-offset="6"
          class="z-50 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
        >
          <div
            class="px-2 py-1.5 bg-(--bg-foreground-overlay) rounded-sm shadow-(--shadow-panel) backdrop-blur-[20px] flex flex-col justify-center items-center"
          >
            <p class="text-(--text-overlay) text-xs font-normal leading-4">
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
        class="max-h-5 rounded-sm inline-flex justify-end items-center gap-[3.25px]"
      >
        <div class="size-3 relative overflow-hidden flex items-center justify-center">
          <img
            :src="predictionStatusIconByStatus[integration.status]"
            alt=""
            class="size-2.5 object-contain"
          />
        </div>

        <div
          class="justify-start font-mono text-[9.74px] font-medium uppercase leading-4 truncate"
          :class="{
            'text-[var(--success-ready)]': integration.status === 'ready',
            'text-[var(--danger-failed)]': integration.status === 'failed',
            'text-[var(--text-primary)]':
              integration.status !== 'ready' && integration.status !== 'failed',
          }"
        >
          {{ integration.status }}
        </div>
      </div>
    </div>

    <!-- Колонка 2: Следующий расчет -->
    <div class="w-[80.331px] shrink-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-[8.11px] font-normal uppercase leading-4 text-[var(--text-secondary)] whitespace-nowrap"
      >
        Следующий расчет
      </div>

      <div class="inline-flex justify-start items-center gap-1.5">
        <div
          class="justify-start font-mono text-[9.74px] font-medium uppercase leading-4 text-[var(--text-primary)] whitespace-nowrap"
        >
          {{ integration.nextCalculation }}
        </div>
      </div>
    </div>

    <!-- Колонка 3: Последний расчет -->
    <div class="w-[79.52px] shrink-0 flex flex-col justify-start items-start">
      <div
        class="self-stretch font-mono text-[8.11px] font-normal uppercase leading-4 text-[var(--text-secondary)] whitespace-nowrap"
      >
        Последний расчет
      </div>

      <div
        class="justify-start font-mono text-[9.74px] font-medium uppercase leading-4 text-[var(--text-primary)] whitespace-nowrap"
      >
        {{ integration.lastCalculation ?? '-' }}
      </div>
    </div>

    <!-- Кнопка скачивания: предохранитель — заблокирована, пока не было ни одного успешного расчета -->
    <button
      type="button"
      :disabled="!hasPreviousResult"
      :aria-label="`Скачать результат ${integration.name}`"
      class="ml-auto size-9 shrink-0 flex items-center justify-center rounded-(--radius-lg) bg-(--bg-button-secondary) transition-opacity hover:bg-(--bg-button-secondary-hover) disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-(--bg-button-secondary)"
    >
      <Download class="size-4 text-(--text-primary)" />
    </button>
  </div>
</template>
