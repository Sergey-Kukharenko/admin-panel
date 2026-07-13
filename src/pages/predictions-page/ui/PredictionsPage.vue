<script setup lang="ts">
import { PredictionProcessingSchedule } from '@/widgets/prediction-processing-schedule';
import { PredictionsManager } from '@/widgets/predictions-manager';

defineOptions({
  name: 'PredictionsPage',
});
</script>

<template>
  <div class="w-full min-h-screen bg-(--background)">
    <div class="flex w-full items-start gap-6">
      <main class="min-w-0 flex-1">
        <PredictionsManager />
      </main>

      <aside class="mt-8 shrink-0">
        <PredictionProcessingSchedule />
      </aside>
    </div>
  </div>
</template>
