<script setup lang="ts">
import { computed, ref } from 'vue';

import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppConfirmDialog } from '@/shared/ui/AppConfirmDialog'; // Импортируем наше модальное окно
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

const { filesMap, addFiles, removeFile, clearTemplateFiles } = useDatasetFiles();

// Переменная состояния для управления модальным окном подтверждения
const isConfirmOpen = ref(false);

const templatesWithFiles = computed(() => {
  return datasetTemplates.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
});

const hasValidFiles = computed(() => {
  const allFiles = Object.values(filesMap.value).flat();
  if (allFiles.length === 0) return false;
  return allFiles.every((file) => file.size <= MAX_FILE_SIZE);
});

const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  addFiles(templateId, uploadedFiles);
};

const handleRemove = (templateId: string, fileId: string) => {
  removeFile(fileId);
};

const handleClearAll = (templateId: string) => {
  clearTemplateFiles(templateId);
};

// 1. Клик по кнопке футера шторки: открывает окно подтверждения вместо отправки
const handleDrawerSubmit = () => {
  if (hasValidFiles.value) {
    isConfirmOpen.value = true;
  }
};

// 2. Клик по черной кнопке «Да, отправить» внутри модального окна
const handleFinalConfirm = () => {
  isConfirmOpen.value = false;

  // Очищаем локальное хранилище после успешной отправки данных
  localStorage.removeItem('dataset_uploaded_files');
  filesMap.value = {};

  emit('submit'); // Отправляем событие на верхний уровень приложения
  emit('close'); // Закрываем шторку загрузки файлов
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка CSV" @close="emit('close')">
    <div class="flex flex-col gap-6 text-left">
      <DownloadTemplatesBanner />

      <section class="flex flex-col gap-4">
        <header class="flex flex-col gap-1">
          <h3 class="text-sm font-medium text-(--text-primary)">
            Загруженные файлы {{ totalUploadedFiles }}
          </h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Загрузите один или несколько типов данных для обучения моделей. <br />
            Максимальный размер: 500 МБ на файл, формат CSV.
          </p>
        </header>

        <DatasetTemplatesList
          :templates="templatesWithFiles"
          @upload="handleUpload"
          @remove="handleRemove"
          @clear-all="handleClearAll"
        />
      </section>
    </div>

    <template #footer>
      <!-- Направляем клик на функцию открытия модального окна -->
      <DatasetUploadFooter
        :disabled="!hasValidFiles"
        @cancel="emit('close')"
        @submit="handleDrawerSubmit"
      />
    </template>
  </AppDrawer>

  <!-- КОМПОНЕНТ МОДАЛЬНОГО ОКНА ПОДТВЕРЖДЕНИЯ -->
  <AppConfirmDialog
    :open="isConfirmOpen"
    title="Подтвердите отправку"
    description="Действие нельзя отменить. Файлы будут отправлены для обучения ML-моделей. После отправки данные нельзя будет отозвать. Процесс обучения займёт от 5 до 14 дней."
    @close="isConfirmOpen = false"
    @confirm="handleFinalConfirm"
  />
</template>
