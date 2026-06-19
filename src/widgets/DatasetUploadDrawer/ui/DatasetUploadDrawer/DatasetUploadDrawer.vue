<script setup lang="ts">
import { computed } from 'vue';

import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppDrawer } from '@/shared/ui/AppDrawer';

import { datasetTemplates, MAX_FILE_SIZE, useDatasetFiles } from '../../model';
import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

// Подключаем реактивное хранилище LocalStorage
const { filesMap, addFiles, removeFile, clearTemplateFiles } = useDatasetFiles();

// Объединяем дефолтные шаблоны со стейтом файлов из LocalStorage,
// чтобы дочерний DatasetTemplateItem увидел файлы через пропсы, как он и ожидает.
const templatesWithFiles = computed(() => {
  return datasetTemplates.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

// Вычисляем общее количество загруженных файлов для шапки (включая файлы с ошибками)
const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
});

// Проверяем наличие валидных файлов для активации кнопки в футере
const hasValidFiles = computed(() => {
  // Собираем все загруженные файлы в один плоский массив
  const allFiles = Object.values(filesMap.value).flat();

  // Кнопка заблокирована, если файлов нет вообще
  if (allFiles.length === 0) return false;

  // Кнопка активна только если ВСЕ загруженные файлы не превышают лимит в 500 МБ
  return allFiles.every((file) => file.size <= MAX_FILE_SIZE);
});

// При добавлении файлов через инпут или Drag-and-Drop аккордеона
const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  addFiles(templateId, uploadedFiles);
};

// При поштучном удалении файла через корзину строки
const handleRemove = (templateId: string, fileId: string) => {
  removeFile(fileId);
};

// При полной очистке категории через выпадающий список Radix
const handleClearAll = (templateId: string) => {
  clearTemplateFiles(templateId);
};

// Клик по главной кнопке отправки в футере
const handleSubmit = () => {
  // Дополнительная проверка безопасности перед отправкой события
  if (hasValidFiles.value) {
    emit('submit');
  }
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка CSV" @close="emit('close')">
    <!-- ОСНОВНОЙ КОНТЕНТ (автоматически скроллится встроенным в AppDrawer механизмом) -->
    <div class="flex flex-col gap-6 text-left">
      <DownloadTemplatesBanner />

      <section class="flex flex-col gap-4">
        <header class="flex flex-col gap-1">
          <!-- Динамический счетчик файлов из LocalStorage (выводит общее число файлов) -->
          <h3 class="text-sm font-medium text-(--text-primary)">
            Загруженные файлы {{ totalUploadedFiles }}
          </h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Загрузите один или несколько типов данных для обучения моделей. <br />
            Максимальный размер: 500 МБ на файл, формат CSV.
          </p>
        </header>

        <!-- Список категорий (Users, Bets, Payments и т.д.) -->
        <DatasetTemplatesList
          :templates="templatesWithFiles"
          @upload="handleUpload"
          @remove="handleRemove"
          @clear-all="handleClearAll"
        />
      </section>
    </div>

    <!-- СИСТЕМНЫЙ СЛОТ ФУТЕРА ДРОПДАУНА -->
    <template #footer>
      <!-- Кнопка «Загрузить и обработать» заблокирована, если файлов нет или есть файлы с ошибками размера -->
      <DatasetUploadFooter
        :disabled="!hasValidFiles"
        @cancel="emit('close')"
        @submit="handleSubmit"
      />
    </template>
  </AppDrawer>
</template>
