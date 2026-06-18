<script setup lang="ts">
import { computed } from 'vue';

import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppDrawer } from '@/shared/ui/AppDrawer';

import { datasetTemplates, useDatasetFiles } from '../../model';
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

// Вычисляем общее количество загруженных файлов для шапки и футера
const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
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
  if (totalUploadedFiles.value > 0) {
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
          <!-- Динамический счетчик файлов из LocalStorage -->
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
      <DatasetUploadFooter
        :disabled="totalUploadedFiles === 0"
        @cancel="emit('close')"
        @submit="handleSubmit"
      />
    </template>
  </AppDrawer>
</template>
