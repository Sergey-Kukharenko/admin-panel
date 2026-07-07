<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { AppSourceCard, AppSourceCardContainer } from '@/shared/ui/app-source-card';
import { DatasetHistoryTable } from '@/widgets/dataset-history-table';
import { DatasetUploadDrawer } from '@/widgets/dataset-upload-drawer';
import { UploadsEmptyState } from '@/widgets/uploads-empty-state';

defineOptions({
  name: 'DatasetUploadPage',
});

// Флаг открытия шторки (поставили false по умолчанию для продакшн-логики)
const isDrawerOpen = ref(false);

// Флаг для управления отображением таблицы истории загрузок
const showHistoryTable = ref(false);

// Реактивный массив статусов для источников данных
const sourcesStatuses = computed(() => [
  { id: 'csv', label: 'CSV загрузка', statusText: 'Активен', isActive: true },
  { id: 's3', label: 'S3 Bucket', statusText: 'Неактивен', isActive: false },
  { id: 'api', label: 'API', statusText: 'Неактивен', isActive: false },
]);

// Проверяем LocalStorage при старте: если пользователь ранее уже отправлял файлы,
// таблица должна быть видна сразу, чтобы состояние не терялось при перезагрузке
onMounted(() => {
  const hasHistory = localStorage.getItem('dataset_history_submitted') === 'true';
  if (hasHistory) {
    showHistoryTable.value = true;
  }
});

// Этот метод вызывается, когда в модальном окне шторки нажали «Да, отправить»
const handleUploadSubmit = () => {
  // 1. Сохраняем состояние отправки в LocalStorage
  localStorage.setItem('dataset_history_submitted', 'true');

  // 2. Включаем отображение таблицы истории загрузок на странице
  showHistoryTable.value = true;

  // 3. Закрываем шторку загрузки
  isDrawerOpen.value = false;
};
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
      <AppSourceCardContainer v-if="showHistoryTable">
        <AppSourceCard
          v-for="source in sourcesStatuses"
          :key="source.id"
          :label="source.label"
          :status-text="source.statusText"
          :is-active="source.isActive"
        />
      </AppSourceCardContainer>
    </div>

    <!-- СОСТОЯНИЕ А: Файлы еще не отправлены. Показываем пустое состояние -->
    <UploadsEmptyState v-if="!showHistoryTable" @upload="isDrawerOpen = true" />

    <!-- СОСТОЯНИЕ Б: Кликнули «Да, отправить». Плавно рендерим виджет таблицы с фильтрами -->
    <Transition
      enter-from-class="opacity-0 translate-y-1"
      enter-active-class="transition-all duration-300 ease-out"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="showHistoryTable" class="w-full">
        <!-- Слушаем событие @open-upload-drawer из тулбара таблицы, чтобы открывать эту же шторку -->
        <DatasetHistoryTable @open-upload-drawer="isDrawerOpen = true" />
      </div>
    </Transition>

    <!-- Шторка загрузки файлов, теперь слушает наше событие @submit -->
    <DatasetUploadDrawer
      :open="isDrawerOpen"
      @close="isDrawerOpen = false"
      @submit="handleUploadSubmit"
    />
  </div>
</template>
