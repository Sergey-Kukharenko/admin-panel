<script setup lang="ts">
defineOptions({
  name: 'PredictionRunHistoryEmptyState',
});
</script>

<template>
  <div class="flex w-full flex-1 flex-col items-center justify-center py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <p class="text-lg font-medium leading-6 text-(--text-primary)">Результаты пока недоступны</p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        Результаты появятся после завершения обработки данных
      </p>
    </div>
  </div>
</template>
