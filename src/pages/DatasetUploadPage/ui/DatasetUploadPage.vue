<script setup lang="ts">
import UploadsEmptyState from '@/widgets/UploadsEmptyState/UploadsEmptyState.vue';
</script>

<template>
  <div class="flex flex-col gap-8 w-full">
    <!-- Шапка страницы со строгими стилями из Figma спецификации -->
    <div class="flex flex-col gap-1">
      <h1 class="text-[18px] font-medium leading-[24px] text-(--text-primary)">Загрузка данных</h1>
      <p class="max-w-[473px] text-[14px] font-normal leading-[20px] text-(--text-secondary)">
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
