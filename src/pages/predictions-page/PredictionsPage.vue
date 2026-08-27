<script setup lang="ts">
import { PredictionProcessingSchedule } from '@/widgets/prediction-processing-schedule';
import { PredictionRunHistory, predictionRunHistory } from '@/widgets/prediction-run-history';
import { PredictionsManager } from '@/widgets/predictions-manager';

defineOptions({
  name: 'PredictionsPage',
});
</script>

<template>
  <div class="flex w-full flex-col gap-10 bg-(--background)">
    <div class="flex w-full items-start gap-6">
      <div class="min-w-0 flex-1">
        <PredictionsManager />
      </div>

      <aside class="mt-8 shrink-0">
        <PredictionProcessingSchedule />
      </aside>
    </div>

    <PredictionRunHistory :items="predictionRunHistory" />
  </div>
</template>
