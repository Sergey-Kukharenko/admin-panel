<script setup lang="ts">
defineOptions({
  name: 'PredictionsManagerEmptyState',
});
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center py-8">
    <div class="flex max-w-85 flex-col items-center gap-1 text-center">
      <p class="text-lg font-medium leading-6 text-(--text-primary)">Продукты пока недоступны</p>
      <p class="text-sm font-normal leading-5 text-(--text-secondary)">
        Продукты и сервисы появятся здесь после настройки проекта
      </p>
    </div>
  </div>
</template>
