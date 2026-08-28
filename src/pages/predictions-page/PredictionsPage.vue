<script setup lang="ts">
import { PredictionRunHistory, predictionRunHistory } from '@/widgets/prediction-run-history';
import { PredictionsManager } from '@/widgets/predictions-manager';

defineOptions({
  name: 'PredictionsPage',
});
</script>

<template>
  <div class="flex w-full flex-col gap-10 bg-(--background)">
    <PredictionsManager />

    <PredictionRunHistory :items="predictionRunHistory" />
  </div>
</template>
