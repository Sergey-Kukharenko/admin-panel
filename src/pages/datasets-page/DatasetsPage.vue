<script setup lang="ts">
import { computed, ref } from 'vue';

import { AppSourceCard, AppSourceCardContainer } from '@/shared/ui/app-source-card';
import { DatasetHistoryTable } from '@/widgets/dataset-history-table';
import { DatasetUploadDrawer } from '@/widgets/dataset-upload-drawer';

defineOptions({
  name: 'DatasetsPage',
});

// Флаг открытия шторки
const isDrawerOpen = ref(false);

// Есть ли реальная история загрузок (шаблоны и файлы) — решает виджет DatasetHistoryTable,
// сюда приходит только для управления карточками статусов подключения выше
const hasHistory = ref(true);

// Реактивный массив статусов для источников данных
const sourcesStatuses = computed(() => [
  { id: 'csv', label: 'CSV загрузка', statusText: 'Активен', isActive: true },
  { id: 's3', label: 'S3 Bucket', statusText: 'Неактивен', isActive: false },
  { id: 'api', label: 'API', statusText: 'Неактивен', isActive: false },
]);
</script>

<template>
  <div class="flex w-full flex-col gap-10 text-left">
    <!-- Шапка страницы: Заголовок, описание и статусы подключений (всегда сверху) -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-title-sm font-medium text-(--text-primary)">Загрузка данных</h1>

        <p class="max-w-118.25 text-body-sm text-(--text-secondary)">
          Загружайте данные для работы платформы и получения предсказаний — через файл, S3 или API.
        </p>
      </div>

      <!-- Контейнер со статус-картами каналов загрузки -->
      <AppSourceCardContainer v-if="hasHistory">
        <AppSourceCard
          v-for="source in sourcesStatuses"
          :key="source.id"
          :label="source.label"
          :status-text="source.statusText"
          :is-active="source.isActive"
        />
      </AppSourceCardContainer>
    </div>

    <!-- Виджет сам решает, показывать таблицу истории или пустое состояние -->
    <DatasetHistoryTable
      v-model:has-history="hasHistory"
      @open-upload-drawer="isDrawerOpen = true"
    />

    <!-- Шторка загрузки файлов -->
    <DatasetUploadDrawer
      :open="isDrawerOpen"
      @close="isDrawerOpen = false"
      @submit="isDrawerOpen = false"
    />
  </div>
</template>
