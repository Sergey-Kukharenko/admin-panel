<script setup lang="ts">
import { predictionStatusIconByStatus } from '../model/constants';
import type { PredictionIntegration } from '../model/types';

defineOptions({
  name: 'PredictionIntegrationMetrics',
});

defineProps<{
  integration: PredictionIntegration;
}>();
</script>

<template>
  <div
    class="self-stretch pl-3 pr-1.5 py-3 bg-[var(--background)] rounded-[var(--radius-sm)] inline-flex justify-start items-center gap-2 mt-auto mb-1"
  >
    <div class="w-36 h-8 inline-flex flex-col justify-start items-start">
      <div
        class="self-stretch justify-start text-[var(--text-secondary)] text-[8.11px] font-normal font-['Geist_Mono'] uppercase leading-4 tracking-tight"
      >
        Статус результата
      </div>

      <div
        :data-status="integration.status"
        data-type="results"
        class="max-h-5 rounded-sm inline-flex justify-end items-center gap-[3.25px]"
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
          class="justify-start text-[9.74px] font-medium font-['Geist_Mono'] uppercase leading-4"
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

    <div class="w-20 h-8 inline-flex flex-col justify-start items-start">
      <div
        class="self-stretch justify-start text-[var(--text-secondary)] text-[8.11px] font-normal font-['Geist_Mono'] uppercase leading-4 tracking-tight"
      >
        Следующий расчет
      </div>

      <div class="inline-flex justify-start items-center gap-1.5">
        <div
          class="justify-start text-[var(--text-primary)] text-[9.74px] font-medium font-['Geist_Mono'] uppercase leading-4"
        >
          {{ integration.nextCalculation }}
        </div>
      </div>
    </div>

    <div class="w-20 h-8 inline-flex flex-col justify-start items-start">
      <div
        class="justify-start text-[var(--text-secondary)] text-[8.11px] font-normal font-['Geist_Mono'] uppercase leading-4 tracking-tight"
      >
        Последний расчет
      </div>

      <div
        class="justify-start text-[var(--text-primary)] text-[9.74px] font-medium font-['Geist_Mono'] uppercase leading-4"
      >
        {{ integration.lastCalculation }}
      </div>
    </div>
  </div>
</template>
