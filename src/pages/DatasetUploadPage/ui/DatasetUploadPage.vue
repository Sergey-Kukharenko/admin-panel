<script setup lang="ts">
import UploadsEmptyState from '@/widgets/UploadsEmptyState/UploadsEmptyState.vue';
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Шапка страницы со строгими стилями из Figma спецификации -->
    <div class="flex flex-col gap-1">
      <h1 class="text-title-sm font-medium text-(--text-primary)">Загрузка данных</h1>

      <p class="max-w-[473px] text-body-sm text-(--text-secondary)">
        Загружайте данные для обучения модели и получения предсказаний — через файл, S3-бакет или
        API.
      </p>
    </div>

    <!-- TODO: возможно удалится -->
    <!-- <UploadMethods /> -->

    <!-- Область пустого состояния (виджет) -->
    <UploadsEmptyState />
  </div>
</template>
