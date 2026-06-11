<script setup lang="ts">
import { ref } from 'vue';

import { DatasetUploadDrawer } from '@/widgets/DatasetUploadDrawer/ui/DatasetUploadDrawer';
import UploadsEmptyState from '@/widgets/UploadsEmptyState/UploadsEmptyState.vue';

const isDrawerOpen = ref(true); //TODO: изменить по завершению
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h1 class="text-title-sm font-medium text-(--text-primary)">Загрузка данных</h1>

      <p class="max-w-[473px] text-body-sm text-(--text-secondary)">
        Загружайте данные для обучения модели и получения предсказаний — через файл, S3-бакет или
        API.
      </p>
    </div>

    <UploadsEmptyState @upload="isDrawerOpen = true" />

    <DatasetUploadDrawer :open="isDrawerOpen" @close="isDrawerOpen = false" />
  </div>
</template>
