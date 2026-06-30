<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { DatasetHistoryTable } from '@/widgets/dataset-history-table';
import { DatasetUploadDrawer } from '@/widgets/dataset-upload-drawer';
import UploadsEmptyState from '@/widgets/uploads-empty-state/UploadsEmptyState.vue';

defineOptions({
  name: 'DatasetUploadPage',
});

// Флаг открытия шторки (поставили false по умолчанию для продакшн-логики)
const isDrawerOpen = ref(false);

// Флаг для управления отображением таблицы истории загрузок
const showHistoryTable = ref(false);

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
  <div class="flex w-full flex-col gap-4 text-left">
    <!-- Заголовок и описание страницы (всегда остаются сверху) -->
    <div class="flex flex-col gap-1">
      <h1 class="text-title-sm font-medium text-(--text-primary)">Загрузка данных</h1>

      <p class="max-w-[473px] text-body-sm text-(--text-secondary)">
        Загружайте данные для обучения модели и получения предсказаний — через файл, S3-бакет или
        API.
      </p>
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
